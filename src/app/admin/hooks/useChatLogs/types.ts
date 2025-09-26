// src/app/admin/hooks/useChatLogs/types.ts
// Types, interfaces, and constants for chat logs functionality

import { ChatLog, ChatSession, Notification } from '../../types';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type ExportFormat = 'json' | 'csv';

// Device-specific configuration interface
export interface DeviceConfig {
  maxRetries: number;
  timeout: number;
  limit: number;
  sessionLimit: number;
  retryDelay: number;
  dayLimit: number;
  maxSessions: number;
  maxBulkOperations: number;
  maxExport: number;
}

// Complete device configuration mapping
export interface ChatLogsConfig {
  mobile: DeviceConfig;
  tablet: DeviceConfig;
  desktop: DeviceConfig;
}

// Conversation analysis result interface
export interface ConversationAnalysis {
  totalSessions: number;
  averageSessionLength: number;
  appointmentConversionRate: number;
  topUserQuestions: string[];
  peakActivityHours: number[];
  deviceBreakdown: { [key: string]: number };
}

// Main hook return interface
export interface UseChatLogsReturn {
  // Core state
  chatLogs: ChatLog[];
  chatSessions: ChatSession[];
  isLoading: boolean;
  selectedSession: string | null;
  
  // Core actions
  loadAllChatData: () => Promise<void>;
  loadChatLogs: (sessionId?: string, isGracefulUpdate?: boolean) => Promise<ChatLog[]>;
  handleSelectSession: (sessionId: string | null) => Promise<void>;
  setSelectedSession: (sessionId: string | null) => void;
  refreshChatData: () => Promise<void>;
  deleteConversation: (sessionId: string) => Promise<void>;
  
  // Device-aware features
  deviceType: DeviceType;
  isTouchDevice: boolean;
  searchChatLogs: (query: string) => ChatLog[];
  filterSessionsByDate: (days: number) => ChatSession[];
  getConversationStats: () => any;
  bulkDeleteConversations: (sessionIds: string[]) => Promise<void>;
  exportConversations: (sessionIds: string[], format?: ExportFormat) => void;
  analyzeConversations: () => ConversationAnalysis;
  setupAutoRefresh: (intervalMinutes?: number) => () => void;
  updateSessionsFromLogs: () => void;
}

// API function parameter interfaces
export interface LoadChatLogsParams {
  sessionId?: string;
  isGracefulUpdate: boolean;
  deviceType: DeviceType;
  isTouchDevice: boolean;
  setIsLoading: (loading: boolean) => void;
  setChatLogs: (logs: ChatLog[]) => void;
  setNotification: (notification: Notification | null) => void;
}

export interface DeleteConversationParams {
  sessionId: string;
  selectedSession: string | null;
  deviceType: DeviceType;
  setIsLoading: (loading: boolean) => void;
  setChatLogs: (updater: (prev: ChatLog[]) => ChatLog[]) => void;
  setSelectedSession: (sessionId: string | null) => void;
  setNotification: (notification: Notification | null) => void;
}

export interface BulkDeleteParams {
  sessionIds: string[];
  selectedSession: string | null;
  deviceType: DeviceType;
  setIsLoading: (loading: boolean) => void;
  setChatLogs: (updater: (prev: ChatLog[]) => ChatLog[]) => void;
  setChatSessions: (updater: (prev: ChatSession[]) => ChatSession[]) => void;
  setSelectedSession: (sessionId: string | null) => void;
  setNotification: (notification: Notification | null) => void;
}

export interface ExportParams {
  sessionIds: string[];
  format: ExportFormat;
  chatLogs: ChatLog[];
  deviceType: DeviceType;
  setNotification: (notification: Notification | null) => void;
}

export interface RefreshParams {
  loadChatLogs: (sessionId?: string, isGracefulUpdate?: boolean) => Promise<ChatLog[]>;
  deviceType: DeviceType;
  setIsLoading?: (loading: boolean) => void;
}

export interface AutoRefreshParams {
  intervalMinutes: number;
  refreshChatData: () => Promise<void>;
  deviceType: DeviceType;
}

// Device-specific configuration constants
export const CHAT_LOGS_CONFIG: ChatLogsConfig = {
  mobile: {
    maxRetries: 2,
    timeout: 10000,
    limit: 50,
    sessionLimit: 50,
    retryDelay: 2000,
    dayLimit: 30,
    maxSessions: 20,
    maxBulkOperations: 3,
    maxExport: 5
  },
  tablet: {
    maxRetries: 3,
    timeout: 8000,
    limit: 150,
    sessionLimit: 100,
    retryDelay: 1500,
    dayLimit: 60,
    maxSessions: 40,
    maxBulkOperations: 8,
    maxExport: 15
  },
  desktop: {
    maxRetries: 3,
    timeout: 6000,
    limit: 500,
    sessionLimit: 100,
    retryDelay: 1000,
    dayLimit: -1, // No limit
    maxSessions: -1, // No limit
    maxBulkOperations: 20,
    maxExport: 50
  }
};

// Auto-refresh interval constants (in minutes)
export const AUTO_REFRESH_INTERVALS = {
  mobile: 10,  // Minimum 10 minutes on mobile
  tablet: 5,   // Minimum 5 minutes on tablet
  desktop: 2   // Minimum 2 minutes on desktop
};

// Notification duration constants (in milliseconds)
export const NOTIFICATION_DURATIONS = {
  mobile: {
    success: 2000,
    error: 4000
  },
  tablet: {
    success: 3000,
    error: 5000
  },
  desktop: {
    success: 3000,
    error: 5000
  }
};

// Error message constants
export const ERROR_MESSAGES = {
  load: {
    mobile: 'Cannot load chat data. Check connection.',
    tablet: 'Failed to load chat logs. Please try again.',
    desktop: 'Failed to load chat logs. Please try again.'
  },
  delete: {
    mobile: 'Delete failed. Try again.',
    tablet: 'Failed to delete conversation.',
    desktop: 'Failed to delete conversation.'
  },
  network: {
    mobile: 'Connection error.',
    tablet: 'Network error. Please try again.',
    desktop: 'Network error. Please try again.'
  },
  export: {
    mobile: 'Export failed.',
    tablet: 'Export failed. Please try again.',
    desktop: 'Export operation failed. Please try again.'
  }
};

// Success message constants
export const SUCCESS_MESSAGES = {
  delete: {
    mobile: 'Deleted!',
    tablet: 'Conversation deleted successfully!',
    desktop: 'Conversation deleted successfully!'
  },
  export: {
    mobile: 'Export started!',
    tablet: 'Export completed successfully',
    desktop: 'Export completed successfully'
  }
};