// src/app/admin/components/SettingsTab.tsx - Chunk 1: Mobile Component & Base Structure

'use client';

import { Save, Crown, Activity, Bell, Server, AlertTriangle } from 'lucide-react';
import { AppointmentSettings } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFormFieldHeight } from '@/utils/deviceUtils';

interface SettingsTabProps {
  appointmentSettings: AppointmentSettings;
  isLoading: boolean;
  onUpdateSettings: (field: keyof AppointmentSettings, value: number) => void;
  onSaveSettings: () => void;
}

export const SettingsTab = ({
  appointmentSettings,
  isLoading,
  onUpdateSettings,
  onSaveSettings
}: SettingsTabProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);
  const fieldHeight = getFormFieldHeight(deviceType);

  // Mobile: Accordion-style sections with large form controls
  const MobileSettingsTab = () => (
    <div className="space-y-6 pb-6">
      {/* Mobile Appointment Settings */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Appointment Settings</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400 text-lg">Loading settings...</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mobile Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Appointment Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={appointmentSettings.duration}
                    onChange={(e) => onUpdateSettings('duration', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-600/80 border-2 border-slate-500/60 rounded-lg px-4 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-lg"
                    style={{ height: fieldHeight }}
                    min="15"
                    max="180"
                  />
                </div>
                
                <div>
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Buffer Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={appointmentSettings.bufferTime}
                    onChange={(e) => onUpdateSettings('bufferTime', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-600/80 border-2 border-slate-500/60 rounded-lg px-4 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-lg"
                    style={{ height: fieldHeight }}
                    min="0"
                    max="60"
                  />
                </div>
                
                <div>
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Minimum Advance Notice (hours)
                  </label>
                  <input
                    type="number"
                    value={appointmentSettings.advanceNotice}
                    onChange={(e) => onUpdateSettings('advanceNotice', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-600/80 border-2 border-slate-500/60 rounded-lg px-4 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-lg"
                    style={{ height: fieldHeight }}
                    min="1"
                    max="168"
                  />
                </div>
                
                <div>
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Max Booking Window (days)
                  </label>
                  <input
                    type="number"
                    value={appointmentSettings.maxBookingWindow}
                    onChange={(e) => onUpdateSettings('maxBookingWindow', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-600/80 border-2 border-slate-500/60 rounded-lg px-4 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-lg"
                    style={{ height: fieldHeight }}
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              {/* Mobile Save Button */}
              <button
                onClick={onSaveSettings}
                disabled={isLoading}
                className={`w-full rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                  isLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white active:scale-95'
                }`}
                style={{ height: fieldHeight }}
              >
                <Save className="w-5 h-5" />
                {isLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Performance & Monitoring - Premium Feature */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Performance & Monitoring</h3>
            <p className="text-cyan-100 text-sm">Premium Features Available</p>
          </div>
        </div>
      </div>

      {/* Mobile Monitoring Configuration - Premium Preview */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
        <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg max-w-sm mx-4">
            <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Premium Feature</h3>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Advanced monitoring configuration and alerting settings available in full version.
            </p>
            <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center">
              <Server className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Monitoring Configuration</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Configure system monitoring, alerts, and performance thresholds to ensure optimal operation.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Response Time Alerts</h4>
                <p className="text-sm text-gray-400">Get notified when response times exceed thresholds</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Error Rate Monitoring</h4>
                <p className="text-sm text-gray-400">Track and alert on system error rates</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Uptime Monitoring</h4>
                <p className="text-sm text-gray-400">Monitor service availability and uptime</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // src/app/admin/components/SettingsTab.tsx - Chunk 2: Tablet Component

  // Tablet: Two-column form layout
  const TabletSettingsTab = () => (
    <div className="space-y-8">
      {/* Tablet Appointment Settings */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-slate-600/50">
        <h2 className="text-xl font-semibold text-white mb-6">Appointment Settings</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading settings...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Appointment Duration (minutes)</label>
                <input
                  type="number"
                  value={appointmentSettings.duration}
                  onChange={(e) => onUpdateSettings('duration', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
                  min="15"
                  max="180"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Buffer Time (minutes)</label>
                <input
                  type="number"
                  value={appointmentSettings.bufferTime}
                  onChange={(e) => onUpdateSettings('bufferTime', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
                  min="0"
                  max="60"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Advance Notice (hours)</label>
                <input
                  type="number"
                  value={appointmentSettings.advanceNotice}
                  onChange={(e) => onUpdateSettings('advanceNotice', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
                  min="1"
                  max="168"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Booking Window (days)</label>
                <input
                  type="number"
                  value={appointmentSettings.maxBookingWindow}
                  onChange={(e) => onUpdateSettings('maxBookingWindow', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
                  min="1"
                  max="365"
                />
              </div>
            </div>

            <button 
              onClick={onSaveSettings}
              disabled={isLoading}
              className={`mt-6 px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isLoading 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </>
        )}
      </div>

      {/* Tablet Performance & Monitoring Settings - Premium Feature */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Performance & Monitoring Settings</h3>
            <p className="text-cyan-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>

      {/* Tablet Monitoring Configuration - Premium Preview */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
        <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-8 text-center shadow-lg max-w-md">
            <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Premium Feature</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Advanced monitoring configuration and alerting settings will be available in the full version 
              after your 90-day proof-of-concept period.
            </p>
            <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center">
              <Server className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Monitoring Configuration</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Configure system monitoring, alerts, and performance thresholds to ensure optimal operation 
            of your AutoAssistPro instance.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Response Time Alerts</h4>
                <p className="text-sm text-gray-400">Get notified when response times exceed thresholds</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Error Rate Monitoring</h4>
                <p className="text-sm text-gray-400">Track and alert on system error rates and failures</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Uptime Monitoring</h4>
                <p className="text-sm text-gray-400">Monitor service availability and system uptime</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Performance Metrics</h4>
                <p className="text-sm text-gray-400">Collect and analyze system performance data</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Custom Alerts</h4>
                <p className="text-sm text-gray-400">Configure custom alerting rules and thresholds</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // src/app/admin/components/SettingsTab.tsx - Chunk 3: Desktop Component & Complete Export

  // Desktop: Multi-column layout with advanced controls (original design)
  const DesktopSettingsTab = () => (
    <div className="space-y-8">
      {/* Desktop Existing Appointment Settings */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-slate-600/50">
        <h2 className="text-xl font-semibold text-white mb-6">Appointment Settings</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading settings...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Appointment Duration (minutes)</label>
                <input
                  type="number"
                  value={appointmentSettings.duration}
                  onChange={(e) => onUpdateSettings('duration', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
                  min="15"
                  max="180"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Buffer Time (minutes)</label>
                <input
                  type="number"
                  value={appointmentSettings.bufferTime}
                  onChange={(e) => onUpdateSettings('bufferTime', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
                  min="0"
                  max="60"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Advance Notice (hours)</label>
                <input
                  type="number"
                  value={appointmentSettings.advanceNotice}
                  onChange={(e) => onUpdateSettings('advanceNotice', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
                  min="1"
                  max="168"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Booking Window (days)</label>
                <input
                  type="number"
                  value={appointmentSettings.maxBookingWindow}
                  onChange={(e) => onUpdateSettings('maxBookingWindow', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
                  min="1"
                  max="365"
                />
              </div>
            </div>

            <button 
              onClick={onSaveSettings}
              disabled={isLoading}
              className={`mt-6 px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isLoading 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </>
        )}
      </div>

      {/* Desktop Performance & Monitoring Settings - Premium Feature */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Performance & Monitoring Settings</h3>
            <p className="text-cyan-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>

      {/* Desktop Monitoring Configuration - Premium Preview */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
        <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-8 text-center shadow-lg max-w-md">
            <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Premium Feature</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Advanced monitoring configuration and alerting settings will be available in the full version 
              after your 90-day proof-of-concept period.
            </p>
            <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center">
              <Server className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Monitoring Configuration</h3>
          </div>
          <p className="text-gray-300 mb-4">
            Configure system monitoring, alerts, and performance thresholds to ensure optimal operation 
            of your AutoAssistPro instance.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Response Time Alerts</h4>
                <p className="text-sm text-gray-400">Get notified when response times exceed thresholds</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Error Rate Monitoring</h4>
                <p className="text-sm text-gray-400">Track and alert on system error rates and failures</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Uptime Monitoring</h4>
                <p className="text-sm text-gray-400">Monitor service availability and system uptime</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Performance Metrics</h4>
                <p className="text-sm text-gray-400">Collect and analyze system performance data</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Custom Alerts</h4>
                <p className="text-sm text-gray-400">Configure custom alerting rules and thresholds</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Email Notifications</h4>
                <p className="text-sm text-gray-400">Send alert notifications via email</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Slack Integration</h4>
                <p className="text-sm text-gray-400">Send monitoring alerts to designated Slack channels</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-700/40 border border-slate-600/40 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-200">Webhook Notifications</h4>
                <p className="text-sm text-gray-400">Send alerts to custom webhooks for integration with other tools</p>
              </div>
              <div className="relative">
                <input type="checkbox" disabled className="sr-only" />
                <div className="w-10 h-6 bg-slate-600/50 rounded-full border border-slate-500/50 cursor-not-allowed">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm transform translate-x-1 translate-y-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileSettingsTab />}
      tablet={<TabletSettingsTab />}
      desktop={<DesktopSettingsTab />}
    />
  );
};