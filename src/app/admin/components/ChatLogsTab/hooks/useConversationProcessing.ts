// src/app/admin/components/ChatLogsTab/hooks/useConversationProcessing.ts

import { useMemo, useCallback } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ChatLog } from '../../../types';
import { ConversationBox } from '../types';

// Define device-specific processing configurations
interface ProcessingConfig {
  maxMessagesForProcessing: number;
  enableDeepMessageAnalysis: boolean;
  appointmentDetectionSensitivity: 'low' | 'medium' | 'high';
  nameExtractionComplexity: 'simple' | 'advanced';
  durationCalculationPrecision: 'approximate' | 'precise';
}

export const useConversationProcessing = (chatLogs: ChatLog[]) => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();

  // Device-aware processing configurations
  const processingConfig = useMemo((): ProcessingConfig => {
    switch (deviceType) {
      case 'mobile':
        return {
          maxMessagesForProcessing: 500,      // Lower limit for mobile performance
          enableDeepMessageAnalysis: false,   // Skip complex analysis on mobile
          appointmentDetectionSensitivity: 'low',
          nameExtractionComplexity: 'simple',
          durationCalculationPrecision: 'approximate'
        };
      case 'tablet':
        return {
          maxMessagesForProcessing: 1000,     // Moderate limit for tablet
          enableDeepMessageAnalysis: true,    // Enable some analysis
          appointmentDetectionSensitivity: 'medium',
          nameExtractionComplexity: 'simple',
          durationCalculationPrecision: 'approximate'
        };
      case 'desktop':
        return {
          maxMessagesForProcessing: 5000,     // Higher limit for desktop
          enableDeepMessageAnalysis: true,    // Full analysis capabilities
          appointmentDetectionSensitivity: 'high',
          nameExtractionComplexity: 'advanced',
          durationCalculationPrecision: 'precise'
        };
      default:
        return {
          maxMessagesForProcessing: 1000,
          enableDeepMessageAnalysis: false,
          appointmentDetectionSensitivity: 'medium',
          nameExtractionComplexity: 'simple',
          durationCalculationPrecision: 'approximate'
        };
    }
  }, [deviceType]);

  // Device-aware user name extraction with different complexity levels
  const extractUserName = useCallback((log: ChatLog): string => {
    if (processingConfig.nameExtractionComplexity === 'simple') {
      // Simple extraction for mobile/tablet
      return log.userInfo?.userName || 
             (log.userInfo?.firstName && log.userInfo?.lastName 
               ? `${log.userInfo.firstName} ${log.userInfo.lastName}` 
               : 'Anonymous User');
    } else {
      // Advanced extraction for desktop
      if (log.userInfo?.userName) {
        return log.userInfo.userName;
      }
      
      if (log.userInfo?.firstName && log.userInfo?.lastName) {
        return `${log.userInfo.firstName} ${log.userInfo.lastName}`;
      }
      
      if (log.userInfo?.firstName) {
        return log.userInfo.firstName;
      }
      
      if (log.userInfo?.lastName) {
        return `User ${log.userInfo.lastName}`;
      }
      
      // Desktop: Try to extract name from message content as fallback
      const nameMatch = log.content.match(/(?:my name is|i'm|i am)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
      if (nameMatch) {
        return nameMatch[1];
      }
      
      return 'Anonymous User';
    }
  }, [processingConfig.nameExtractionComplexity]);

  // Device-aware appointment detection with different sensitivity levels
  const detectAppointment = useCallback((messages: ChatLog[]): boolean => {
    const keywords = {
      low: ['scheduled', 'appointment', 'discovery call'],
      medium: ['scheduled', 'appointment', 'discovery call', 'meeting', 'booked', 'confirmed'],
      high: ['scheduled', 'appointment', 'discovery call', 'meeting', 'booked', 'confirmed', 
             'calendar', 'time slot', 'available', 'consultation', 'session']
    };
    
    const searchKeywords = keywords[processingConfig.appointmentDetectionSensitivity];
    
    if (processingConfig.enableDeepMessageAnalysis) {
      // Deep analysis for tablet/desktop
      return messages.some(msg => {
        const content = msg.content.toLowerCase();
        return searchKeywords.some(keyword => {
          if (keyword === 'discovery call') {
            return content.includes('discovery call') && content.includes('scheduled');
          }
          return content.includes(keyword);
        });
      });
    } else {
      // Simple analysis for mobile
      return messages.some(msg => {
        const content = msg.content.toLowerCase();
        return content.includes('discovery call') && content.includes('scheduled');
      });
    }
  }, [processingConfig.appointmentDetectionSensitivity, processingConfig.enableDeepMessageAnalysis]);

  // Device-aware meaningful message extraction
  const findMeaningfulUserMessage = useCallback((messages: ChatLog[]): string => {
    if (processingConfig.nameExtractionComplexity === 'simple') {
      // Simple extraction for mobile/tablet
      const meaningfulMessage = messages.find(msg => 
        msg.messageType === 'user' && 
        msg.content.length > 10 &&
        !msg.content.match(/^[A-Za-z]+\s+[A-Za-z]+$/) // Not just "FirstName LastName"
      );
      
      return meaningfulMessage?.content || 
             messages.find(msg => msg.messageType === 'user')?.content || 
             'Session started';
    } else {
      // Advanced extraction for desktop
      const meaningfulMessages = messages.filter(msg => msg.messageType === 'user');
      
      // Skip simple name responses
      const nonNameMessages = meaningfulMessages.filter(msg => 
        !msg.content.match(/^[A-Za-z]+\s*[A-Za-z]*$/) &&
        msg.content.length > 5
      );
      
      if (nonNameMessages.length > 0) {
        // Find the first substantive message
        const substantiveMessage = nonNameMessages.find(msg => 
          msg.content.length > 15 &&
          !msg.content.match(/^(hi|hello|hey|yes|no|ok|okay|thanks|thank you)$/i)
        );
        
        return substantiveMessage?.content || nonNameMessages[0].content;
      }
      
      return meaningfulMessages[0]?.content || 'Session started';
    }
  }, [processingConfig.nameExtractionComplexity]);

  // Device-aware duration calculation with different precision levels
  const calculateDuration = useCallback((messages: ChatLog[]): string => {
    if (messages.length < 2) return '0m';
    
    const firstMsg = messages[0];
    const lastMsg = messages[messages.length - 1];
    
    const startTime = new Date(firstMsg.timestamp).getTime();
    const endTime = new Date(lastMsg.timestamp).getTime();
    const diffMilliseconds = endTime - startTime;
    
    if (processingConfig.durationCalculationPrecision === 'approximate') {
      // Approximate calculation for mobile/tablet
      const diffMinutes = Math.round(diffMilliseconds / (1000 * 60));
      
      if (diffMinutes < 1) return '< 1m';
      if (diffMinutes >= 60) {
        const hours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;
        return `${hours}h ${remainingMinutes}m`;
      }
      return `${diffMinutes}m`;
    } else {
      // Precise calculation for desktop
      const diffSeconds = Math.floor(diffMilliseconds / 1000);
      
      if (diffSeconds < 60) return '< 1m';
      
      const diffMinutes = Math.floor(diffSeconds / 60);
      const remainingSeconds = diffSeconds % 60;
      
      if (diffMinutes < 60) {
        if (remainingSeconds > 30) {
          return `${diffMinutes + 1}m`;
        }
        return `${diffMinutes}m`;
      }
      
      const hours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      
      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else if (remainingMinutes < 30) {
        return `${hours}h ${remainingMinutes}m`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  }, [processingConfig.durationCalculationPrecision]);

  // Device-aware conversation grouping and batching
  const processConversationsInBatches = useCallback((logs: ChatLog[]): ConversationBox[] => {
    const conversationMap = new Map<string, ConversationBox>();
    
    // Device-specific batch processing to prevent UI freezing
    const batchSizes = {
      mobile: 50,    // Smaller batches for mobile to maintain responsiveness
      tablet: 100,   // Medium batches for tablet
      desktop: 200   // Larger batches for desktop
    };
    
    const batchSize = batchSizes[deviceType];
    const totalLogs = Math.min(logs.length, processingConfig.maxMessagesForProcessing);
    
    // Process logs in batches
    for (let i = 0; i < totalLogs; i += batchSize) {
      const batch = logs.slice(i, i + batchSize);
      
      batch.forEach(log => {
        const userName = extractUserName(log);
        
        if (!conversationMap.has(log.sessionId)) {
          conversationMap.set(log.sessionId, {
            sessionId: log.sessionId,
            userName: userName,
            messageCount: 0,
            firstMessage: '',
            lastActivity: log.timestamp,
            duration: '0m',
            hasAppointment: false,
            messages: []
          });
        }

        const conversation = conversationMap.get(log.sessionId)!;
        conversation.messages.push(log);
        conversation.messageCount++;
        
        // Update last activity with device-aware timestamp handling
        const logTime = new Date(log.timestamp);
        const currentLastActivity = new Date(conversation.lastActivity);
        
        if (logTime > currentLastActivity) {
          conversation.lastActivity = log.timestamp;
        }
      });
    }
    
    return Array.from(conversationMap.values());
  }, [deviceType, processingConfig.maxMessagesForProcessing, extractUserName]);

  // Device-aware conversation enrichment
  const enrichConversations = useCallback((conversations: ConversationBox[]): ConversationBox[] => {
    return conversations.map(conv => {
      // Sort messages by timestamp for proper chronological order
      conv.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      // Extract first meaningful message
      conv.firstMessage = findMeaningfulUserMessage(conv.messages);
      
      // Calculate duration with device-appropriate precision
      conv.duration = calculateDuration(conv.messages);
      
      // Detect appointments with device-appropriate sensitivity
      conv.hasAppointment = detectAppointment(conv.messages);
      
      // Device-specific conversation analysis
      if (processingConfig.enableDeepMessageAnalysis) {
        // Enhanced analysis for tablet/desktop
        const analysisResult = performDeepAnalysis(conv);
        return {
          ...conv,
          ...analysisResult
        };
      }
      
      return conv;
    });
  }, [findMeaningfulUserMessage, calculateDuration, detectAppointment, processingConfig.enableDeepMessageAnalysis]);

  // Device-aware deep conversation analysis (for tablet/desktop)
  const performDeepAnalysis = useCallback((conversation: ConversationBox) => {
    if (!processingConfig.enableDeepMessageAnalysis) {
      return {};
    }
    
    const messages = conversation.messages;
    const userMessages = messages.filter(msg => msg.messageType === 'user');
    const aiMessages = messages.filter(msg => msg.messageType === 'ai');
    
    // Analyze conversation characteristics
    const analysis = {
      // Conversation quality indicators
      averageResponseTime: calculateAverageResponseTime(messages),
      conversationDepth: Math.min(messages.length, 10), // Cap for performance
      userEngagementLevel: calculateEngagementLevel(userMessages),
      
      // Intent detection
      detectedIntent: detectUserIntent(userMessages),
      
      // Conversation outcome
      hasResolution: detectResolution(messages),
      
      // Customer satisfaction indicators
      sentimentIndicator: analyzeSentiment(userMessages)
    };
    
    return analysis;
  }, [processingConfig.enableDeepMessageAnalysis]);

  // Helper function: Calculate average response time between messages
  const calculateAverageResponseTime = useCallback((messages: ChatLog[]): number => {
    if (messages.length < 2) return 0;
    
    let totalResponseTime = 0;
    let responseCount = 0;
    
    for (let i = 1; i < messages.length; i++) {
      const currentTime = new Date(messages[i].timestamp).getTime();
      const previousTime = new Date(messages[i - 1].timestamp).getTime();
      const responseTime = currentTime - previousTime;
      
      // Only count reasonable response times (under 30 minutes)
      if (responseTime < 1800000) {
        totalResponseTime += responseTime;
        responseCount++;
      }
    }
    
    return responseCount > 0 ? Math.round(totalResponseTime / responseCount / 1000) : 0; // Return seconds
  }, []);

  // Helper function: Calculate user engagement level
  const calculateEngagementLevel = useCallback((userMessages: ChatLog[]): 'low' | 'medium' | 'high' => {
    if (userMessages.length === 0) return 'low';
    
    const averageLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / userMessages.length;
    const messageCount = userMessages.length;
    
    if (messageCount >= 8 && averageLength >= 30) return 'high';
    if (messageCount >= 4 && averageLength >= 15) return 'medium';
    return 'low';
  }, []);

  // Helper function: Detect user intent
  const detectUserIntent = useCallback((userMessages: ChatLog[]): string => {
    if (userMessages.length === 0) return 'unknown';
    
    const allContent = userMessages.map(msg => msg.content.toLowerCase()).join(' ');
    
    // Intent keywords mapping
    const intents = {
      'pricing': ['price', 'cost', 'pricing', 'fee', 'charge', 'expensive', 'affordable'],
      'features': ['feature', 'capability', 'function', 'what can', 'how does'],
      'support': ['help', 'support', 'problem', 'issue', 'bug', 'error'],
      'integration': ['integrate', 'api', 'connect', 'plugin', 'compatibility'],
      'consultation': ['consultation', 'demo', 'meeting', 'call', 'discuss']
    };
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => allContent.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general';
  }, []);

  // Helper function: Detect conversation resolution
  const detectResolution = useCallback((messages: ChatLog[]): boolean => {
    if (messages.length === 0) return false;
    
    const lastFewMessages = messages.slice(-3).map(msg => msg.content.toLowerCase());
    const resolutionKeywords = ['thank', 'thanks', 'resolved', 'solved', 'perfect', 'great', 'scheduled', 'booked'];
    
    return lastFewMessages.some(content => 
      resolutionKeywords.some(keyword => content.includes(keyword))
    );
  }, []);

  // Helper function: Basic sentiment analysis
  const analyzeSentiment = useCallback((userMessages: ChatLog[]): 'positive' | 'neutral' | 'negative' => {
    if (userMessages.length === 0) return 'neutral';
    
    const allContent = userMessages.map(msg => msg.content.toLowerCase()).join(' ');
    
    const positiveWords = ['great', 'good', 'excellent', 'perfect', 'amazing', 'love', 'fantastic', 'wonderful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'disappointed', 'frustrated', 'angry'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (allContent.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (allContent.includes(word)) negativeCount++;
    });
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }, []);

  // Device-aware conversation sorting
  const sortConversations = useCallback((conversations: ConversationBox[]): ConversationBox[] => {
    return conversations.sort((a, b) => {
      // Primary sort: Last activity (most recent first)
      const timeA = new Date(a.lastActivity).getTime();
      const timeB = new Date(b.lastActivity).getTime();
      const timeDiff = timeB - timeA;
      
      if (timeDiff !== 0) return timeDiff;
      
      // Secondary sort: Message count (more messages first) - only for desktop
      if (deviceType === 'desktop') {
        const countDiff = b.messageCount - a.messageCount;
        if (countDiff !== 0) return countDiff;
        
        // Tertiary sort: User name alphabetically
        return a.userName.localeCompare(b.userName);
      }
      
      // For mobile/tablet: Keep it simple with just user name as secondary sort
      return a.userName.localeCompare(b.userName);
    });
  }, [deviceType]);

  // Device-aware conversation filtering for performance
  const filterConversationsForPerformance = useCallback((conversations: ConversationBox[]): ConversationBox[] => {
    // Device-specific limits to maintain UI performance
    const displayLimits = {
      mobile: 100,    // Show fewer conversations on mobile
      tablet: 200,    // Moderate limit for tablet
      desktop: 500    // Higher limit for desktop
    };
    
    const limit = displayLimits[deviceType];
    
    if (conversations.length <= limit) {
      return conversations;
    }
    
    // If over limit, prioritize recent and high-engagement conversations
    const prioritized = conversations
      .map(conv => ({
        ...conv,
        priority: calculateConversationPriority(conv)
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit)
      .map(({ priority, ...conv }) => conv); // Remove priority field
    
    return prioritized;
  }, [deviceType]);

  // Helper function: Calculate conversation priority for filtering
  const calculateConversationPriority = useCallback((conversation: ConversationBox): number => {
    let priority = 0;
    
    // Recent activity gets higher priority
    const daysSinceActivity = (Date.now() - new Date(conversation.lastActivity).getTime()) / (1000 * 60 * 60 * 24);
    priority += Math.max(0, 10 - daysSinceActivity); // Up to 10 points for recent activity
    
    // More messages = higher engagement
    priority += Math.min(conversation.messageCount * 0.5, 5); // Up to 5 points for message count
    
    // Appointments get priority boost
    if (conversation.hasAppointment) {
      priority += 3;
    }
    
    // Longer conversations get slight boost
    const durationMinutes = parseInt(conversation.duration.replace(/\D/g, '')) || 0;
    priority += Math.min(durationMinutes * 0.1, 2); // Up to 2 points for duration
    
    return priority;
  }, []);

  // Device-aware performance monitoring and optimization
  const getProcessingMetrics = useCallback(() => {
    const totalLogs = chatLogs.length;
    const processedLogs = Math.min(totalLogs, processingConfig.maxMessagesForProcessing);
    const processingRatio = totalLogs > 0 ? processedLogs / totalLogs : 1;
    
    const performanceThresholds = {
      mobile: { warning: 200, critical: 500 },
      tablet: { warning: 500, critical: 1000 },
      desktop: { warning: 1000, critical: 2500 }
    };
    
    const threshold = performanceThresholds[deviceType];
    
    let performanceStatus: 'good' | 'warning' | 'critical' = 'good';
    if (totalLogs > threshold.critical) {
      performanceStatus = 'critical';
    } else if (totalLogs > threshold.warning) {
      performanceStatus = 'warning';
    }
    
    return {
      totalLogs,
      processedLogs,
      skippedLogs: totalLogs - processedLogs,
      processingRatio,
      performanceStatus,
      deviceOptimized: true,
      recommendVirtualization: totalLogs > threshold.warning,
      estimatedProcessingTime: calculateEstimatedProcessingTime(totalLogs)
    };
  }, [chatLogs.length, processingConfig.maxMessagesForProcessing, deviceType]);

  // Helper function: Estimate processing time based on device capabilities
  const calculateEstimatedProcessingTime = useCallback((logCount: number): number => {
    const processingRatesPerSecond = {
      mobile: 50,    // Slower processing on mobile
      tablet: 100,   // Moderate processing on tablet  
      desktop: 200   // Faster processing on desktop
    };
    
    const rate = processingRatesPerSecond[deviceType];
    return Math.ceil(logCount / rate);
  }, [deviceType]);

  // Device-aware error handling and recovery
  const handleProcessingErrors = useCallback((error: Error, context: string) => {
    console.error(`Conversation processing error in ${context}:`, error);
    
    // Device-specific error reporting
    const errorInfo = {
      context,
      deviceType,
      error: error.message,
      timestamp: new Date().toISOString(),
      chatLogsCount: chatLogs.length,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown'
    };
    
    if (deviceType === 'desktop') {
      // More detailed error logging for desktop
      console.warn('Detailed error info:', errorInfo);
    }
    
    // Return empty state that won't crash the UI
    return [];
  }, [deviceType, chatLogs.length]);

  // Device-aware data validation
  const validateChatLogs = useCallback((logs: ChatLog[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!Array.isArray(logs)) {
      errors.push('Chat logs must be an array');
      return { isValid: false, errors };
    }
    
    // Device-specific validation depth
    const validationDepth = deviceType === 'mobile' ? 'basic' : 'comprehensive';
    
    if (validationDepth === 'basic') {
      // Basic validation for mobile
      const hasInvalidEntries = logs.some(log => !log || !log.sessionId || !log.timestamp);
      if (hasInvalidEntries) {
        errors.push('Some chat log entries are missing required fields');
      }
    } else {
      // Comprehensive validation for tablet/desktop
      logs.forEach((log, index) => {
        if (!log) {
          errors.push(`Chat log at index ${index} is null or undefined`);
          return;
        }
        
        if (!log.sessionId) {
          errors.push(`Chat log at index ${index} missing sessionId`);
        }
        
        if (!log.timestamp) {
          errors.push(`Chat log at index ${index} missing timestamp`);
        } else if (isNaN(new Date(log.timestamp).getTime())) {
          errors.push(`Chat log at index ${index} has invalid timestamp`);
        }
        
        if (!log.messageType || !['user', 'ai'].includes(log.messageType)) {
          errors.push(`Chat log at index ${index} has invalid messageType`);
        }
        
        if (!log.content) {
          errors.push(`Chat log at index ${index} missing content`);
        }
      });
      
      // Stop after finding too many errors to avoid performance issues
      if (errors.length > 20) {
        errors.splice(20);
        errors.push('... and more validation errors (truncated for performance)');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [deviceType]);

  // Main processing hook with comprehensive error handling
  const conversations = useMemo((): ConversationBox[] => {
    try {
      // Validate input data
      const validation = validateChatLogs(chatLogs);
      if (!validation.isValid) {
        console.warn('Chat logs validation failed:', validation.errors);
        if (validation.errors.length > 5) {
          return handleProcessingErrors(new Error('Too many validation errors'), 'validation');
        }
      }
      
      // Early return for empty data
      if (!chatLogs || chatLogs.length === 0) {
        return [];
      }
      
      // Device-aware processing pipeline
      let processedConversations: ConversationBox[] = [];
      
      try {
        // Step 1: Batch processing with device limits
        processedConversations = processConversationsInBatches(chatLogs);
      } catch (error) {
        return handleProcessingErrors(error as Error, 'batch-processing');
      }
      
      try {
        // Step 2: Enrich conversations with analysis
        processedConversations = enrichConversations(processedConversations);
      } catch (error) {
        console.warn('Conversation enrichment failed, using basic data:', error);
        // Continue with basic conversation data if enrichment fails
      }
      
      try {
        // Step 3: Sort conversations
        processedConversations = sortConversations(processedConversations);
      } catch (error) {
        console.warn('Conversation sorting failed, using unsorted data:', error);
        // Continue with unsorted data if sorting fails
      }
      
      try {
        // Step 4: Apply performance filtering
        processedConversations = filterConversationsForPerformance(processedConversations);
      } catch (error) {
        console.warn('Performance filtering failed, using unfiltered data:', error);
        // Continue with all data if filtering fails
      }
      
      return processedConversations;
      
    } catch (error) {
      return handleProcessingErrors(error as Error, 'main-processing');
    }
  }, [
    chatLogs,
    validateChatLogs,
    handleProcessingErrors,
    processConversationsInBatches,
    enrichConversations,
    sortConversations,
    filterConversationsForPerformance
  ]);

  // Device-aware export functionality for processed data
  const exportProcessedData = useCallback((format: 'json' | 'csv' = 'json') => {
    try {
      const exportData = conversations.map(conv => ({
        sessionId: conv.sessionId,
        userName: conv.userName,
        messageCount: conv.messageCount,
        firstMessage: conv.firstMessage,
        lastActivity: conv.lastActivity,
        duration: conv.duration,
        hasAppointment: conv.hasAppointment,
        deviceProcessed: deviceType,
        processingTimestamp: new Date().toISOString()
      }));
      
      const filename = `conversations-processed-${deviceType}-${new Date().toISOString().split('T')[0]}`;
      
      if (format === 'csv') {
        const headers = Object.keys(exportData[0] || {});
        const csvContent = [
          headers.join(','),
          ...exportData.map(row => 
            headers.map(header => 
              `"${String(row[header as keyof typeof row]).replace(/"/g, '""')}"`
            ).join(',')
          )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const jsonContent = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [conversations, deviceType]);

  // Device-aware processing statistics
  const getProcessingStats = useCallback(() => {
    const uniqueSessions = new Set(chatLogs.map(log => log.sessionId)).size;
    const totalMessages = chatLogs.length;
    const processedConversations = conversations.length;
    
    const stats = {
      // Basic stats
      totalMessages,
      uniqueSessions,
      processedConversations,
      
      // Processing efficiency
      processingEfficiency: processedConversations / Math.max(uniqueSessions, 1),
      averageMessagesPerConversation: totalMessages / Math.max(processedConversations, 1),
      
      // Device-specific metrics
      deviceType,
      processingConfig: processingConfig,
      
      // Performance metrics
      ...getProcessingMetrics()
    };
    
    return stats;
  }, [chatLogs, conversations, deviceType, processingConfig, getProcessingMetrics]);

  // Return processed conversations with utility functions
  return {
    // Main processed data
    conversations,
    
    // Processing metadata
    processingConfig,
    deviceType,
    isTouchDevice,
    
    // Utility functions
    getProcessingStats,
    getProcessingMetrics,
    exportProcessedData,
    
    // Validation and error handling
    validateChatLogs,
    handleProcessingErrors
  };
};