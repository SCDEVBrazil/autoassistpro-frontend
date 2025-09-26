// src/app/admin/hooks/useChatLogs/index.ts
// Main Chat Logs Hook - Orchestrates all chat logs functionality

import { useState, useCallback, useEffect } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ChatLog, ChatSession, Notification } from '../../types';
import { ConversationBox } from '../../components/ChatLogsTab/types';
import { 
  UseChatLogsReturn,
  NOTIFICATION_DURATIONS,
  DeviceType 
} from './types';
import { 
  loadChatLogsApi, 
  deleteConversationApi, 
  bulkDeleteConversationsApi 
} from './apiUtils';
import { 
  processChatSessions, 
  calculateSessionDuration,
  extractUserName,
  getConversationStats 
} from './sessionUtils';
import { 
  searchChatLogs, 
  filterSessionsByDate 
} from './deviceUtils';
import { 
  exportConversations, 
  analyzeConversations 
} from './exportUtils';
import { 
  refreshChatDataUtil, 
  setupAutoRefreshUtil,
  loadAllChatDataUtil 
} from './refreshUtils';

export const useChatLogs = (
  setNotification: (notification: Notification | null) => void
): UseChatLogsReturn => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  // Core state
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // Enhanced load chat logs with graceful update support
  const loadChatLogs = useCallback(async (sessionId?: string, isGracefulUpdate: boolean = false) => {
    return await loadChatLogsApi({
      sessionId,
      isGracefulUpdate,
      deviceType,
      isTouchDevice,
      setIsLoading,
      setChatLogs,
      setNotification
    });
  }, [deviceType, isTouchDevice, setNotification]);

  // Enhanced delete conversation
  const deleteConversation = useCallback(async (sessionId: string) => {
    await deleteConversationApi({
      sessionId,
      selectedSession,
      deviceType,
      setIsLoading,
      setChatLogs,
      setSelectedSession,
      setNotification
    });
  }, [selectedSession, deviceType, setNotification]);

  // Process chat sessions whenever chatLogs updates
  useEffect(() => {
    if (chatLogs.length > 0) {
      const processedSessions = processChatSessions(chatLogs, deviceType, extractUserName, calculateSessionDuration);
      setChatSessions(processedSessions);
    }
  }, [chatLogs, deviceType]);

  // Device-aware session selection
  const handleSelectSession = useCallback(async (sessionId: string | null) => {
    setSelectedSession(sessionId);
    
    if (deviceType === 'mobile') {
      console.log(`Mobile session selected: ${sessionId}`);
    } else if (deviceType === 'tablet') {
      if (sessionId && isTouchDevice) {
        console.log(`Tablet touch session selected: ${sessionId}`);
      }
    } else {
      if (sessionId) {
        console.log(`Desktop session selected: ${sessionId} - showing conversation details`);
      } else {
        console.log('Desktop session deselected - returning to conversation list');
      }
    }
  }, [deviceType, isTouchDevice]);

  // Graceful chat data refresh
  const refreshChatData = useCallback(async () => {
    await refreshChatDataUtil({
      loadChatLogs,
      deviceType,
      setIsLoading
    });
  }, [loadChatLogs, deviceType]);

  // Load all chat data with loading state
  const loadAllChatData = useCallback(async () => {
    await loadAllChatDataUtil({
      loadChatLogs,
      deviceType,
      setIsLoading
    });
  }, [loadChatLogs, deviceType]);

  // Bulk delete conversations
  const bulkDeleteConversations = useCallback(async (sessionIds: string[]) => {
    await bulkDeleteConversationsApi({
      sessionIds,
      selectedSession,
      deviceType,
      setIsLoading,
      setChatLogs,
      setChatSessions,
      setSelectedSession,
      setNotification
    });
  }, [selectedSession, deviceType, setNotification]);

  // Export conversations
  const exportConversationsFunc = useCallback((sessionIds: string[], format: 'json' | 'csv' = 'json') => {
    exportConversations({
      sessionIds,
      format,
      chatLogs,
      deviceType,
      setNotification
    });
  }, [chatLogs, deviceType, setNotification]);

  // Search chat logs
  const searchChatLogsFunc = useCallback((query: string) => {
    return searchChatLogs(query, chatLogs, deviceType);
  }, [chatLogs, deviceType]);

  // Filter sessions by date
  const filterSessionsByDateFunc = useCallback((days: number) => {
    return filterSessionsByDate(days, chatSessions, deviceType);
  }, [chatSessions, deviceType]);

  // Get conversation statistics
  const getConversationStatsFunc = useCallback(() => {
    return getConversationStats(chatSessions, chatLogs, filterSessionsByDateFunc, deviceType);
  }, [chatSessions, chatLogs, filterSessionsByDateFunc, deviceType]);

  // Analyze conversations
  const analyzeConversationsFunc = useCallback(() => {
    return analyzeConversations(chatSessions, chatLogs, deviceType);
  }, [chatSessions, chatLogs, deviceType]);

  // Setup auto-refresh
  const setupAutoRefresh = useCallback((intervalMinutes: number = 5) => {
    return setupAutoRefreshUtil({
      intervalMinutes,
      refreshChatData,
      deviceType
    });
  }, [refreshChatData, deviceType]);

  // Update sessions from logs
  const updateSessionsFromLogs = useCallback(() => {
    if (chatLogs.length > 0) {
      const processedSessions = processChatSessions(chatLogs, deviceType, extractUserName, calculateSessionDuration);
      setChatSessions(processedSessions);
    }
  }, [chatLogs, deviceType]);

  // Return all hook functionality
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
    searchChatLogs: searchChatLogsFunc,
    filterSessionsByDate: filterSessionsByDateFunc,
    getConversationStats: getConversationStatsFunc,
    bulkDeleteConversations,
    exportConversations: exportConversationsFunc,
    analyzeConversations: analyzeConversationsFunc,
    setupAutoRefresh,
    updateSessionsFromLogs
  };
};