// Enhanced PerformanceWidget.tsx
// src/app/admin/components/ChatLogsTab/components/PerformanceWidget.tsx

'use client';

import { Activity, Crown, CheckCircle, Clock } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

export const PerformanceWidget = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Simplified widget with essential metrics
  const MobilePerformanceWidget = () => (
    <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-300 font-medium">Online</span>
      </div>
      <button 
        className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors p-1"
        style={{ minHeight: touchTargetSize, minWidth: touchTargetSize }}
        title="Premium feature - View performance metrics"
      >
        <Crown className="w-3 h-3" />
      </button>
    </div>
  );

  // Tablet: Condensed widget
  const TabletPerformanceWidget = () => (
    <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-3 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-300 font-medium">System Status</span>
      </div>
      <div className="text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3" />
          <span>--ms</span>
        </div>
      </div>
      <button 
        className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
        title="Premium feature - View detailed performance metrics"
      >
        <Crown className="w-3 h-3" />
        Details
      </button>
    </div>
  );

  // Desktop: Enhanced widget with better spacing and professional layout
  const DesktopPerformanceWidget = () => (
    <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-4 flex items-center gap-6">
      {/* System Status Section */}
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-300 font-medium">System Status</span>
          <span className="text-xs text-green-400 font-semibold">Online</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-slate-600"></div>

      {/* Performance Metrics Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Response</span>
            <span className="text-xs text-white font-medium">--ms</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Uptime</span>
            <span className="text-xs text-white font-medium">--.-%</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-slate-600"></div>

      {/* Premium Details Button */}
      <button 
        className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-md bg-blue-900/20 hover:bg-blue-900/30"
        title="Premium feature - View detailed performance metrics"
      >
        <Crown className="w-3 h-3" />
        <span>Details</span>
      </button>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobilePerformanceWidget />}
      tablet={<TabletPerformanceWidget />}
      desktop={<DesktopPerformanceWidget />}
    />
  );
};