// src/app/admin/hooks/useChatLogs/apiUtils.ts
// API operations and data processing utilities for chat logs

import { ChatLog, ChatSession } from '../../types';
import {
  DeviceType,
  CHAT_LOGS_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  NOTIFICATION_DURATIONS,
  LoadChatLogsParams,
  DeleteConversationParams,
  BulkDeleteParams
} from './types';

// Build API URL based on device type and parameters
export const buildApiUrl = (
  sessionId?: string,
  deviceType: DeviceType = 'desktop',
  isTouchDevice: boolean = false
): string => {
  const config = CHAT_LOGS_CONFIG[deviceType];
  
  if (sessionId) {
    return `/api/chat-logs?client=${process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || 'client_techequity_001'}&sessionId=${sessionId}&limit=${config.sessionLimit}&deviceType=${deviceType}`;
  } else {
    const queryParams = new URLSearchParams({
      client: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || 'client_techequity_001',
      limit: config.limit.toString(),
      deviceType: deviceType,
      isTouchDevice: isTouchDevice.toString()
    });
    return `/api/chat-logs?${queryParams}`;
  }
};

// Process data based on device capabilities
export const processDeviceSpecificData = (
  data: ChatLog[],
  deviceType: DeviceType
): ChatLog[] => {
  const config = CHAT_LOGS_CONFIG[deviceType];
  
  if (deviceType === 'mobile') {
    // Mobile: Process for performance - keep only recent and essential data
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.dayLimit);
    
    return data
      .filter((log: ChatLog) => new Date(log.timestamp) >= cutoffDate)
      .sort((a: ChatLog, b: ChatLog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, config.limit);
  } else if (deviceType === 'tablet') {
    // Tablet: Balanced data - keep recent period
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - config.dayLimit);
    
    return data
      .filter((log: ChatLog) => new Date(log.timestamp) >= cutoffDate)
      .sort((a: ChatLog, b: ChatLog) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, config.limit);
  }
  // Desktop: Keep all data without filtering
  return data;
};

// Main API function to load chat logs with graceful update support
export const loadChatLogsApi = async (params: LoadChatLogsParams): Promise<ChatLog[]> => {
  const {
    sessionId,
    isGracefulUpdate,
    deviceType,
    isTouchDevice,
    setIsLoading,
    setChatLogs,
    setNotification
  } = params;

  const config = CHAT_LOGS_CONFIG[deviceType];

  try {
    // FIXED: Only set loading state for initial loads, not graceful updates
    if (!isGracefulUpdate) {
      setIsLoading(true);
    }

    for (let attempt = 0; attempt < config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const url = buildApiUrl(sessionId, deviceType, isTouchDevice);
        
        const response = await fetch(url, {
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const result = await response.json();
        
        if (result.success) {
          // Process data based on device capabilities
          const processedData = processDeviceSpecificData(result.data || [], deviceType);
          
          // FIXED: For graceful updates, update data smoothly without UI disruption
          if (isGracefulUpdate) {
            setChatLogs(processedData);
            console.log(`Gracefully updated ${processedData.length} chat logs`);
          } else {
            setChatLogs(processedData);
            console.log(`Loaded ${processedData.length} chat logs for ${deviceType}`);
          }
          
          return processedData;
        } else {
          throw new Error(result.error || 'Failed to load chat logs');
        }

      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn(`Chat logs request timed out on ${deviceType} (attempt ${attempt + 1}/${config.maxRetries})`);
        } else {
          console.error(`Chat logs request failed on ${deviceType} (attempt ${attempt + 1}/${config.maxRetries}):`, error);
        }
        
        if (attempt === config.maxRetries - 1) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      }
    }
    
    return [];
  } catch (error) {
    console.error(`Failed to load chat logs after ${config.maxRetries} attempts:`, error);
    
    // FIXED: For graceful updates, don't show notifications - just log the error
    if (!isGracefulUpdate) {
      setNotification({
        type: 'error',
        message: ERROR_MESSAGES.load[deviceType]
      });
      setTimeout(() => setNotification(null), NOTIFICATION_DURATIONS[deviceType].error);
    }
    
    return [];
  } finally {
    // FIXED: Only clear loading state if we set it
    if (!isGracefulUpdate) {
      setIsLoading(false);
    }
  }
};

// Delete a single conversation
export const deleteConversationApi = async (params: DeleteConversationParams): Promise<void> => {
  const {
    sessionId,
    selectedSession,
    deviceType,
    setIsLoading,
    setChatLogs,
    setSelectedSession,
    setNotification
  } = params;

  const config = CHAT_LOGS_CONFIG[deviceType];

  try {
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(
      `/api/chat-logs?client=techequity&sessionId=${sessionId}&deviceType=${deviceType}`, 
      {
        method: 'DELETE',
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);
    const result = await response.json();
    
    if (result.success) {
      // Remove deleted conversation from local state
      setChatLogs(prevLogs => prevLogs.filter(log => log.sessionId !== sessionId));
      
      // Clear selection if the deleted conversation was selected
      if (selectedSession === sessionId) {
        setSelectedSession(null);
      }
      
      setNotification({
        type: 'success',
        message: SUCCESS_MESSAGES.delete[deviceType]
      });
      
      setTimeout(() => setNotification(null), NOTIFICATION_DURATIONS[deviceType].success);
      console.log(`Deleted conversation: ${sessionId} on ${deviceType}`);
    } else {
      throw new Error(result.error || 'Failed to delete conversation');
    }
  } catch (error) {
    console.error('Error deleting conversation:', error);
    
    setNotification({
      type: 'error',
      message: `${ERROR_MESSAGES.delete[deviceType]}: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    setTimeout(() => setNotification(null), NOTIFICATION_DURATIONS[deviceType].error);
  } finally {
    setIsLoading(false);
  }
};

// Bulk delete conversations
export const bulkDeleteConversationsApi = async (params: BulkDeleteParams): Promise<void> => {
  const {
    sessionIds,
    selectedSession,
    deviceType,
    setIsLoading,
    setChatLogs,
    setChatSessions,
    setSelectedSession,
    setNotification
  } = params;

  if (sessionIds.length === 0) return;

  const config = CHAT_LOGS_CONFIG[deviceType];

  // Check bulk operation limits
  if (sessionIds.length > config.maxBulkOperations) {
    setNotification({
      type: 'error',
      message: `Can only delete ${config.maxBulkOperations} conversations at once.`
    });
    setTimeout(() => setNotification(null), NOTIFICATION_DURATIONS[deviceType].error);
    return;
  }

  try {
    setIsLoading(true);
    
    const response = await fetch('/api/chat-logs/bulk-delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionIds: sessionIds,
        clientId: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || 'client_techequity_001',
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
      
      const successMessage = deviceType === 'mobile' 
        ? `${sessionIds.length} conversations deleted!`
        : `Successfully deleted ${sessionIds.length} conversations`;
      
      setNotification({
        type: 'success',
        message: successMessage
      });
      
      setTimeout(() => setNotification(null), NOTIFICATION_DURATIONS[deviceType].success);
      console.log(`Bulk deleted ${sessionIds.length} conversations on ${deviceType}`);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error in bulk delete:', error);
    
    const errorMessage = deviceType === 'mobile'
      ? 'Bulk delete failed.'
      : 'Bulk delete operation failed. Please try again.';
    
    setNotification({
      type: 'error',
      message: errorMessage
    });
    setTimeout(() => setNotification(null), NOTIFICATION_DURATIONS[deviceType].error);
  } finally {
    setIsLoading(false);
  }
};