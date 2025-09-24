// src/hooks/useDeviceDetection.ts

import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  orientation: 'portrait' | 'landscape';
}

// Breakpoint constants
export const BREAKPOINTS = {
  mobile: { min: 320, max: 767 },
  tablet: { min: 768, max: 1024 },
  desktop: { min: 1025, max: Infinity }
} as const;

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // Server-side rendering safe defaults
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        orientation: 'landscape'
      };
    }

    // Initial client-side detection
    return getDeviceInfo();
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(() => {
        setDeviceInfo(getDeviceInfo());
      }, 100);
    };

    // Set initial values
    setDeviceInfo(getDeviceInfo());

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
};

// Helper function to determine device info
function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return {
      type: 'desktop',
      width: 1024,
      height: 768,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      orientation: 'landscape'
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Determine device type based on width
  let type: DeviceType = 'desktop';
  if (width >= BREAKPOINTS.mobile.min && width <= BREAKPOINTS.mobile.max) {
    type = 'mobile';
  } else if (width >= BREAKPOINTS.tablet.min && width <= BREAKPOINTS.tablet.max) {
    type = 'tablet';
  } else {
    type = 'desktop';
  }

  // Touch device detection
  const isTouchDevice = (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - legacy support
    navigator.msMaxTouchPoints > 0
  );

  // Orientation detection
  const orientation: 'portrait' | 'landscape' = width > height ? 'landscape' : 'portrait';

  return {
    type,
    width,
    height,
    isMobile: type === 'mobile',
    isTablet: type === 'tablet',
    isDesktop: type === 'desktop',
    isTouchDevice,
    orientation
  };
}

// Additional utility hooks for common use cases
export const useIsMobile = (): boolean => {
  const { isMobile } = useDeviceDetection();
  return isMobile;
};

export const useIsTablet = (): boolean => {
  const { isTablet } = useDeviceDetection();
  return isTablet;
};

export const useIsDesktop = (): boolean => {
  const { isDesktop } = useDeviceDetection();
  return isDesktop;
};

export const useIsTouchDevice = (): boolean => {
  const { isTouchDevice } = useDeviceDetection();
  return isTouchDevice;
};

// Hook for checking specific breakpoints
export const useBreakpoint = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
  const { width } = useDeviceDetection();
  return width >= BREAKPOINTS[breakpoint].min && width <= BREAKPOINTS[breakpoint].max;
};