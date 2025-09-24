// src/app/admin/components/BookingsTab/components/BookingsHeader.tsx

'use client';

import { Activity, CheckCircle, Clock, Crown } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface BookingsHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export const BookingsHeader = ({ isLoading, onRefresh }: BookingsHeaderProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Simplified header with essential actions
  const MobileBookingsHeader = () => (
    <div className="space-y-4">
      {/* Mobile Title Section */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white">Discovery Calls</h2>
        <p className="text-gray-300 text-sm mt-1">Manage appointments</p>
      </div>
      
      {/* Mobile Actions */}
      <div className="flex flex-col gap-3">
        {/* Mobile Refresh Button - Full Width */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-base flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ minHeight: touchTargetSize }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>

        {/* Mobile Performance Widget - Simplified */}
        <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300 font-medium">Booking System</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <CheckCircle className="w-3 h-3" />
              <span>Online</span>
            </div>
          </div>
          
          <button 
            className="w-full text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors bg-blue-900/20 rounded px-3 py-2 flex items-center justify-center gap-1"
            title="Premium feature - View detailed booking analytics"
            style={{ minHeight: touchTargetSize }}
          >
            <Crown className="w-3 h-3" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );

  // Tablet: Condensed header
  const TabletBookingsHeader = () => (
    <div className="flex items-center justify-between">
      {/* Tablet Title Section */}
      <div>
        <h2 className="text-xl font-semibold text-white">Scheduled Discovery Calls</h2>
        <p className="text-gray-300 mt-1">Manage your appointments</p>
      </div>

      {/* Tablet Actions - Horizontal Layout */}
      <div className="flex items-center gap-3">
        {/* Tablet Performance Widget - Condensed */}
        <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300 font-medium">Booking API</span>
          </div>
          
          <div className="text-xs text-gray-400 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>--ms</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>--.-%</span>
            </div>
          </div>
          
          <button 
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors px-2 py-1 rounded bg-blue-900/20"
            title="Premium feature - View detailed booking analytics"
            style={{ minHeight: touchTargetSize }}
          >
            <Crown className="w-3 h-3 inline mr-1" />
            Analytics
          </button>
        </div>

        {/* Tablet Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
          style={{ minHeight: touchTargetSize }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );

  // Desktop: Full header with performance widgets (original design)
  const DesktopBookingsHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Scheduled Discovery Calls</h2>
        <p className="text-gray-300 mt-1">Manage your upcoming appointments</p>
      </div>
      <div className="flex items-center gap-4">
        {/* Desktop Booking System Performance Widget - Full Version */}
        <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300 font-medium">Booking API</span>
          </div>
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>--ms</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3" />
              <span>--.-%</span>
            </div>
          </div>
          <button 
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            title="Premium feature - View detailed booking analytics"
          >
            <Crown className="w-3 h-3 inline mr-1" />
            Analytics
          </button>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );

  // Return the responsive wrapper with device-specific components
  return (
    <ResponsiveWrapper
      mobile={<MobileBookingsHeader />}
      tablet={<TabletBookingsHeader />}
      desktop={<DesktopBookingsHeader />}
    />
  );
};