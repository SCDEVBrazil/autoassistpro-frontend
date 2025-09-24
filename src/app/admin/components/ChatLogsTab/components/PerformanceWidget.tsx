// src/app/admin/components/ChatLogsTab/components/PerformanceWidget.tsx

'use client';

import { Activity, Crown } from 'lucide-react';
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
    <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-3 flex items-center gap-3">
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
        className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
        title="Premium feature - View detailed performance metrics"
      >
        <Crown className="w-3 h-3 inline mr-1" />
        Details
      </button>
    </div>
  );

  // Desktop: Full widget with all metrics
  const DesktopPerformanceWidget = () => (
    <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-3 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-300 font-medium">System Status</span>
      </div>
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3" />
          <span>Response: --ms</span>
        </div>
      </div>
      <button 
        className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
        title="Premium feature - View detailed performance metrics"
      >
        <Crown className="w-3 h-3 inline mr-1" />
        Details
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