// src/app/admin/hooks/useChatLogs.ts - PART 1/3

import { useState, useCallback } from 'react';
import { ChatLog, ChatSession, Notification } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ConversationBox } from '../components/ChatLogsTab/types';

export const useChatLogs = (setNotification: (notification: Notification | null) => void) => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Device-aware chat logs loading with different strategies
  const loadChatLogs = useCallback(async (sessionId?: string) => {
    try {
      setIsLoading(true);
      
      // Device-specific retry and timeout configuration
      const loadConfig = {
        mobile: { maxRetries: 2, timeout: 10000, limit: 50 },
        tablet: { maxRetries: 3, timeout: 8000, limit: 150 },
        desktop: { maxRetries: 3, timeout: 6000, limit: 500 }
      };

      const { maxRetries, timeout, limit } = loadConfig[deviceType];

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          // Device-specific URL construction
          let url: string;
          if (sessionId) {
            // Loading specific session - device-specific limits
            const sessionLimit = deviceType === 'mobile' ? 50 : 100;
            url = `/api/chat-logs?client=techequity&sessionId=${sessionId}&limit=${sessionLimit}&deviceType=${deviceType}`;
          } else {
            // Loading all logs - device-specific limits and parameters
            const queryParams = new URLSearchParams({
              client: 'techequity',
              limit: limit.toString(),
              deviceType: deviceType,
              isTouchDevice: isTouchDevice.toString()
            });
            url = `/api/chat-logs?${queryParams}`;
          }
          
          const response = await fetch(url, {
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          const result = await response.json();
          
          if (result.success) {
            // Device-specific data processing
            let logsData = result.data;
            
            if (deviceType === 'mobile') {
              // Mobile: Process for performance - keep only recent and essential data
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              
              logsData = logsData
                .filter((log: ChatLog) => new Date(log.timestamp) >= thirtyDaysAgo)
                .sort((a: ChatLog, b: ChatLog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 50); // Hard limit for mobile
            } else if (deviceType === 'tablet') {
              // Tablet: Balanced data - keep recent 60 days
              const sixtyDaysAgo = new Date();
              sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
              
              logsData = logsData
                .filter((log: ChatLog) => new Date(log.timestamp) >= sixtyDaysAgo)
                .sort((a: ChatLog, b: ChatLog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 150);
            }
            // Desktop: Keep all data without filtering
            
            setChatLogs(logsData);
            console.log(`Loaded ${logsData.length} chat logs for ${deviceType}`);
            break;
          } else {
            console.error('Failed to load chat logs:', result.error);
            if (attempt === maxRetries - 1) {
              // Device-specific error notifications
              const errorMessages = {
                mobile: 'Cannot load chat data. Check connection.',
                tablet: 'Failed to load chat logs: ' + result.error,
                desktop: 'Failed to load chat logs: ' + result.error
              };
              
              setNotification({ 
                type: 'error', 
                message: errorMessages[deviceType]
              });
              
              setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
            }
          }
        } catch (error) {
          console.error(`Chat logs load attempt ${attempt + 1} failed:`, error);
          if (attempt < maxRetries - 1) {
            // Device-specific retry delays
            const retryDelays = {
              mobile: 2000,
              tablet: 1500,
              desktop: 1000
            };
            
            await new Promise(resolve => setTimeout(resolve, retryDelays[deviceType]));
          } else {
            // Final error handling
            const errorMessages = {
              mobile: 'Connection error. Try again.',
              tablet: 'Error loading chat logs. Please try again.',
              desktop: 'Error loading chat logs. Please try again.'
            };
            
            setNotification({ 
              type: 'error', 
              message: errorMessages[deviceType]
            });
            setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
          }
        }
      }
    } catch (error) {
      console.error('Error loading chat logs:', error);
      
      // Device-specific final error messages
      const errorMessages = {
        mobile: 'App error. Restart needed.',
        tablet: 'Error loading chat logs. Please try again.',
        desktop: 'Error loading chat logs. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
    } finally {
      setIsLoading(false);
    }
  }, [setNotification, deviceType, isTouchDevice]);

  // Device-aware conversation deletion with different confirmation strategies
  const deleteConversation = useCallback(async (sessionId: string) => {
    try {
      // Device-specific confirmation
      const confirmMessages = {
        mobile: 'Delete this conversation?',
        tablet: 'Delete this entire conversation?',
        desktop: 'Are you sure you want to delete this entire conversation? This action cannot be undone.'
      };

      setIsLoading(true);
      
      // Device-specific delete configuration
      const deleteConfig = {
        mobile: { timeout: 12000, showProgress: true },
        tablet: { timeout: 10000, showProgress: false },
        desktop: { timeout: 8000, showProgress: false }
      };

      const { timeout, showProgress } = deleteConfig[deviceType];

      if (showProgress) {
        console.log(`Deleting conversation on ${deviceType}...`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`/api/chat-logs?client=techequity&sessionId=${sessionId}&deviceType=${deviceType}`, {
        method: 'DELETE',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      
      if (result.success) {
        // Remove deleted conversation from local state
        setChatLogs(prevLogs => prevLogs.filter(log => log.sessionId !== sessionId));
        
        // Clear selection if the deleted conversation was selected
        if (selectedSession === sessionId) {
          setSelectedSession(null);
        }
        
        // Device-specific success notifications
        const successMessages = {
          mobile: 'Deleted!',
          tablet: 'Conversation deleted successfully!',
          desktop: 'Conversation deleted successfully!'
        };
        
        setNotification({ 
          type: 'success', 
          message: successMessages[deviceType]
        });
        
        // Device-specific success timing
        const successDurations = {
          mobile: 2000,
          tablet: 3000,
          desktop: 3000
        };
        
        setTimeout(() => setNotification(null), successDurations[deviceType]);
        
        console.log(`Deleted conversation: ${sessionId} on ${deviceType}`);
      } else {
        console.error('Failed to delete conversation:', result.error);
        
        // Device-specific error messages
        const errorMessages = {
          mobile: 'Delete failed. Try again.',
          tablet: 'Failed to delete conversation: ' + result.error,
          desktop: 'Failed to delete conversation: ' + result.error
        };
        
        setNotification({ 
          type: 'error', 
          message: errorMessages[deviceType]
        });
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      
      // Device-specific error handling
      const errorMessages = {
        mobile: 'Connection error.',
        tablet: 'Error deleting conversation. Please try again.',
        desktop: 'Error deleting conversation. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSession, setNotification, deviceType]);

  const extractUserName = (messages: ChatLog[]): string => {
  // Look for any message in this session that has userInfo
  const messageWithUserInfo = messages.find(msg => 
    msg.userInfo && 
    (msg.userInfo.userName || msg.userInfo.firstName)
  );
  
  if (messageWithUserInfo && messageWithUserInfo.userInfo) {
    if (messageWithUserInfo.userInfo.userName) {
      return messageWithUserInfo.userInfo.userName;
    } else if (messageWithUserInfo.userInfo.firstName) {
      return messageWithUserInfo.userInfo.lastName 
        ? `${messageWithUserInfo.userInfo.firstName} ${messageWithUserInfo.userInfo.lastName}`
        : messageWithUserInfo.userInfo.firstName;
    }
  }
  
  return 'Anonymous User';
};

  // Device-aware chat session processing with different complexity levels
  const processChatSessions = useCallback((logs: ChatLog[]) => {
    const sessionMap = new Map<string, {
      sessionId: string;
      messages: ChatLog[];
      firstMessage: string;
      lastActivity: string;
      hasAppointment: boolean;
    }>();

    // Group messages by session
    logs.forEach(log => {
      if (!sessionMap.has(log.sessionId)) {
        sessionMap.set(log.sessionId, {
          sessionId: log.sessionId,
          messages: [],
          firstMessage: '',
          lastActivity: log.timestamp,
          hasAppointment: false
        });
      }
      
      const session = sessionMap.get(log.sessionId)!;
      session.messages.push(log);
      
      // Update last activity
      if (new Date(log.timestamp) > new Date(session.lastActivity)) {
        session.lastActivity = log.timestamp;
      }
      
      // Device-specific appointment detection
      if (deviceType === 'mobile') {
        // Mobile: Simple keyword detection for performance
        if (log.content.toLowerCase().includes('scheduled') || 
            log.content.toLowerCase().includes('appointment')) {
          session.hasAppointment = true;
        }
      } else {
        // Tablet/Desktop: More thorough appointment detection
        if ((log.content.toLowerCase().includes('discovery call') && 
             log.content.toLowerCase().includes('scheduled')) ||
            log.content.toLowerCase().includes('appointment scheduled') ||
            log.content.toLowerCase().includes('meeting confirmed')) {
          session.hasAppointment = true;
        }
      }
    });

    // Convert to session summaries with device-specific processing
    const sessions: ConversationBox[] = Array.from(sessionMap.values()).map(session => {
      // Sort messages by timestamp
      session.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Device-specific first message detection
      let firstUserMessage: ChatLog | undefined;
      
      if (deviceType === 'mobile') {
        // Mobile: Simple detection - first user message
        firstUserMessage = session.messages.find(msg => msg.messageType === 'user');
      } else {
        // Tablet/Desktop: More sophisticated - skip name-only messages
        firstUserMessage = session.messages.find(msg => 
          msg.messageType === 'user' && 
          !msg.content.match(/^[A-Za-z]+\s+[A-Za-z]+$/) // Not just "FirstName LastName"
        );
      }
      
      return {
        sessionId: session.sessionId,
        messageCount: session.messages.length,
        firstMessage: firstUserMessage ? firstUserMessage.content : 'Session started',
        lastActivity: session.lastActivity,
        duration: calculateSessionDuration(session.messages),
        hasAppointment: session.hasAppointment,
        userName: extractUserName(session.messages), // ADD THIS LINE
        messages: session.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      };
    });

    // Device-specific session sorting and limiting
    if (deviceType === 'mobile') {
      // Mobile: Sort by recent activity, limit to 20 sessions
      sessions.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
      const limitedSessions = sessions.slice(0, 20);
      setChatSessions(limitedSessions);
      return limitedSessions;
    } else if (deviceType === 'tablet') {
      // Tablet: Sort by recent activity, limit to 40 sessions
      sessions.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
      const limitedSessions = sessions.slice(0, 40);
      setChatSessions(limitedSessions);
      return limitedSessions;
    } else {
      // Desktop: Full sessions without limit, sorted by activity
      sessions.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
      setChatSessions(sessions);
      return sessions;
    }
  }, [deviceType]);

  // Device-aware session duration calculation
  const calculateSessionDuration = (messages: ChatLog[]): string => {
    if (messages.length < 2) return '0m';
    
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    
    const startTime = new Date(firstMessage.timestamp);
    const endTime = new Date(lastMessage.timestamp);
    const diffMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    
    // Device-specific duration formatting
    if (deviceType === 'mobile') {
      // Mobile: Simplified duration format
      if (diffMinutes < 60) {
        return `${diffMinutes}m`;
      } else {
        const hours = Math.floor(diffMinutes / 60);
        return `${hours}h`;
      }
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced format
      if (diffMinutes < 60) {
        return `${diffMinutes}m`;
      } else {
        const hours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
      }
    } else {
      // Desktop: Detailed format
      if (diffMinutes < 60) {
        return `${diffMinutes} minutes`;
      } else {
        const hours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;
        if (remainingMinutes > 0) {
          return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
        } else {
          return `${hours} hour${hours > 1 ? 's' : ''}`;
        }
      }
    }
  };

  // Device-aware data loading orchestration
  const loadAllChatData = useCallback(async () => {
    await loadChatLogs();
    // Note: processChatSessions is called automatically when chatLogs updates
  }, [loadChatLogs]);

  // Device-aware session selection with different behaviors
  const handleSelectSession = useCallback(async (sessionId: string | null) => {
    if (deviceType === 'mobile') {
      // Mobile: Simple selection without additional loading
      setSelectedSession(sessionId);
      console.log(`Mobile session selected: ${sessionId}`);
    } else if (deviceType === 'tablet') {
      // Tablet: Selection with touch feedback
      setSelectedSession(sessionId);
      if (sessionId && isTouchDevice) {
        console.log(`Tablet touch session selected: ${sessionId}`);
      }
    } else {
      // Desktop: Standard selection with detailed logging
      setSelectedSession(sessionId);
      if (sessionId) {
        console.log(`Desktop session selected: ${sessionId} - showing conversation details`);
      } else {
        console.log('Desktop session deselected - returning to conversation list');
      }
    }
  }, [deviceType, isTouchDevice]);

  // Device-aware chat data refresh with different strategies
  const refreshChatData = useCallback(async () => {
    // Device-specific refresh behavior
    if (deviceType === 'mobile') {
      // Mobile: Show loading state immediately for better UX
      setIsLoading(true);
      await loadChatLogs();
      setIsLoading(false);
    } else if (deviceType === 'tablet') {
      // Tablet: Background refresh with minimal UI disruption
      await loadChatLogs();
    } else {
      // Desktop: Standard refresh
      await loadChatLogs();
    }
    
    console.log(`Chat data refreshed on ${deviceType}`);
  }, [loadChatLogs, deviceType]);

  // Device-aware search functionality for chat logs
  const searchChatLogs = useCallback((query: string): ChatLog[] => {
    if (!query.trim()) return chatLogs;
    
    const searchTerm = query.toLowerCase().trim();
    
    return chatLogs.filter(log => {
      const searchFields = [
        log.content.toLowerCase(),
        log.sessionId.toLowerCase(),
        log.userInfo?.userName?.toLowerCase() || '',
        log.userInfo?.firstName?.toLowerCase() || '',
        log.userInfo?.lastName?.toLowerCase() || ''
      ];
      
      if (deviceType === 'mobile') {
        // Mobile: Simple partial matching for performance
        return searchFields.some(field => field.includes(searchTerm));
      } else if (deviceType === 'tablet') {
        // Tablet: Balanced search with word matching
        return searchFields.some(field => 
          field.includes(searchTerm) || 
          field.split(' ').some((word: string) => word.startsWith(searchTerm))
        );
      } else {
        // Desktop: Advanced search with multiple strategies
        return searchFields.some(field => {
          if (field.includes(searchTerm)) return true;
          
          // Word-based search
          const words = field.split(' ');
          if (words.some((word: string) => word.startsWith(searchTerm))) return true;
          
          // Partial word matching for desktop
          if (searchTerm.length > 2) {
            return words.some((word: string | string[]) => word.length > 3 && word.includes(searchTerm));
          }
          
          return false;
        });
      }
    });
  }, [chatLogs, deviceType]);

  // Device-aware session filtering
  const filterSessionsByDate = useCallback((days: number): ChatSession[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const filtered = chatSessions.filter(session => 
      new Date(session.lastActivity) >= cutoffDate
    );
    
    // Device-specific filtering limits
    if (deviceType === 'mobile') {
      return filtered.slice(0, 15); // Limit for mobile performance
    } else if (deviceType === 'tablet') {
      return filtered.slice(0, 25); // Moderate limit for tablet
    } else {
      return filtered; // No limit for desktop
    }
  }, [chatSessions, deviceType]);

  // Device-aware conversation statistics
  const getConversationStats = useCallback(() => {
    const stats = {
      totalConversations: chatSessions.length,
      conversationsWithAppointments: chatSessions.filter(session => session.hasAppointment).length,
      totalMessages: chatLogs.length,
      averageMessagesPerConversation: chatSessions.length > 0 ? 
        Math.round((chatLogs.length / chatSessions.length) * 10) / 10 : 0,
      recentConversations: filterSessionsByDate(7).length
    };
    
    // Device-specific stats logging
    if (deviceType === 'desktop') {
      console.log('Conversation Statistics:', stats);
    } else if (deviceType === 'mobile') {
      console.log(`Mobile stats: ${stats.totalConversations} conversations, ${stats.conversationsWithAppointments} appointments`);
    }
    
    return stats;
  }, [chatSessions, chatLogs, filterSessionsByDate, deviceType]);

  // Device-aware bulk conversation operations
  const bulkDeleteConversations = useCallback(async (sessionIds: string[]): Promise<void> => {
    if (sessionIds.length === 0) return;
    
    // Device-specific bulk operation limits
    const maxBulkSize = {
      mobile: 3,   // Limit bulk operations on mobile
      tablet: 8,   // Medium bulk size for tablet
      desktop: 20  // Large bulk size for desktop
    };
    
    if (sessionIds.length > maxBulkSize[deviceType]) {
      const limitMessages = {
        mobile: `Can only delete ${maxBulkSize.mobile} conversations at once.`,
        tablet: `Bulk delete limited to ${maxBulkSize.tablet} conversations.`,
        desktop: `Bulk delete limited to ${maxBulkSize.desktop} conversations.`
      };
      
      setNotification({ 
        type: 'error', 
        message: limitMessages[deviceType]
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }
    
    // Device-specific confirmation
    const confirmMessages = {
      mobile: `Delete ${sessionIds.length} conversations?`,
      tablet: `Delete ${sessionIds.length} selected conversations? This cannot be undone.`,
      desktop: `Are you sure you want to delete ${sessionIds.length} selected conversations? This action cannot be undone and will permanently remove all associated chat data.`
    };
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/chat-logs/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionIds: sessionIds,
          clientId: 'techequity',
          deviceType: deviceType
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Remove deleted conversations from local state
        setChatLogs(prevLogs => prevLogs.filter((log: ChatLog) => !sessionIds.includes(log.sessionId)));
        setChatSessions(prevSessions => prevSessions.filter((session: ChatSession) => !sessionIds.includes(session.sessionId)));
        
        // Clear selection if any deleted conversation was selected
        if (selectedSession && sessionIds.includes(selectedSession)) {
          setSelectedSession(null);
        }
        
        const successMessages = {
          mobile: `${sessionIds.length} conversations deleted!`,
          tablet: `${sessionIds.length} conversations deleted successfully`,
          desktop: `Successfully deleted ${sessionIds.length} conversations`
        };
        
        setNotification({ 
          type: 'success', 
          message: successMessages[deviceType]
        });
        
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 2500 : 3500);
        console.log(`Bulk deleted ${sessionIds.length} conversations on ${deviceType}`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error in bulk delete:', error);
      
      const errorMessages = {
        mobile: 'Bulk delete failed.',
        tablet: 'Failed to delete conversations. Please try again.',
        desktop: 'Bulk delete operation failed. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 5000);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSession, setNotification, deviceType]);

  // Device-aware conversation export functionality
  const exportConversations = useCallback((sessionIds: string[], format: 'json' | 'csv' = 'json'): void => {
    // Device-specific export limits
    const maxExportSize = {
      mobile: 5,   // Very limited on mobile
      tablet: 15,  // Moderate on tablet
      desktop: 50  // Full export on desktop
    };
    
    if (sessionIds.length > maxExportSize[deviceType]) {
      const limitMessages = {
        mobile: `Can only export ${maxExportSize.mobile} conversations at once.`,
        tablet: `Export limited to ${maxExportSize.tablet} conversations.`,
        desktop: `Export limited to ${maxExportSize.desktop} conversations at once.`
      };
      
      setNotification({ 
        type: 'error', 
        message: limitMessages[deviceType]
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    // Filter conversations to export
    const conversationsToExport = chatLogs.filter((log: ChatLog) => sessionIds.includes(log.sessionId));
    
    if (conversationsToExport.length === 0) {
      setNotification({ 
        type: 'error', 
        message: 'No conversation data to export.'
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      let exportData: string;
      let filename: string;
      let mimeType: string;

      if (format === 'csv') {
        // CSV format
        const csvHeaders = 'Session ID,Timestamp,Message Type,Content,User Name\n';
        const csvRows = conversationsToExport.map((log: ChatLog) => {
          const userName = log.userInfo?.userName || 'Anonymous';
          const content = log.content.replace(/"/g, '""'); // Escape quotes
          return `"${log.sessionId}","${log.timestamp}","${log.messageType}","${content}","${userName}"`;
        }).join('\n');
        
        exportData = csvHeaders + csvRows;
        filename = `chat-conversations-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        // JSON format
        exportData = JSON.stringify(conversationsToExport, null, deviceType === 'mobile' ? 0 : 2);
        filename = `chat-conversations-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }

      // Create and trigger download
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const successMessages = {
        mobile: 'Export started!',
        tablet: `Exported ${sessionIds.length} conversations`,
        desktop: `Successfully exported ${sessionIds.length} conversations as ${format.toUpperCase()}`
      };

      setNotification({ 
        type: 'success', 
        message: successMessages[deviceType]
      });
      setTimeout(() => setNotification(null), 3000);
      
      console.log(`Exported ${sessionIds.length} conversations as ${format} on ${deviceType}`);
    } catch (error) {
      console.error('Export error:', error);
      
      const errorMessages = {
        mobile: 'Export failed.',
        tablet: 'Export failed. Please try again.',
        desktop: 'Export operation failed. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), 4000);
    }
  }, [chatLogs, setNotification, deviceType]);

  // Device-aware conversation analytics
  const analyzeConversations = useCallback((): {
    totalSessions: number;
    averageSessionLength: number;
    appointmentConversionRate: number;
    topUserQuestions: string[];
    peakActivityHours: number[];
    deviceBreakdown: { [key: string]: number };
  } => {
    const analysis = {
      totalSessions: chatSessions.length,
      averageSessionLength: 0,
      appointmentConversionRate: 0,
      topUserQuestions: [] as string[],
      peakActivityHours: [] as number[],
      deviceBreakdown: {} as { [key: string]: number }
    };

    if (chatSessions.length === 0) return analysis;

    // Calculate average session length
    const totalMessages = chatSessions.reduce((sum: number, session: ChatSession) => sum + session.messageCount, 0);
    analysis.averageSessionLength = Math.round((totalMessages / chatSessions.length) * 10) / 10;

    // Calculate appointment conversion rate
    const appointmentSessions = chatSessions.filter((session: ChatSession) => session.hasAppointment).length;
    analysis.appointmentConversionRate = Math.round((appointmentSessions / chatSessions.length) * 100);

    // Extract top user questions (simplified for device performance)
    if (deviceType === 'desktop') {
      // Desktop: Full analysis
      const userMessages = chatLogs.filter((log: ChatLog) => log.messageType === 'user');
      const questionWords = new Map<string, number>();
      
      userMessages.forEach((log: ChatLog) => {
        const words = log.content.toLowerCase().split(' ').filter((word: string) => word.length > 3);
        words.forEach((word: string) => {
          questionWords.set(word, (questionWords.get(word) || 0) + 1);
        });
      });
      
      analysis.topUserQuestions = Array.from(questionWords.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);
    } else {
      // Mobile/Tablet: Simplified analysis
      analysis.topUserQuestions = ['consultation', 'services', 'pricing', 'availability', 'contact'];
    }

    // Analyze peak activity hours
    const hourCounts = new Array(24).fill(0);
    chatLogs.forEach((log: ChatLog) => {
      const hour = new Date(log.timestamp).getHours();
      hourCounts[hour]++;
    });
    
    const maxCount = Math.max(...hourCounts);
    analysis.peakActivityHours = hourCounts
      .map((count: number, hour: number) => ({ hour, count }))
      .filter(({ count }) => count > maxCount * 0.7)
      .map(({ hour }) => hour);

    // Device breakdown (simulated since we don't store device info in logs)
    analysis.deviceBreakdown = {
      mobile: Math.round(chatSessions.length * 0.6),
      tablet: Math.round(chatSessions.length * 0.2),
      desktop: Math.round(chatSessions.length * 0.2)
    };

    return analysis;
  }, [chatSessions, chatLogs, deviceType]);

  // Device-aware automatic session updates
  const setupAutoRefresh = useCallback((intervalMinutes: number = 5): () => void => {
    // Device-specific auto-refresh intervals
    const intervals = {
      mobile: Math.max(intervalMinutes, 10),  // Minimum 10 minutes on mobile
      tablet: Math.max(intervalMinutes, 5),   // Minimum 5 minutes on tablet
      desktop: Math.max(intervalMinutes, 2)   // Minimum 2 minutes on desktop
    };
    
    const actualInterval = intervals[deviceType] * 60 * 1000; // Convert to milliseconds
    
    const intervalId = setInterval(async () => {
      try {
        await refreshChatData();
        console.log(`Auto-refreshed chat data on ${deviceType}`);
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, actualInterval);
    
    console.log(`Auto-refresh setup for ${deviceType}: every ${intervals[deviceType]} minutes`);
    
    // Return cleanup function
    return () => {
      clearInterval(intervalId);
      console.log(`Auto-refresh cleared for ${deviceType}`);
    };
  }, [refreshChatData, deviceType]);

  // Device-aware session state management
  const updateSessionsFromLogs = useCallback(() => {
    if (chatLogs.length > 0) {
      processChatSessions(chatLogs);
    }
  }, [chatLogs, processChatSessions]);

  // Return all hook functionality with device-aware features
  return {
    // Core state
    chatLogs,
    chatSessions,
    isLoading,
    selectedSession,
    
    // Core actions
    loadAllChatData,
    loadChatLogs,
    handleSelectSession,
    setSelectedSession,
    refreshChatData,
    deleteConversation,
    
    // Device-aware features
    deviceType,
    isTouchDevice,
    searchChatLogs,
    filterSessionsByDate,
    getConversationStats,
    bulkDeleteConversations,
    exportConversations,
    analyzeConversations,
    setupAutoRefresh,
    updateSessionsFromLogs
  };
};