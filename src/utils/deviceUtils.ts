// src/utils/deviceUtils.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DeviceType, BREAKPOINTS } from '@/hooks/useDeviceDetection';

// Device type detection functions
export const getDeviceType = (width: number): DeviceType => {
  if (width >= BREAKPOINTS.mobile.min && width <= BREAKPOINTS.mobile.max) {
    return 'mobile';
  } else if (width >= BREAKPOINTS.tablet.min && width <= BREAKPOINTS.tablet.max) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

export const isMobileWidth = (width: number): boolean => {
  return width >= BREAKPOINTS.mobile.min && width <= BREAKPOINTS.mobile.max;
};

export const isTabletWidth = (width: number): boolean => {
  return width >= BREAKPOINTS.tablet.min && width <= BREAKPOINTS.tablet.max;
};

export const isDesktopWidth = (width: number): boolean => {
  return width >= BREAKPOINTS.desktop.min;
};

// Touch target size utilities
export const TOUCH_TARGETS = {
  small: '32px',
  medium: '40px', 
  large: '44px',    // Apple's recommended minimum
  xlarge: '48px'
} as const;

export const getTouchTargetSize = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case 'mobile':
      return TOUCH_TARGETS.large;
    case 'tablet':
      return TOUCH_TARGETS.medium;
    case 'desktop':
      return TOUCH_TARGETS.small;
    default:
      return TOUCH_TARGETS.medium;
  }
};

// Spacing utilities per device
export const SPACING = {
  mobile: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem'      // 48px
  },
  tablet: {
    xs: '0.75rem',  // 12px
    sm: '1.25rem',  // 20px
    md: '2rem',     // 32px
    lg: '2.5rem',   // 40px
    xl: '4rem'      // 64px
  },
  desktop: {
    xs: '1rem',     // 16px
    sm: '1.5rem',   // 24px
    md: '2.5rem',   // 40px
    lg: '3rem',     // 48px
    xl: '5rem'      // 80px
  }
} as const;

export const getSpacing = (deviceType: DeviceType, size: keyof typeof SPACING.mobile): string => {
  return SPACING[deviceType][size];
};

// Container widths per device
export const CONTAINER_WIDTHS = {
  mobile: '100%',
  tablet: '90%',
  desktop: '1200px'
} as const;

export const getContainerWidth = (deviceType: DeviceType): string => {
  return CONTAINER_WIDTHS[deviceType];
};

// Grid columns per device type
export const GRID_COLUMNS = {
  mobile: 1,
  tablet: 2,
  desktop: 3
} as const;

export const getGridColumns = (deviceType: DeviceType): number => {
  return GRID_COLUMNS[deviceType];
};

// Typography scale per device
export const TYPOGRAPHY_SCALE = {
  mobile: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem'  // 36px
  },
  tablet: {
    xs: '0.875rem',   // 14px
    sm: '1rem',       // 16px
    base: '1.125rem', // 18px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    '2xl': '1.875rem', // 30px
    '3xl': '2.25rem', // 36px
    '4xl': '3rem'     // 48px
  },
  desktop: {
    xs: '1rem',       // 16px
    sm: '1.125rem',   // 18px
    base: '1.25rem',  // 20px
    lg: '1.5rem',     // 24px
    xl: '1.875rem',   // 30px
    '2xl': '2.25rem', // 36px
    '3xl': '3rem',    // 48px
    '4xl': '4rem'     // 64px
  }
} as const;

export const getFontSize = (deviceType: DeviceType, size: keyof typeof TYPOGRAPHY_SCALE.mobile): string => {
  return TYPOGRAPHY_SCALE[deviceType][size];
};

// Modal sizing per device
export const MODAL_SIZES = {
  mobile: {
    small: '100vw',
    medium: '100vw',
    large: '100vw',
    fullscreen: '100vw'
  },
  tablet: {
    small: '400px',
    medium: '600px',
    large: '800px',
    fullscreen: '90vw'
  },
  desktop: {
    small: '320px',
    medium: '480px',
    large: '640px',
    fullscreen: '80vw'
  }
} as const;

export const getModalSize = (deviceType: DeviceType, size: keyof typeof MODAL_SIZES.mobile): string => {
  return MODAL_SIZES[deviceType][size];
};

// Navigation patterns per device
export const NAVIGATION_PATTERNS = {
  mobile: 'bottom-tabs',
  tablet: 'side-drawer',
  desktop: 'horizontal-tabs'
} as const;

export const getNavigationPattern = (deviceType: DeviceType): string => {
  return NAVIGATION_PATTERNS[deviceType];
};

// Animation durations per device (mobile should be faster for better perceived performance)
export const ANIMATION_DURATIONS = {
  mobile: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms'
  },
  tablet: {
    fast: '200ms',
    normal: '300ms',
    slow: '400ms'
  },
  desktop: {
    fast: '250ms',
    normal: '350ms',
    slow: '500ms'
  }
} as const;

export const getAnimationDuration = (deviceType: DeviceType, speed: keyof typeof ANIMATION_DURATIONS.mobile): string => {
  return ANIMATION_DURATIONS[deviceType][speed];
};

// Content density utilities
export const CONTENT_DENSITY = {
  mobile: 'low',      // Fewer items per view, larger spacing
  tablet: 'medium',   // Balanced content
  desktop: 'high'     // More content, tighter spacing
} as const;

export const getContentDensity = (deviceType: DeviceType): string => {
  return CONTENT_DENSITY[deviceType];
};

// Items per page for pagination
export const ITEMS_PER_PAGE = {
  mobile: 5,
  tablet: 8,
  desktop: 10
} as const;

export const getItemsPerPage = (deviceType: DeviceType): number => {
  return ITEMS_PER_PAGE[deviceType];
};

// Card layouts per device
export const CARD_LAYOUTS = {
  mobile: 'vertical',    // Single column, vertical cards
  tablet: 'mixed',       // 2-column grid, medium cards
  desktop: 'horizontal'  // Multi-column, horizontal cards
} as const;

export const getCardLayout = (deviceType: DeviceType): string => {
  return CARD_LAYOUTS[deviceType];
};

// Form field sizing
export const FORM_FIELD_HEIGHTS = {
  mobile: '48px',
  tablet: '44px',
  desktop: '40px'
} as const;

export const getFormFieldHeight = (deviceType: DeviceType): string => {
  return FORM_FIELD_HEIGHTS[deviceType];
};

// Utility function to generate responsive classes based on device
export const getResponsiveClasses = (deviceType: DeviceType, baseClasses: string): string => {
  const devicePrefix = deviceType === 'mobile' ? 'mobile' : 
                      deviceType === 'tablet' ? 'tablet' : 'desktop';
  
  return `${baseClasses} ${devicePrefix}:optimized`;
};

// Debounce utility for resize events
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};