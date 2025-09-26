// src/app/admin/hooks/useChatLogs/refreshUtils.ts
// Auto-refresh and polling utilities for chat logs

import { ChatLog } from '../../types';
import {
  DeviceType,
  RefreshParams,
  AutoRefreshParams,
  AUTO_REFRESH_INTERVALS
} from './types';

// Graceful chat data refresh - solves the polling content disappearing issue
export const refreshChatDataUtil = async (params: RefreshParams): Promise<void> => {
  const { loadChatLogs, deviceType, setIsLoading } = params;

  try {
    console.log(`Starting graceful chat data refresh on ${deviceType}`);
    
    // CRITICAL FIX: Never set loading state during background refresh
    // This prevents the content from disappearing during polling updates
    
    // Perform the refresh with graceful update flag
    await loadChatLogs(undefined, true); // isGracefulUpdate = true
    
    console.log(`Graceful chat data refresh completed on ${deviceType}`);
  } catch (error) {
    console.error(`Chat data refresh failed on ${deviceType}:`, error);
    
    // On error during graceful refresh, silently handle it
    // Don't disrupt the UI with error notifications during background updates
  }
};

// Load all chat data with loading state (for initial loads)
export const loadAllChatDataUtil = async (params: RefreshParams): Promise<void> => {
  const { loadChatLogs, deviceType, setIsLoading } = params;

  try {
    console.log(`Loading all chat data on ${deviceType}`);
    
    // For initial loads, we DO want to show loading state
    if (setIsLoading) {
      setIsLoading(true);
    }
    
    // Use normal loading (not graceful) for initial loads
    await loadChatLogs(undefined, false); // isGracefulUpdate = false
  } catch (error) {
    console.error(`Failed to load all chat data on ${deviceType}:`, error);
    // Error handling is done in the loadChatLogs function
  } finally {
    if (setIsLoading) {
      setIsLoading(false);
    }
  }
};

// Setup auto-refresh with device-appropriate intervals
export const setupAutoRefreshUtil = (params: AutoRefreshParams): (() => void) => {
  const { intervalMinutes, refreshChatData, deviceType } = params;

  // Device-specific auto-refresh intervals with minimum limits
  const minInterval = AUTO_REFRESH_INTERVALS[deviceType];
  const actualInterval = Math.max(intervalMinutes, minInterval) * 60 * 1000; // Convert to milliseconds
  
  console.log(`Setting up auto-refresh for ${deviceType}: every ${Math.max(intervalMinutes, minInterval)} minutes`);
  
  const intervalId = setInterval(async () => {
    try {
      // Use graceful refresh for auto-refresh to prevent UI disruption
      await refreshChatData();
      console.log(`Auto-refreshed chat data gracefully on ${deviceType}`);
    } catch (error) {
      console.error('Auto-refresh failed:', error);
      // Don't show notifications for failed auto-refreshes
      // as they can be disruptive to the user experience
    }
  }, actualInterval);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    console.log(`Auto-refresh cleared for ${deviceType}`);
  };
};

// Get device-specific refresh strategies
export const getDeviceRefreshStrategy = (deviceType: DeviceType) => {
  return {
    mobile: {
      backgroundRefresh: true,
      showLoadingOnInitial: true,
      showLoadingOnManual: true,
      showLoadingOnBackground: false, // CRITICAL: No loading state for background
      retryFailedRefresh: true,
      maxBackgroundRetries: 1,
      refreshOnFocus: false,
      refreshOnReconnect: true
    },
    tablet: {
      backgroundRefresh: true,
      showLoadingOnInitial: true,
      showLoadingOnManual: true,
      showLoadingOnBackground: false, // CRITICAL: No loading state for background
      retryFailedRefresh: true,
      maxBackgroundRetries: 2,
      refreshOnFocus: true,
      refreshOnReconnect: true
    },
    desktop: {
      backgroundRefresh: true,
      showLoadingOnInitial: true,
      showLoadingOnManual: false, // Desktop users expect instant updates
      showLoadingOnBackground: false, // CRITICAL: No loading state for background
      retryFailedRefresh: false, // Let user manually refresh on desktop
      maxBackgroundRetries: 0,
      refreshOnFocus: true,
      refreshOnReconnect: true
    }
  }[deviceType];
};

// Create a refresh scheduler with smart timing
export const createRefreshScheduler = (
  refreshFunction: () => Promise<void>,
  deviceType: DeviceType
) => {
  let refreshTimer: NodeJS.Timeout | null = null;
  let isRefreshing = false;
  let missedRefreshes = 0;
  const maxMissedRefreshes = 3;

  const schedule = (intervalMinutes: number = 5) => {
    // Clear existing timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    const actualInterval = Math.max(intervalMinutes, AUTO_REFRESH_INTERVALS[deviceType]);
    
    refreshTimer = setTimeout(async () => {
      // Skip if already refreshing
      if (isRefreshing) {
        missedRefreshes++;
        console.log(`Skipped refresh (already in progress) on ${deviceType}. Missed: ${missedRefreshes}`);
        
        // If we've missed too many, something might be wrong
        if (missedRefreshes >= maxMissedRefreshes) {
          console.warn(`Too many missed refreshes (${missedRefreshes}) on ${deviceType}. Resetting.`);
          missedRefreshes = 0;
          isRefreshing = false;
        }
        
        schedule(actualInterval); // Reschedule
        return;
      }

      try {
        isRefreshing = true;
        await refreshFunction();
        missedRefreshes = 0; // Reset missed counter on success
      } catch (error) {
        console.error('Scheduled refresh failed:', error);
      } finally {
        isRefreshing = false;
        schedule(actualInterval); // Reschedule for next refresh
      }
    }, actualInterval * 60 * 1000);
  };

  const stop = () => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
    isRefreshing = false;
    missedRefreshes = 0;
  };

  const forceRefresh = async () => {
    if (isRefreshing) {
      console.log(`Force refresh requested but already refreshing on ${deviceType}`);
      return;
    }

    try {
      isRefreshing = true;
      await refreshFunction();
    } finally {
      isRefreshing = false;
    }
  };

  return {
    schedule,
    stop,
    forceRefresh,
    isActive: () => refreshTimer !== null,
    isRefreshing: () => isRefreshing,
    getMissedCount: () => missedRefreshes
  };
};

// Handle network reconnection refreshes
export const handleNetworkReconnection = async (
  refreshFunction: () => Promise<void>,
  deviceType: DeviceType
): Promise<void> => {
  console.log(`Network reconnection detected on ${deviceType}`);
  
  // Different strategies per device
  if (deviceType === 'mobile') {
    // Mobile: Wait a bit for connection to stabilize, then refresh
    setTimeout(async () => {
      try {
        await refreshFunction();
        console.log(`Reconnection refresh completed on mobile`);
      } catch (error) {
        console.error('Reconnection refresh failed on mobile:', error);
      }
    }, 2000);
  } else if (deviceType === 'tablet') {
    // Tablet: Immediate refresh
    try {
      await refreshFunction();
      console.log(`Reconnection refresh completed on tablet`);
    } catch (error) {
      console.error('Reconnection refresh failed on tablet:', error);
    }
  } else {
    // Desktop: Immediate refresh with retry
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount < maxRetries) {
      try {
        await refreshFunction();
        console.log(`Reconnection refresh completed on desktop`);
        break;
      } catch (error) {
        retryCount++;
        if (retryCount >= maxRetries) {
          console.error('Reconnection refresh failed on desktop after retries:', error);
        } else {
          console.log(`Reconnection refresh retry ${retryCount} on desktop`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }
};

// Handle page visibility changes (when user switches tabs/apps)
export const handleVisibilityChange = async (
  refreshFunction: () => Promise<void>,
  deviceType: DeviceType,
  isVisible: boolean
): Promise<void> => {
  const strategy = getDeviceRefreshStrategy(deviceType);
  
  if (isVisible && strategy.refreshOnFocus) {
    console.log(`Page became visible, refreshing on ${deviceType}`);
    
    // Small delay to ensure page is fully active
    setTimeout(async () => {
      try {
        await refreshFunction();
        console.log(`Focus refresh completed on ${deviceType}`);
      } catch (error) {
        console.error(`Focus refresh failed on ${deviceType}:`, error);
      }
    }, 500);
  }
};