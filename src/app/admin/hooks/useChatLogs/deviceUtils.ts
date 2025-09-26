// src/app/admin/hooks/useChatLogs/deviceUtils.ts
// Device-specific utilities for chat logs functionality

import { ChatLog, ChatSession } from '../../types';
import { DeviceType, CHAT_LOGS_CONFIG } from './types';

// Device-aware search functionality for chat logs
export const searchChatLogs = (
  query: string,
  chatLogs: ChatLog[],
  deviceType: DeviceType
): ChatLog[] => {
  if (!query.trim()) return chatLogs;
  
  const searchTerm = query.toLowerCase().trim();
  
  return chatLogs.filter(log => {
    const searchFields = [
      log.content?.toLowerCase() || '',
      log.sessionId?.toLowerCase() || '',
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
          return words.some((word: string) => word.length > 3 && word.includes(searchTerm));
        }
        
        return false;
      });
    }
  });
};

// Device-aware session filtering by date
export const filterSessionsByDate = (
  days: number,
  chatSessions: ChatSession[],
  deviceType: DeviceType
): ChatSession[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const filtered = chatSessions.filter(session => 
    new Date(session.lastActivity) >= cutoffDate
  );
  
  // Device-specific filtering limits
  const config = CHAT_LOGS_CONFIG[deviceType];
  
  if (config.maxSessions > 0) {
    return filtered.slice(0, config.maxSessions);
  }
  
  return filtered; // No limit for desktop
};

// Get device-specific UI configurations
export const getDeviceUIConfig = (deviceType: DeviceType) => {
  return {
    mobile: {
      itemsPerPage: 5,
      maxVisibleTabs: 3,
      compactMode: true,
      showFullTimestamps: false,
      enableSwipeGestures: true,
      maxSearchResults: 10,
      enableInfiniteScroll: true,
      showAdvancedFilters: false
    },
    tablet: {
      itemsPerPage: 8,
      maxVisibleTabs: 5,
      compactMode: false,
      showFullTimestamps: true,
      enableSwipeGestures: true,
      maxSearchResults: 25,
      enableInfiniteScroll: true,
      showAdvancedFilters: true
    },
    desktop: {
      itemsPerPage: 10,
      maxVisibleTabs: 7,
      compactMode: false,
      showFullTimestamps: true,
      enableSwipeGestures: false,
      maxSearchResults: 50,
      enableInfiniteScroll: false,
      showAdvancedFilters: true
    }
  }[deviceType];
};

// Format timestamps based on device preferences
export const formatTimestamp = (
  timestamp: string,
  deviceType: DeviceType,
  relative: boolean = false
): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (relative) {
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (deviceType === 'mobile') {
      // Mobile: Very compact relative times
      if (diffMinutes < 1) return 'now';
      if (diffMinutes < 60) return `${diffMinutes}m`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
      return `${Math.floor(diffMinutes / 1440)}d`;
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced relative times
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
      return `${Math.floor(diffMinutes / 1440)} days ago`;
    } else {
      // Desktop: Full relative times
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      if (diffMinutes < 1440) {
        const hours = Math.floor(diffMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      }
      const days = Math.floor(diffMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  } else {
    // Absolute timestamps
    if (deviceType === 'mobile') {
      // Mobile: Compact format
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } else if (deviceType === 'tablet') {
      // Tablet: Medium format
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } else {
      // Desktop: Full format
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  }
};

// Get device-appropriate pagination settings
export const getDevicePaginationConfig = (deviceType: DeviceType) => {
  const config = CHAT_LOGS_CONFIG[deviceType];
  
  return {
    mobile: {
      defaultPageSize: 5,
      pageSizeOptions: [5, 10, 15],
      showQuickJump: false,
      showPageInfo: false,
      maxVisiblePages: 3
    },
    tablet: {
      defaultPageSize: 8,
      pageSizeOptions: [5, 10, 15, 20],
      showQuickJump: true,
      showPageInfo: true,
      maxVisiblePages: 5
    },
    desktop: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 20, 50, 100],
      showQuickJump: true,
      showPageInfo: true,
      maxVisiblePages: 7
    }
  }[deviceType];
};

// Validate device capabilities for specific operations
export const validateDeviceOperation = (
  operation: 'bulk_delete' | 'export' | 'search' | 'filter',
  itemCount: number,
  deviceType: DeviceType
): { allowed: boolean; message?: string } => {
  const config = CHAT_LOGS_CONFIG[deviceType];
  
  switch (operation) {
    case 'bulk_delete':
      if (itemCount > config.maxBulkOperations) {
        return {
          allowed: false,
          message: `Can only delete ${config.maxBulkOperations} items at once on ${deviceType}`
        };
      }
      break;
      
    case 'export':
      if (itemCount > config.maxExport) {
        return {
          allowed: false,
          message: `Can only export ${config.maxExport} items at once on ${deviceType}`
        };
      }
      break;
      
    case 'search':
      const uiConfig = getDeviceUIConfig(deviceType);
      if (itemCount > uiConfig.maxSearchResults) {
        return {
          allowed: true,
          message: `Showing first ${uiConfig.maxSearchResults} results on ${deviceType}`
        };
      }
      break;
      
    case 'filter':
      // Filter operations are generally allowed but may be limited
      if (deviceType === 'mobile' && itemCount > 50) {
        return {
          allowed: true,
          message: 'Results limited for mobile performance'
        };
      }
      break;
  }
  
  return { allowed: true };
};

// Get device-specific loading strategies
export const getDeviceLoadingStrategy = (deviceType: DeviceType) => {
  return {
    mobile: {
      showSkeletons: true,
      loadInBatches: true,
      batchSize: 10,
      enableLazyLoading: true,
      showProgressIndicator: true,
      cacheStrategy: 'aggressive'
    },
    tablet: {
      showSkeletons: true,
      loadInBatches: true,
      batchSize: 20,
      enableLazyLoading: true,
      showProgressIndicator: false,
      cacheStrategy: 'moderate'
    },
    desktop: {
      showSkeletons: false,
      loadInBatches: false,
      batchSize: 50,
      enableLazyLoading: false,
      showProgressIndicator: false,
      cacheStrategy: 'minimal'
    }
  }[deviceType];
};

// Handle device-specific error recovery
export const getDeviceErrorRecovery = (deviceType: DeviceType) => {
  return {
    mobile: {
      retryAutomatically: true,
      maxAutoRetries: 2,
      showRetryButton: true,
      fallbackToCache: true,
      simplifyOnError: true
    },
    tablet: {
      retryAutomatically: false,
      maxAutoRetries: 1,
      showRetryButton: true,
      fallbackToCache: true,
      simplifyOnError: false
    },
    desktop: {
      retryAutomatically: false,
      maxAutoRetries: 0,
      showRetryButton: true,
      fallbackToCache: false,
      simplifyOnError: false
    }
  }[deviceType];
};

// Get device-appropriate animation settings
export const getDeviceAnimationConfig = (deviceType: DeviceType) => {
  return {
    mobile: {
      enableAnimations: true,
      transitionDuration: 200,
      easing: 'ease-out',
      enableHoverEffects: false,
      reduceMotion: true
    },
    tablet: {
      enableAnimations: true,
      transitionDuration: 300,
      easing: 'ease-in-out',
      enableHoverEffects: true,
      reduceMotion: false
    },
    desktop: {
      enableAnimations: true,
      transitionDuration: 250,
      easing: 'ease-in-out',
      enableHoverEffects: true,
      reduceMotion: false
    }
  }[deviceType];
};