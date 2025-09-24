// src/components/ResponsiveWrapper.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React from 'react';
import { useDeviceDetection, DeviceType } from '@/hooks/useDeviceDetection';

interface ResponsiveWrapperProps {
  children?: React.ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ResponsiveWrapper component for conditional rendering based on device type
 * 
 * Usage examples:
 * 
 * 1. Device-specific content:
 * <ResponsiveWrapper
 *   mobile={<MobileComponent />}
 *   tablet={<TabletComponent />}
 *   desktop={<DesktopComponent />}
 * />
 * 
 * 2. With fallback for missing devices:
 * <ResponsiveWrapper
 *   mobile={<MobileComponent />}
 *   fallback={<DefaultComponent />}
 * />
 * 
 * 3. Common wrapper with device-specific children:
 * <ResponsiveWrapper className="container">
 *   <DeviceSpecificContent />
 * </ResponsiveWrapper>
 */
export const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({
  children,
  mobile,
  tablet,
  desktop,
  fallback,
  className,
  style
}) => {
  const { type } = useDeviceDetection();

  // Determine which content to render based on device type
  const getContent = (): React.ReactNode => {
    switch (type) {
      case 'mobile':
        return mobile || fallback || children;
      case 'tablet':
        return tablet || fallback || children;
      case 'desktop':
        return desktop || fallback || children;
      default:
        return fallback || children;
    }
  };

  const content = getContent();

  // If no content is provided, return null
  if (!content) {
    return null;
  }

  // If className or style is provided, wrap content in a div
  if (className || style) {
    return (
      <div className={className} style={style}>
        {content}
      </div>
    );
  }

  // Return content directly if no wrapper styling needed
  return <>{content}</>;
};

// Utility components for specific device targeting
interface DeviceSpecificProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Only renders children on mobile devices
 */
export const MobileOnly: React.FC<DeviceSpecificProps> = ({ children, className, style }) => {
  const { isMobile } = useDeviceDetection();
  
  if (!isMobile) return null;
  
  if (className || style) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  
  return <>{children}</>;
};

/**
 * Only renders children on tablet devices
 */
export const TabletOnly: React.FC<DeviceSpecificProps> = ({ children, className, style }) => {
  const { isTablet } = useDeviceDetection();
  
  if (!isTablet) return null;
  
  if (className || style) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  
  return <>{children}</>;
};

/**
 * Only renders children on desktop devices
 */
export const DesktopOnly: React.FC<DeviceSpecificProps> = ({ children, className, style }) => {
  const { isDesktop } = useDeviceDetection();
  
  if (!isDesktop) return null;
  
  if (className || style) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  
  return <>{children}</>;
};

/**
 * Renders children only on touch devices (mobile/tablet)
 */
export const TouchOnly: React.FC<DeviceSpecificProps> = ({ children, className, style }) => {
  const { isTouchDevice } = useDeviceDetection();
  
  if (!isTouchDevice) return null;
  
  if (className || style) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  
  return <>{children}</>;
};

/**
 * Renders children only on non-touch devices (desktop)
 */
export const NonTouchOnly: React.FC<DeviceSpecificProps> = ({ children, className, style }) => {
  const { isTouchDevice } = useDeviceDetection();
  
  if (isTouchDevice) return null;
  
  if (className || style) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }
  
  return <>{children}</>;
};

// Higher-order component for wrapping existing components with responsive behavior
interface WithResponsiveProps {
  mobile?: React.ComponentType<any>;
  tablet?: React.ComponentType<any>;
  desktop?: React.ComponentType<any>;
  fallback?: React.ComponentType<any>;
}

export function withResponsive<P extends object>(
  components: WithResponsiveProps
) {
  return function ResponsiveComponent(props: P) {
    const { type } = useDeviceDetection();
    
    let Component: React.ComponentType<P> | undefined;
    
    switch (type) {
      case 'mobile':
        Component = components.mobile || components.fallback;
        break;
      case 'tablet':
        Component = components.tablet || components.fallback;
        break;
      case 'desktop':
        Component = components.desktop || components.fallback;
        break;
      default:
        Component = components.fallback;
        break;
    }
    
    if (!Component) {
      return null;
    }
    
    return <Component {...props} />;
  };
}

// Hook for device-specific styling
export const useResponsiveStyles = () => {
  const { type, isTouchDevice } = useDeviceDetection();
  
  return {
    deviceType: type,
    isTouchDevice,
    getDeviceClass: (baseClass: string) => `${baseClass} ${baseClass}--${type}`,
    getTouchClass: (baseClass: string) => isTouchDevice ? `${baseClass} ${baseClass}--touch` : baseClass,
    getResponsiveClass: (mobileClass: string, tabletClass: string, desktopClass: string) => {
      switch (type) {
        case 'mobile':
          return mobileClass;
        case 'tablet':
          return tabletClass;
        case 'desktop':
          return desktopClass;
        default:
          return desktopClass;
      }
    }
  };
};

// Type exports for consumers
export type { DeviceType, ResponsiveWrapperProps, DeviceSpecificProps, WithResponsiveProps };