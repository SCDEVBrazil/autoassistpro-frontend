// Device-Specific Configurations and Utilities
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/utils/deviceUtils.ts

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceConfig {
  // Performance limits
  maxFilterResults: number;
  maxPastAppointments: number;
  defaultPageSize: number;
  maxPageSize: number;
  searchDebounceMs: number;
  
  // UI configuration
  touchTargetSize: number;
  maxVisibleFilters: number;
  showAdvancedFilters: boolean;
  compactMode: boolean;
  
  // Feature toggles
  enableBulkOperations: boolean;
  enableExport: boolean;
  enablePreferences: boolean;
  enableStats: boolean;
  
  // Performance thresholds
  slowFilterThresholdMs: number;
  maxExportRecords: number;
  maxExportSizeMB: number;
  
  // Storage limits
  maxPreferenceHistory: number;
  maxCacheSize: number;
}

export interface DeviceCapabilities {
  hasTouch: boolean;
  hasHover: boolean;
  hasKeyboard: boolean;
  screenSize: 'small' | 'medium' | 'large';
  orientation: 'portrait' | 'landscape';
  connectionSpeed: 'slow' | 'fast' | 'unknown';
}

export interface PerformanceMetrics {
  filteringTimeMs: number;
  renderTimeMs: number;
  memoryUsageMB: number;
  isSlowDevice: boolean;
}

// Device-specific configurations
const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  mobile: {
    // Performance limits for mobile devices
    maxFilterResults: 100,
    maxPastAppointments: 30, // Last 30 days only
    defaultPageSize: 5,
    maxPageSize: 10,
    searchDebounceMs: 300,
    
    // Mobile UI optimizations
    touchTargetSize: 48,
    maxVisibleFilters: 2,
    showAdvancedFilters: false,
    compactMode: true,
    
    // Limited features for performance
    enableBulkOperations: false,
    enableExport: true,
    enablePreferences: true,
    enableStats: false,
    
    // Strict performance thresholds
    slowFilterThresholdMs: 100,
    maxExportRecords: 500,
    maxExportSizeMB: 5,
    
    // Minimal storage
    maxPreferenceHistory: 5,
    maxCacheSize: 50
  },
  
  tablet: {
    // Balanced performance for tablets
    maxFilterResults: 500,
    maxPastAppointments: 90, // Last 90 days
    defaultPageSize: 10,
    maxPageSize: 20,
    searchDebounceMs: 250,
    
    // Tablet UI balance
    touchTargetSize: 44,
    maxVisibleFilters: 3,
    showAdvancedFilters: true,
    compactMode: false,
    
    // Most features enabled
    enableBulkOperations: true,
    enableExport: true,
    enablePreferences: true,
    enableStats: true,
    
    // Moderate performance thresholds
    slowFilterThresholdMs: 150,
    maxExportRecords: 2000,
    maxExportSizeMB: 15,
    
    // Moderate storage
    maxPreferenceHistory: 10,
    maxCacheSize: 200
  },
  
  desktop: {
    // Full performance for desktop
    maxFilterResults: 2000,
    maxPastAppointments: -1, // No limit
    defaultPageSize: 15,
    maxPageSize: 50,
    searchDebounceMs: 200,
    
    // Desktop UI full features
    touchTargetSize: 40,
    maxVisibleFilters: 5,
    showAdvancedFilters: true,
    compactMode: false,
    
    // All features enabled
    enableBulkOperations: true,
    enableExport: true,
    enablePreferences: true,
    enableStats: true,
    
    // Relaxed performance thresholds
    slowFilterThresholdMs: 200,
    maxExportRecords: 10000,
    maxExportSizeMB: 50,
    
    // Full storage capabilities
    maxPreferenceHistory: 20,
    maxCacheSize: 1000
  }
};

// Get device configuration
export const getDeviceConfig = (deviceType: DeviceType): DeviceConfig => {
  return DEVICE_CONFIGS[deviceType];
};

// Detect device capabilities
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const hasKeyboard = !hasTouch || window.innerWidth > 768;
  
  // Screen size detection
  let screenSize: 'small' | 'medium' | 'large';
  if (window.innerWidth < 768) {
    screenSize = 'small';
  } else if (window.innerWidth < 1024) {
    screenSize = 'medium';
  } else {
    screenSize = 'large';
  }
  
  // Orientation detection
  const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  
  // Connection speed estimation (basic)
  let connectionSpeed: 'slow' | 'fast' | 'unknown' = 'unknown';
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection.effectiveType) {
      connectionSpeed = ['slow-2g', '2g'].includes(connection.effectiveType) ? 'slow' : 'fast';
    }
  }
  
  return {
    hasTouch,
    hasHover,
    hasKeyboard,
    screenSize,
    orientation,
    connectionSpeed
  };
};

// Performance monitoring utilities
export const createPerformanceMonitor = () => {
  let startTime = 0;
  let filterStartTime = 0;
  let renderStartTime = 0;
  
  return {
    startFiltering: () => {
      filterStartTime = performance.now();
    },
    
    endFiltering: () => {
      return performance.now() - filterStartTime;
    },
    
    startRendering: () => {
      renderStartTime = performance.now();
    },
    
    endRendering: () => {
      return performance.now() - renderStartTime;
    },
    
    getMemoryUsage: (): number => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
      }
      return 0;
    },
    
    isSlowDevice: (filteringTimeMs: number, deviceType: DeviceType): boolean => {
      const config = getDeviceConfig(deviceType);
      return filteringTimeMs > config.slowFilterThresholdMs;
    }
  };
};

// Optimize filtering strategy based on device
export const getOptimalFilteringStrategy = (
  appointmentCount: number,
  deviceType: DeviceType,
  capabilities: DeviceCapabilities
): {
  useVirtualization: boolean;
  batchSize: number;
  useDeferredFiltering: boolean;
  enablePrefiltering: boolean;
} => {
  const config = getDeviceConfig(deviceType);
  
  // Base strategy
  let strategy = {
    useVirtualization: false,
    batchSize: 50,
    useDeferredFiltering: false,
    enablePrefiltering: false
  };
  
  // Adjust based on device type
  if (deviceType === 'mobile') {
    strategy = {
      useVirtualization: appointmentCount > 100,
      batchSize: 25,
      useDeferredFiltering: appointmentCount > 200,
      enablePrefiltering: true
    };
  } else if (deviceType === 'tablet') {
    strategy = {
      useVirtualization: appointmentCount > 300,
      batchSize: 50,
      useDeferredFiltering: appointmentCount > 500,
      enablePrefiltering: appointmentCount > 100
    };
  } else { // desktop
    strategy = {
      useVirtualization: appointmentCount > 1000,
      batchSize: 100,
      useDeferredFiltering: appointmentCount > 2000,
      enablePrefiltering: appointmentCount > 500
    };
  }
  
  // Adjust for slow connections
  if (capabilities.connectionSpeed === 'slow') {
    strategy.useDeferredFiltering = appointmentCount > 50;
    strategy.enablePrefiltering = true;
    strategy.batchSize = Math.max(10, strategy.batchSize / 2);
  }
  
  return strategy;
};

// Get device-appropriate debounce delays
export const getDebounceDelays = (deviceType: DeviceType): {
  search: number;
  filter: number;
  resize: number;
} => {
  switch (deviceType) {
    case 'mobile':
      return {
        search: 400, // Longer delay for mobile typing
        filter: 200,
        resize: 250
      };
    case 'tablet':
      return {
        search: 300,
        filter: 150,
        resize: 200
      };
    case 'desktop':
      return {
        search: 200, // Faster for keyboard users
        filter: 100,
        resize: 150
      };
    default:
      return {
        search: 300,
        filter: 150,
        resize: 200
      };
  }
};

// Get device-appropriate animation timings
export const getAnimationTimings = (deviceType: DeviceType): {
  fast: number;
  medium: number;
  slow: number;
} => {
  // Reduce animation duration on slower devices
  switch (deviceType) {
    case 'mobile':
      return {
        fast: 150,
        medium: 250,
        slow: 350
      };
    case 'tablet':
      return {
        fast: 200,
        medium: 300,
        slow: 400
      };
    case 'desktop':
      return {
        fast: 250,
        medium: 350,
        slow: 500
      };
    default:
      return {
        fast: 200,
        medium: 300,
        slow: 400
      };
  }
};

// Determine optimal batch processing size
export const getBatchProcessingSize = (
  itemCount: number,
  deviceType: DeviceType,
  operationType: 'filter' | 'sort' | 'export' | 'delete'
): number => {
  const config = getDeviceConfig(deviceType);
  
  let baseSize: number;
  
  switch (operationType) {
    case 'filter':
      baseSize = config.maxFilterResults / 4;
      break;
    case 'sort':
      baseSize = config.maxFilterResults / 2;
      break;
    case 'export':
      baseSize = config.maxExportRecords / 10;
      break;
    case 'delete':
      baseSize = deviceType === 'mobile' ? 5 : deviceType === 'tablet' ? 10 : 20;
      break;
    default:
      baseSize = 50;
  }
  
  // Ensure batch size is reasonable
  return Math.min(Math.max(baseSize, 10), itemCount);
};

// Check if feature should be enabled based on device
export const shouldEnableFeature = (
  feature: keyof DeviceConfig,
  deviceType: DeviceType,
  currentLoad?: number
): boolean => {
  const config = getDeviceConfig(deviceType);
  const isEnabled = config[feature];
  
  // If feature is boolean, return it directly
  if (typeof isEnabled === 'boolean') {
    return isEnabled;
  }
  
  // For performance-sensitive features, consider current load
  if (currentLoad !== undefined && deviceType === 'mobile') {
    // Disable some features under high load on mobile
    if (currentLoad > 80 && ['enableStats', 'enableBulkOperations'].includes(feature)) {
      return false;
    }
  }
  
  return Boolean(isEnabled);
};

// Get device-appropriate error messages
export const getDeviceErrorMessage = (
  error: 'too_many_results' | 'slow_performance' | 'export_limit' | 'search_too_short',
  deviceType: DeviceType,
  context?: { count?: number; limit?: number; time?: number }
): string => {
  const isMobile = deviceType === 'mobile';
  
  switch (error) {
    case 'too_many_results':
      return isMobile
        ? `Too many results (${context?.count}). Try filtering.`
        : `Too many results (${context?.count}). Please apply more specific filters to improve performance.`;
        
    case 'slow_performance':
      return isMobile
        ? `Search is slow. Try shorter terms.`
        : `Filtering is taking longer than expected (${context?.time}ms). Consider using more specific filters.`;
        
    case 'export_limit':
      return isMobile
        ? `Export limit: ${context?.limit} max`
        : `Export limit exceeded. Maximum ${context?.limit} records allowed on ${deviceType}.`;
        
    case 'search_too_short':
      return isMobile
        ? `Need 2+ characters`
        : `Search term must be at least 2 characters long.`;
        
    default:
      return isMobile ? 'Error occurred' : 'An error occurred. Please try again.';
  }
};