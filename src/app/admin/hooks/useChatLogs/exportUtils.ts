// src/app/admin/hooks/useChatLogs/exportUtils.ts
// Export and analytics utilities for chat logs

import { ChatLog, ChatSession } from '../../types';
import {
  DeviceType,
  ExportFormat,
  ConversationAnalysis,
  ExportParams,
  CHAT_LOGS_CONFIG,
  NOTIFICATION_DURATIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from './types';

// Export conversations in specified format
export const exportConversations = (params: ExportParams): void => {
  const { sessionIds, format, chatLogs, deviceType, setNotification } = params;
  const config = CHAT_LOGS_CONFIG[deviceType];

  // Validate export limits
  if (sessionIds.length > config.maxExport) {
    const limitMessage = deviceType === 'mobile'
      ? `Can only export ${config.maxExport} conversations at once.`
      : `Export limited to ${config.maxExport} conversations on ${deviceType}.`;
    
    setNotification({
      type: 'error',
      message: limitMessage
    });
    setTimeout(() => setNotification(null), NOTIFICATION_DURATIONS[deviceType].error);
    return;
  }

  // Filter conversations to export
  const conversationsToExport = chatLogs.filter((log: ChatLog) => 
    sessionIds.includes(log.sessionId)
  );
  
  if (conversationsToExport.length === 0) {
    setNotification({
      type: 'error',
      message: 'No conversation data to export.'
    });
    setTimeout(() => setNotification(null), NOTIFICATION_DURATIONS[deviceType].error);
    return;
  }

  try {
    let exportData: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      // CSV format with device-appropriate detail level
      const result = generateCSVExport(conversationsToExport, deviceType);
      exportData = result.data;
      filename = result.filename;
      mimeType = 'text/csv';
    } else {
      // JSON format with device-appropriate formatting
      const result = generateJSONExport(conversationsToExport, deviceType);
      exportData = result.data;
      filename = result.filename;
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

    // Show success notification
    const successMessage = deviceType === 'mobile'
      ? SUCCESS_MESSAGES.export.mobile
      : `Successfully exported ${sessionIds.length} conversations as ${format.toUpperCase()}`;

    setNotification({
      type: 'success',
      message: successMessage
    });
    setTimeout(() => setNotification(null), NOTIFICATION_DURATIONS[deviceType].success);
    
    console.log(`Exported ${sessionIds.length} conversations as ${format} on ${deviceType}`);
  } catch (error) {
    console.error('Export error:', error);
    
    setNotification({
      type: 'error',
      message: ERROR_MESSAGES.export[deviceType]
    });
    setTimeout(() => setNotification(null), NOTIFICATION_DURATIONS[deviceType].error);
  }
};

// Generate CSV export with device-appropriate columns
const generateCSVExport = (
  conversations: ChatLog[],
  deviceType: DeviceType
): { data: string; filename: string } => {
  let headers: string;
  let csvRows: string[];

  if (deviceType === 'mobile') {
    // Mobile: Simplified CSV with essential columns
    headers = 'Session ID,Time,Type,Message,User\n';
    csvRows = conversations.map((log: ChatLog) => {
      const userName = log.userInfo?.userName || 'Anonymous';
      const content = (log.content || '').replace(/"/g, '""'); // Escape quotes
      const time = new Date(log.timestamp).toLocaleString();
      return `"${log.sessionId}","${time}","${log.messageType}","${content}","${userName}"`;
    });
  } else if (deviceType === 'tablet') {
    // Tablet: Balanced CSV with moderate detail
    headers = 'Session ID,Timestamp,Message Type,Content,User Name,First Name,Last Name\n';
    csvRows = conversations.map((log: ChatLog) => {
      const userName = log.userInfo?.userName || 'Anonymous';
      const firstName = log.userInfo?.firstName || '';
      const lastName = log.userInfo?.lastName || '';
      const content = (log.content || '').replace(/"/g, '""');
      return `"${log.sessionId}","${log.timestamp}","${log.messageType}","${content}","${userName}","${firstName}","${lastName}"`;
    });
  } else {
    // Desktop: Full CSV with all available columns
    headers = 'Session ID,Timestamp,Message Type,Content,User Name,First Name,Last Name,Device Type,Client ID\n';
    csvRows = conversations.map((log: ChatLog) => {
      const userName = log.userInfo?.userName || 'Anonymous';
      const firstName = log.userInfo?.firstName || '';
      const lastName = log.userInfo?.lastName || '';
      const content = (log.content || '').replace(/"/g, '""');
      const deviceInfo = log.userInfo?.deviceType || 'Unknown';
      return `"${log.sessionId}","${log.timestamp}","${log.messageType}","${content}","${userName}","${firstName}","${lastName}","${deviceInfo}","techequity"`;
    });
  }

  const csvData = headers + csvRows.join('\n');
  const filename = `chat-conversations-${deviceType}-${new Date().toISOString().split('T')[0]}.csv`;
  
  return { data: csvData, filename };
};

// Generate JSON export with device-appropriate formatting
const generateJSONExport = (
  conversations: ChatLog[],
  deviceType: DeviceType
): { data: string; filename: string } => {
  let exportData: any;
  let jsonString: string;

  if (deviceType === 'mobile') {
    // Mobile: Compact JSON without indentation
    exportData = conversations.map(log => ({
      sessionId: log.sessionId,
      timestamp: log.timestamp,
      type: log.messageType,
      message: log.content,
      user: log.userInfo?.userName || 'Anonymous'
    }));
    jsonString = JSON.stringify(exportData);
  } else if (deviceType === 'tablet') {
    // Tablet: Moderate JSON with some formatting
    exportData = {
      exportDate: new Date().toISOString(),
      deviceType: 'tablet',
      totalConversations: conversations.length,
      conversations: conversations.map(log => ({
        sessionId: log.sessionId,
        timestamp: log.timestamp,
        messageType: log.messageType,
        content: log.content,
        userInfo: {
          userName: log.userInfo?.userName,
          firstName: log.userInfo?.firstName,
          lastName: log.userInfo?.lastName
        }
      }))
    };
    jsonString = JSON.stringify(exportData, null, 2);
  } else {
    // Desktop: Full JSON with complete formatting and metadata
    exportData = {
      exportMetadata: {
        exportDate: new Date().toISOString(),
        deviceType: 'desktop',
        totalConversations: conversations.length,
        exportedBy: 'AutoAssistPro Admin Panel',
        version: '1.0.0'
      },
      conversations: conversations.map(log => ({
        sessionId: log.sessionId,
        timestamp: log.timestamp,
        messageType: log.messageType,
        content: log.content,
        userInfo: log.userInfo || {},
        clientId: 'techequity'
      }))
    };
    jsonString = JSON.stringify(exportData, null, 2);
  }

  const filename = `chat-conversations-${deviceType}-${new Date().toISOString().split('T')[0]}.json`;
  
  return { data: jsonString, filename };
};

// Analyze conversations with device-appropriate depth
export const analyzeConversations = (
  chatSessions: ChatSession[],
  chatLogs: ChatLog[],
  deviceType: DeviceType
): ConversationAnalysis => {
  const analysis: ConversationAnalysis = {
    totalSessions: chatSessions.length,
    averageSessionLength: 0,
    appointmentConversionRate: 0,
    topUserQuestions: [],
    peakActivityHours: [],
    deviceBreakdown: {}
  };

  if (chatSessions.length === 0) return analysis;

  // Calculate average session length
  const totalMessages = chatSessions.reduce((sum: number, session: ChatSession) => 
    sum + session.messageCount, 0
  );
  analysis.averageSessionLength = Math.round((totalMessages / chatSessions.length) * 10) / 10;

  // Calculate appointment conversion rate
  const appointmentSessions = chatSessions.filter((session: ChatSession) => 
    session.hasAppointment
  ).length;
  analysis.appointmentConversionRate = Math.round((appointmentSessions / chatSessions.length) * 100);

  // Extract top user questions with device-appropriate analysis depth
  if (deviceType === 'desktop') {
    // Desktop: Full text analysis
    analysis.topUserQuestions = extractTopUserQuestions(chatLogs, 'advanced');
  } else if (deviceType === 'tablet') {
    // Tablet: Moderate analysis
    analysis.topUserQuestions = extractTopUserQuestions(chatLogs, 'moderate');
  } else {
    // Mobile: Simple predefined questions for performance
    analysis.topUserQuestions = ['consultation', 'services', 'pricing', 'availability', 'contact'];
  }

  // Analyze peak activity hours
  analysis.peakActivityHours = analyzePeakHours(chatLogs);

  // Device breakdown (simulated since we don't store device info comprehensively)
  analysis.deviceBreakdown = {
    mobile: Math.round(chatSessions.length * 0.6),
    tablet: Math.round(chatSessions.length * 0.2),
    desktop: Math.round(chatSessions.length * 0.2)
  };

  return analysis;
};

// Extract top user questions with configurable analysis depth
const extractTopUserQuestions = (
  chatLogs: ChatLog[],
  depth: 'simple' | 'moderate' | 'advanced'
): string[] => {
  const userMessages = chatLogs.filter((log: ChatLog) => log.messageType === 'user');
  
  if (userMessages.length === 0) {
    return ['consultation', 'services', 'pricing', 'availability', 'contact'];
  }

  const questionWords = new Map<string, number>();
  
  userMessages.forEach((log: ChatLog) => {
    const content = log.content?.toLowerCase() || '';
    let words: string[] = [];
    
    switch (depth) {
      case 'simple':
        // Simple word extraction
        words = content.split(' ').filter((word: string) => word.length > 4);
        break;
      case 'moderate':
        // Filter common words and focus on meaningful terms
        words = content.split(' ')
          .filter((word: string) => word.length > 3)
          .filter((word: string) => !['what', 'when', 'where', 'which', 'this', 'that', 'with', 'from'].includes(word));
        break;
      case 'advanced':
        // Advanced processing with stemming-like approach
        words = content.split(' ')
          .filter((word: string) => word.length > 3)
          .filter((word: string) => !isCommonWord(word))
          .map((word: string) => stemWord(word));
        break;
    }
    
    words.forEach((word: string) => {
      questionWords.set(word, (questionWords.get(word) || 0) + 1);
    });
  });
  
  return Array.from(questionWords.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
};

// Simple common word filter
const isCommonWord = (word: string): boolean => {
  const commonWords = [
    'what', 'when', 'where', 'which', 'this', 'that', 'with', 'from',
    'they', 'them', 'there', 'their', 'have', 'been', 'were', 'said',
    'each', 'other', 'more', 'very', 'like', 'just', 'into', 'over'
  ];
  return commonWords.includes(word.toLowerCase());
};

// Simple word stemming
const stemWord = (word: string): string => {
  // Basic stemming rules
  word = word.toLowerCase();
  if (word.endsWith('ing')) return word.slice(0, -3);
  if (word.endsWith('ed')) return word.slice(0, -2);
  if (word.endsWith('es')) return word.slice(0, -2);
  if (word.endsWith('s') && word.length > 3) return word.slice(0, -1);
  return word;
};

// Analyze peak activity hours
const analyzePeakHours = (chatLogs: ChatLog[]): number[] => {
  const hourCounts = new Array(24).fill(0);
  
  chatLogs.forEach((log: ChatLog) => {
    const hour = new Date(log.timestamp).getHours();
    hourCounts[hour]++;
  });
  
  const maxCount = Math.max(...hourCounts);
  if (maxCount === 0) return [];
  
  return hourCounts
    .map((count: number, hour: number) => ({ hour, count }))
    .filter(({ count }) => count > maxCount * 0.7)
    .map(({ hour }) => hour);
};