// Default Values and Configuration Constants
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/constants/filterConstants.ts

import { 
  StatusFilter, 
  DateFilter, 
  SortOption, 
  DeviceType,
  FilteringDefaults,
  ExportFormat,
  FilterPreferences 
} from '../types/filterTypes';

// Core filter default values
export const FILTER_DEFAULTS = {
  // Search defaults
  searchTerm: '',
  searchMinLength: 2,
  searchMaxLength: 100,
  
  // Status filter defaults
  statusFilter: 'all' as StatusFilter,
  statusOptions: ['all', 'confirmed', 'pending', 'cancelled', 'completed'] as StatusFilter[],
  
  // Date filter defaults  
  dateFilter: 'upcoming' as DateFilter,
  dateOptions: ['all', 'upcoming', 'past', 'today', 'this-week', 'this-month'] as DateFilter[],
  
  // Sort defaults
  sortOption: 'date-asc' as SortOption,
  sortOptions: [
    'date-asc', 
    'date-desc', 
    'status-priority', 
    'name-asc', 
    'name-desc', 
    'company-asc'
  ] as SortOption[]
};

// Pagination constants
export const PAGINATION_DEFAULTS = {
  // Initial page
  initialPage: 1,
  
  // Page size options (5, 10, 15, 20 as requested)
  pageSizeOptions: [5, 10, 15, 20] as const,
  
  // Device-specific default page sizes
  defaultPageSizes: {
    mobile: 5,
    tablet: 10, 
    desktop: 15
  } as Record<DeviceType, number>,
  
  // Device-specific maximum page sizes
  maxPageSizes: {
    mobile: 10,
    tablet: 20,
    desktop: 50
  } as Record<DeviceType, number>,
  
  // Pagination UI settings
  maxVisiblePages: {
    mobile: 3,
    tablet: 5,
    desktop: 7
  } as Record<DeviceType, number>
};

// Search configuration constants
export const SEARCH_CONSTANTS = {
  // Minimum search length
  minLength: 2,
  
  // Maximum search length
  maxLength: 100,
  
  // Device-specific debounce delays (ms)
  debounceDelays: {
    mobile: 400,   // Slower typing on mobile
    tablet: 300,   // Balanced
    desktop: 200   // Fast keyboard users
  } as Record<DeviceType, number>,
  
  // Search fields to include
  searchableFields: [
    'firstName',
    'lastName', 
    'email',
    'company',
    'phone',
    'interest'
  ] as const,
  
  // Special character handling
  forbiddenCharacters: ['*', '%', '?', ';', '"', "'"] as const,
  
  // Search suggestions
  maxSuggestions: {
    mobile: 3,
    tablet: 5,
    desktop: 8
  } as Record<DeviceType, number>
};

// Performance thresholds and limits
export const PERFORMANCE_CONSTANTS = {
  // Maximum results to process
  maxResults: {
    mobile: 100,
    tablet: 500,
    desktop: 2000
  } as Record<DeviceType, number>,
  
  // Past appointment limits (days, -1 = no limit)
  maxPastDays: {
    mobile: 30,
    tablet: 90,
    desktop: -1
  } as Record<DeviceType, number>,
  
  // Performance warning thresholds (ms)
  slowFilterThresholds: {
    mobile: 100,
    tablet: 150,
    desktop: 200
  } as Record<DeviceType, number>,
  
  // Memory usage warnings (MB)
  memoryWarningThresholds: {
    mobile: 50,
    tablet: 100,
    desktop: 200
  } as Record<DeviceType, number>,
  
  // Batch processing sizes
  batchSizes: {
    filter: {
      mobile: 25,
      tablet: 50,
      desktop: 100
    },
    export: {
      mobile: 50,
      tablet: 200,
      desktop: 500
    },
    delete: {
      mobile: 5,
      tablet: 10,
      desktop: 20
    }
  } as Record<string, Record<DeviceType, number>>
};

// Export configuration constants
export const EXPORT_CONSTANTS = {
  // Default export format
  defaultFormat: 'csv' as ExportFormat,
  
  // Available formats
  availableFormats: ['csv', 'json', 'excel'] as ExportFormat[],
  
  // Device-specific export limits
  maxRecords: {
    mobile: 500,
    tablet: 2000,
    desktop: 10000
  } as Record<DeviceType, number>,
  
  // File size limits (MB)
  maxFileSizes: {
    mobile: 5,
    tablet: 15,
    desktop: 50
  } as Record<DeviceType, number>,
  
  // Default export options
  defaultOptions: {
    includeHeaders: true,
    includeChatSessionId: true,
    dateFormat: 'us' as const,
    scope: 'filtered-results' as const
  },
  
  // File naming
  filenameTemplate: 'appointments_{scope}_{count}_{date}_{device}.{ext}',
  
  // MIME types
  mimeTypes: {
    csv: 'text/csv',
    json: 'application/json',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  } as Record<ExportFormat, string>
};

// Status priority mapping (lower = higher priority)
export const STATUS_PRIORITY = {
  'pending': 0,    // Highest priority - needs attention
  'confirmed': 1,  // High priority - upcoming
  'completed': 2,  // Medium priority - historical success  
  'cancelled': 3   // Lowest priority - cancelled
} as Record<StatusFilter, number>;

// Status display configuration
export const STATUS_CONFIG = {
  labels: {
    'all': 'All Status',
    'pending': 'Pending',
    'confirmed': 'Confirmed', 
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  } as Record<StatusFilter, string>,
  
  colors: {
    'pending': 'yellow',
    'confirmed': 'green',
    'completed': 'blue', 
    'cancelled': 'red'
  } as Record<Exclude<StatusFilter, 'all'>, string>,
  
  icons: {
    'pending': '⏳',
    'confirmed': '✅',
    'completed': '🎉',
    'cancelled': '❌'
  } as Record<Exclude<StatusFilter, 'all'>, string>
};

// Date filter configuration
export const DATE_CONFIG = {
  labels: {
    'all': 'All Dates',
    'upcoming': 'Upcoming',
    'past': 'Past',
    'today': 'Today',
    'this-week': 'This Week',
    'this-month': 'This Month'
  } as Record<DateFilter, string>,
  
  shortcuts: {
    'today': 0,        // Days from today
    'tomorrow': 1,
    'this-week': 7,
    'next-week': 14,
    'this-month': 30
  } as Record<string, number>
};

// Sort configuration
export const SORT_CONFIG = {
  labels: {
    'date-asc': 'Date (Earliest First)',
    'date-desc': 'Date (Latest First)', 
    'status-priority': 'Status Priority',
    'name-asc': 'Name (A-Z)',
    'name-desc': 'Name (Z-A)',
    'company-asc': 'Company (A-Z)'
  } as Record<SortOption, string>,
  
  // Device-specific available options
  availableOptions: {
    mobile: ['date-asc', 'date-desc', 'status-priority', 'name-asc'],
    tablet: ['date-asc', 'date-desc', 'status-priority', 'name-asc', 'name-desc', 'company-asc'],
    desktop: ['date-asc', 'date-desc', 'status-priority', 'name-asc', 'name-desc', 'company-asc']
  } as Record<DeviceType, SortOption[]>
};

// Animation and timing constants
export const ANIMATION_CONSTANTS = {
  // Animation durations (ms)
  durations: {
    fast: {
      mobile: 150,
      tablet: 200, 
      desktop: 250
    },
    medium: {
      mobile: 250,
      tablet: 300,
      desktop: 350  
    },
    slow: {
      mobile: 350,
      tablet: 400,
      desktop: 500
    }
  } as Record<string, Record<DeviceType, number>>,
  
  // Easing functions
  easing: {
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    linear: 'linear'
  } as Record<string, string>
};

// Storage constants
export const STORAGE_CONSTANTS = {
  // localStorage keys
  keys: {
    preferences: 'bookings_preferences',
    history: 'bookings_history',
    stats: 'bookings_stats',
    cache: 'bookings_cache'
  },
  
  // Storage limits
  maxHistoryEntries: {
    mobile: 5,
    tablet: 10,
    desktop: 20
  } as Record<DeviceType, number>,
  
  // Cache settings
  cacheExpiration: 24 * 60 * 60 * 1000, // 24 hours in ms
  
  // Version for migrations
  storageVersion: '1.0.0'
};

// Error messages
export const ERROR_MESSAGES = {
  search: {
    tooShort: {
      mobile: 'Need 2+ characters',
      tablet: 'Search requires at least 2 characters',
      desktop: 'Search term must be at least 2 characters long'
    },
    tooLong: {
      mobile: 'Search too long (max 100)',
      tablet: 'Search term too long (maximum 100 characters)',  
      desktop: 'Search term too long (maximum 100 characters)'
    },
    invalidChars: {
      mobile: 'Invalid characters',
      tablet: 'Search contains invalid characters',
      desktop: 'Search term contains invalid characters (* % ? ; " \')'
    }
  } as Record<string, Record<DeviceType, string>>,
  
  filters: {
    tooManyResults: {
      mobile: 'Too many results. Try filtering.',
      tablet: 'Too many results found. Please apply more specific filters.',
      desktop: 'Too many results found. Please apply more specific filters to improve performance.'
    },
    slowPerformance: {
      mobile: 'Search is slow. Try shorter terms.',
      tablet: 'Filtering is taking longer than expected.',
      desktop: 'Filtering is taking longer than expected. Consider using more specific filters.'
    },
    noResults: {
      mobile: 'No matches found',
      tablet: 'No appointments match your filters',
      desktop: 'No appointments match your current filter criteria'
    }
  } as Record<string, Record<DeviceType, string>>,
  
  export: {
    limitExceeded: {
      mobile: 'Export limit: {limit} max',
      tablet: 'Export limit exceeded. Maximum {limit} records allowed.',
      desktop: 'Export limit exceeded. Maximum {limit} records allowed on {device}.'
    },
    sizeTooLarge: {
      mobile: 'File too large ({size}MB)',
      tablet: 'Export file too large ({size}MB). Maximum {limit}MB allowed.',
      desktop: 'Export file too large ({size}MB). Maximum {limit}MB allowed on {device}.'
    }
  } as Record<string, Record<DeviceType, string>>
};

// Quick filter presets
export const QUICK_FILTERS = {
  'pending-today': {
    name: 'Pending Today',
    criteria: {
      statusFilter: 'pending' as StatusFilter,
      dateFilter: 'today' as DateFilter,
      searchTerm: ''
    }
  },
  'overdue': {
    name: 'Overdue',
    criteria: {
      statusFilter: 'pending' as StatusFilter,
      dateFilter: 'past' as DateFilter,
      searchTerm: ''
    }
  },
  'recent-completed': {
    name: 'Recently Completed',
    criteria: {
      statusFilter: 'completed' as StatusFilter,
      dateFilter: 'this-week' as DateFilter,
      searchTerm: ''
    }
  }
} as const;

// Complete filtering defaults configuration
export const FILTERING_DEFAULTS: FilteringDefaults = {
  search: {
    minLength: SEARCH_CONSTANTS.minLength,
    maxLength: SEARCH_CONSTANTS.maxLength,
    debounceMs: SEARCH_CONSTANTS.debounceDelays
  },
  pagination: {
    defaultPageSize: PAGINATION_DEFAULTS.defaultPageSizes,
    pageSizeOptions: [...PAGINATION_DEFAULTS.pageSizeOptions],
    maxPageSize: PAGINATION_DEFAULTS.maxPageSizes
  },
  filters: {
    defaultStatus: FILTER_DEFAULTS.statusFilter,
    defaultDate: FILTER_DEFAULTS.dateFilter,
    defaultSort: FILTER_DEFAULTS.sortOption
  },
  performance: {
    maxResults: PERFORMANCE_CONSTANTS.maxResults,
    slowThresholdMs: PERFORMANCE_CONSTANTS.slowFilterThresholds
  }
};

// Default preferences by device type
export const getDefaultPreferences = (deviceType: DeviceType): FilterPreferences => ({
  searchTerm: FILTER_DEFAULTS.searchTerm,
  statusFilter: FILTER_DEFAULTS.statusFilter,
  dateFilter: FILTER_DEFAULTS.dateFilter,
  pageSize: PAGINATION_DEFAULTS.defaultPageSizes[deviceType],
  sortOption: FILTER_DEFAULTS.sortOption,
  viewMode: deviceType === 'mobile' ? 'compact' : 
            deviceType === 'tablet' ? 'standard' : 'detailed',
  autoSave: true
});

// Validation constants
export const VALIDATION_CONSTANTS = {
  // Required field validation
  requiredFields: ['firstName', 'lastName', 'email'] as const,
  
  // Email validation regex
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Phone validation regex (flexible)
  phoneRegex: /^[\+]?[\d\s\-\(\)]{10,}$/,
  
  // Date format validation
  dateFormats: {
    iso: /^\d{4}-\d{2}-\d{2}$/,
    us: /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    eu: /^\d{1,2}\/\d{1,2}\/\d{4}$/
  } as Record<string, RegExp>
};