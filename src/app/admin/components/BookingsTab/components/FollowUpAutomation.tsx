// src/app/admin/components/BookingsTab/components/FollowUpAutomation.tsx

'use client';

import { Bell } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

export const FollowUpAutomation = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Simplified list view with touch actions
  const MobileFollowUpAutomation = () => (
    <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
      {/* Mobile Premium Overlay */}
      <div className="absolute inset-0 bg-gray-50/90 flex items-center justify-center z-10">
        <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg mx-4">
          <Bell className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-700 mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-4 text-sm">Automated follow-up sequences and reminders available in the full version</p>
          <span 
            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium inline-block"
            style={{ minHeight: touchTargetSize }}
          >
            Coming Soon
          </span>
        </div>
      </div>
      
      <div className="p-4">
        {/* Mobile Header */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-white">Follow-up Automation</h3>
          <p className="text-gray-300 text-sm mt-1">Automated email sequences</p>
        </div>

        {/* Mobile Create Button */}
        <button 
          className="w-full bg-green-600 text-white px-4 py-3 rounded-lg text-base font-medium mb-4"
          style={{ minHeight: touchTargetSize }}
        >
          Create Sequence
        </button>

        {/* Mobile Active Sequences - Simplified Cards */}
        <div className="space-y-3">
          {/* Discovery Call Follow-up Card */}
          <div className="bg-white/10 border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-white text-base mb-1">Discovery Call Follow-up</h4>
                <p className="text-sm text-gray-400">-- active contacts</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium ml-3">Active</span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Emails sent:</span>
                <span>-- this week</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Open rate:</span>
                <span>--.%</span>
              </div>
            </div>
            
            <button 
              className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium bg-blue-900/20 rounded px-3 py-2"
              style={{ minHeight: touchTargetSize }}
            >
              View Details
            </button>
          </div>

          {/* No-show Re-engagement Card */}
          <div className="bg-white/10 border border-gray-600/50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-white text-base mb-1">No-show Re-engagement</h4>
                <p className="text-sm text-gray-400">-- contacts in sequence</p>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium ml-3">Paused</span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Emails sent:</span>
                <span>-- this week</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Response rate:</span>
                <span>--.%</span>
              </div>
            </div>
            
            <button 
              className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium bg-blue-900/20 rounded px-3 py-2"
              style={{ minHeight: touchTargetSize }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Tablet: Card-based layout
  const TabletFollowUpAutomation = () => (
    <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
      {/* Tablet Premium Overlay */}
      <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-4 max-w-md">Automated follow-up sequences and reminders available in the full version</p>
          <span 
            className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            style={{ minHeight: touchTargetSize }}
          >
            Coming Soon
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {/* Tablet Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Follow-up Automation</h3>
            <p className="text-gray-300 mt-1">Automated email sequences and reminders</p>
          </div>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            style={{ minHeight: touchTargetSize }}
          >
            Create Sequence
          </button>
        </div>

        {/* Tablet Active Sequences - Two Column Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Discovery Call Follow-up Card */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white">Discovery Call Follow-up</h4>
                <p className="text-sm text-gray-400">-- active contacts in sequence</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span>
                <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Emails sent this week:</span>
                <span>--</span>
              </div>
              <div className="flex justify-between">
                <span>Reminders scheduled:</span>
                <span>--</span>
              </div>
              <div className="flex justify-between">
                <span>Open rate:</span>
                <span>--.%</span>
              </div>
            </div>
          </div>
          
          {/* No-show Re-engagement Card */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white/5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-white">No-show Re-engagement</h4>
                <p className="text-sm text-gray-400">-- contacts in sequence</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Paused</span>
                <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Emails sent this week:</span>
                <span>--</span>
              </div>
              <div className="flex justify-between">
                <span>Reminders scheduled:</span>
                <span>--</span>
              </div>
              <div className="flex justify-between">
                <span>Response rate:</span>
                <span>--.%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop: Full detailed layout (original design)
  const DesktopFollowUpAutomation = () => (
    <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
      <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-4 max-w-md">Automated follow-up sequences and reminders available in the full version</p>
          <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white">Follow-up Automation</h3>
            <p className="text-gray-300 mt-1">Automated email sequences and reminders</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Create Sequence
          </button>
        </div>

        {/* Active Sequences */}
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">Discovery Call Follow-up</h4>
                <p className="text-sm text-gray-600">-- active contacts in sequence</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Active</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>-- emails sent this week</span>
              <span>-- reminders scheduled</span>
              <span>--.% open rate</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">No-show Re-engagement</h4>
                <p className="text-sm text-gray-600">-- contacts in sequence</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Paused</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>-- emails sent this week</span>
              <span>-- reminders scheduled</span>
              <span>--.% response rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Return the responsive wrapper with device-specific components
  return (
    <ResponsiveWrapper
      mobile={<MobileFollowUpAutomation />}
      tablet={<TabletFollowUpAutomation />}
      desktop={<DesktopFollowUpAutomation />}
    />
  );
};