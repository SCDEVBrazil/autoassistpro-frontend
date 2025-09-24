// src/app/admin/components/BookingsTab/components/CrmIntegration.tsx

'use client';

import { Database } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

export const CrmIntegration = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Vertical cards with touch actions
  const MobileCrmIntegration = () => (
    <div className="space-y-4">
      {/* Mobile Premium Features Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
        <div className="text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Database className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2">Enhanced CRM & Follow-up</h3>
          <p className="text-indigo-100 text-sm">Premium Features - Available in Full Version</p>
        </div>
      </div>

      {/* Mobile CRM Integration Dashboard */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
        {/* Mobile Premium Overlay */}
        <div className="absolute inset-0 bg-gray-50/90 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg mx-4">
            <Database className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700 mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-4 text-sm">CRM integration and follow-up automation available in the full version</p>
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
            <h3 className="text-lg font-semibold text-white">CRM Integration</h3>
            <p className="text-gray-300 text-sm mt-1">Sync with your CRM platforms</p>
          </div>

          {/* Mobile CRM Platform Cards - Single Column */}
          <div className="space-y-3">
            {/* Salesforce Card */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base">Salesforce</h4>
                    <p className="text-xs text-gray-600">-- contacts synced</p>
                  </div>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="text-sm text-gray-600 mb-2">Last sync: -- min ago</div>
              <button 
                className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium"
                style={{ minHeight: touchTargetSize }}
              >
                Configure
              </button>
            </div>

            {/* HubSpot Card */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base">HubSpot</h4>
                    <p className="text-xs text-gray-600">-- deals tracked</p>
                  </div>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="text-sm text-gray-600 mb-2">Last sync: -- min ago</div>
              <button 
                className="w-full bg-orange-600 text-white px-3 py-2 rounded text-sm font-medium"
                style={{ minHeight: touchTargetSize }}
              >
                Configure
              </button>
            </div>

            {/* Pipedrive Card */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-base">Pipedrive</h4>
                    <p className="text-xs text-gray-600">-- pipelines active</p>
                  </div>
                </div>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              </div>
              <div className="text-sm text-gray-600 mb-2">Setup required</div>
              <button 
                className="w-full bg-purple-600 text-white px-3 py-2 rounded text-sm font-medium"
                style={{ minHeight: touchTargetSize }}
              >
                Set Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tablet: Two-column layout
  const TabletCrmIntegration = () => (
    <div className="space-y-6">
      {/* Tablet Premium Features Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Enhanced CRM & Follow-up Management</h3>
            <p className="text-indigo-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>

      {/* Tablet CRM Integration Dashboard */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
        {/* Tablet Premium Overlay */}
        <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-4 max-w-md">CRM integration and follow-up automation available in the full version</p>
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
              <h3 className="text-xl font-semibold text-white">CRM Integration Center</h3>
              <p className="text-gray-300 mt-1">Sync with your favorite CRM platforms</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Connected
              </span>
              <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                style={{ minHeight: touchTargetSize }}
              >
                Manage Integrations
              </button>
            </div>
          </div>

          {/* Tablet CRM Platform Cards - Two Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Salesforce Card */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Salesforce</h4>
                    <p className="text-xs text-gray-600">-- contacts synced</p>
                  </div>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="text-sm text-gray-600">Last sync: -- min ago</div>
            </div>
            
            {/* HubSpot Card */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">HubSpot</h4>
                    <p className="text-xs text-gray-600">-- deals tracked</p>
                  </div>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="text-sm text-gray-600">Last sync: -- min ago</div>
            </div>
            
            {/* Pipedrive Card */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100 col-span-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Pipedrive</h4>
                    <p className="text-xs text-gray-600">-- pipelines active</p>
                  </div>
                </div>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              </div>
              <div className="text-sm text-gray-600">Setup required</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop: Three-column layout (original design)
  const DesktopCrmIntegration = () => (
    <div className="space-y-6">
      {/* Enhanced CRM Integration - Premium Features Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Enhanced CRM & Follow-up Management</h3>
            <p className="text-indigo-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>

      {/* CRM Integration Dashboard - Premium Preview */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
        <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-4 max-w-md">CRM integration and follow-up automation available in the full version</p>
            <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">CRM Integration Center</h3>
              <p className="text-gray-300 mt-1">Sync with your favorite CRM platforms</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Connected
              </span>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Manage Integrations
              </button>
            </div>
          </div>

          {/* CRM Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Salesforce</h4>
                    <p className="text-xs text-gray-600">-- contacts synced</p>
                  </div>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="text-sm text-gray-600">Last sync: -- min ago</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">HubSpot</h4>
                    <p className="text-xs text-gray-600">-- deals tracked</p>
                  </div>
                </div>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <div className="text-sm text-gray-600">Last sync: -- min ago</div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Pipedrive</h4>
                    <p className="text-xs text-gray-600">-- pipelines active</p>
                  </div>
                </div>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              </div>
              <div className="text-sm text-gray-600">Setup required</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Return the responsive wrapper with device-specific components
  return (
    <ResponsiveWrapper
      mobile={<MobileCrmIntegration />}
      tablet={<TabletCrmIntegration />}
      desktop={<DesktopCrmIntegration />}
    />
  );
};