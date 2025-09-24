// src/app/admin/components/AnalyticsTab.tsx - Part 1 (Mobile Implementation)

'use client';

import { BarChart3, TrendingUp, Users, MessageSquare, Calendar, Crown, Sparkles, Activity, AlertTriangle, Server, Zap, Clock } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

export const AnalyticsTab = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Vertical stack with simplified metric cards
  const MobileAnalyticsTab = () => (
    <div className="space-y-4">
      {/* Mobile Beta Notice Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Advanced Analytics</h2>
              <p className="text-orange-100 text-sm">Premium Feature</p>
            </div>
          </div>
          
          <p className="text-sm mb-4 text-orange-50 leading-relaxed">
            You&apos;re using the <strong>Beta version</strong> of AutoAssistPro. Advanced analytics will be available in the full commercial version.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <p className="text-xs text-orange-100">
              <Sparkles className="w-3 h-3 inline mr-1" />
              <strong>Coming:</strong> Comprehensive analytics, conversion tracking, and detailed reporting tools.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Analytics Cards - Single Column */}
      <div className="space-y-4">
        {/* Mobile Conversion Analytics */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-700 mb-1">Premium Feature</h3>
              <p className="text-gray-600 text-sm mb-3">Conversion analytics available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-1 rounded-lg text-xs font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-emerald-600/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-white">Conversion Analytics</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3">Track chat-to-appointment conversion rates and optimization insights.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Conversion Rate</span>
                <span className="font-medium text-emerald-400">--.-%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Appointments</span>
                <span className="font-medium text-emerald-400">-- this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Usage Patterns */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-700 mb-1">Premium Feature</h3>
              <p className="text-gray-600 text-sm mb-3">Usage patterns available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-1 rounded-lg text-xs font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-white">Usage Patterns</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3">Peak engagement hours and customer behavior patterns.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Peak Hours</span>
                <span className="font-medium text-blue-400">-- AM to -- PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. Session</span>
                <span className="font-medium text-blue-400">-- minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Response Time */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-gray-700 mb-1">Premium Feature</h3>
              <p className="text-gray-600 text-sm mb-3">Performance monitoring available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-1 rounded-lg text-xs font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-cyan-600/20 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-base font-semibold text-white">Response Time</h3>
            </div>
            <p className="text-gray-300 text-sm mb-3">Monitor chat response times and performance.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. Response</span>
                <span className="font-medium text-cyan-400">-- ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">API Uptime</span>
                <span className="font-medium text-green-400">--.-%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile System Performance */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">System Performance</h3>
            <p className="text-cyan-100 text-sm">Premium Features Available</p>
          </div>
        </div>
      </div>
    </div>
  );

  // src/app/admin/components/AnalyticsTab.tsx - Part 2 (Tablet Implementation)

  // Tablet: Two-column layout with condensed cards
  const TabletAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Tablet Beta Notice Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Advanced Analytics Dashboard</h2>
              <p className="text-orange-100">Premium Feature - Coming in Full Version</p>
            </div>
          </div>
          
          <p className="text-base mb-4 text-orange-50 leading-relaxed">
            You&apos;re currently using the <strong>Beta version</strong> of AutoAssistPro. Advanced analytics and reporting features 
            will be available in the full commercial version.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-sm text-orange-100">
              <Sparkles className="w-4 h-4 inline mr-2" />
              <strong>What&apos;s Coming:</strong> Comprehensive analytics, conversion tracking, customer journey mapping, 
              and detailed reporting tools.
            </p>
          </div>
        </div>
      </div>

      {/* Tablet Analytics Grid - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <TrendingUp className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4">Conversion analytics available in full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Conversion Analytics</h3>
            </div>
            <p className="text-gray-300 mb-4">Track chat-to-appointment conversion tracking and optimization insights.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Conversion Rate</span>
                <span className="font-medium text-emerald-400">--.-%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Appointments</span>
                <span className="font-medium text-emerald-400">-- this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4">Usage pattern analysis available in full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Usage Pattern Analysis</h3>
            </div>
            <p className="text-gray-300 mb-4">Peak engagement hours and customer behavior pattern identification.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Peak Hours</span>
                <span className="font-medium text-blue-400">-- AM to -- PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Daily Avg.</span>
                <span className="font-medium text-blue-400">-- chats</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <Clock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4">Response time analytics available in full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan-600/20 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Response Time Analytics</h3>
            </div>
            <p className="text-gray-300 mb-4">Monitor chat API response times and identify bottlenecks.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. Response</span>
                <span className="font-medium text-cyan-400">-- ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">API Uptime</span>
                <span className="font-medium text-green-400">--.-%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <BarChart3 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4">Export reports available in full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-600/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Export Reports</h3>
            </div>
            <p className="text-gray-300 mb-4">Generate comprehensive reports for management review.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Report Types</span>
                <span className="font-medium text-rose-400">-- formats</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Data Range</span>
                <span className="font-medium text-rose-400">Custom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet System Performance */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">System Performance & Monitoring</h3>
            <p className="text-cyan-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>
    </div>
  );

  // src/app/admin/components/AnalyticsTab.tsx - Part 3 (Desktop Implementation and Complete Component)

  // Desktop: Multi-column layout with full preview cards (original design)
  const DesktopAnalyticsTab = () => (
    <div className="space-y-8">
      {/* Desktop Beta Notice Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Advanced Analytics Dashboard</h2>
              <p className="text-orange-100">Premium Feature - Coming in Full Version</p>
            </div>
          </div>
          
          <p className="text-lg mb-6 text-orange-50 leading-relaxed">
            You&apos;re currently using the <strong>Beta version</strong> of AutoAssistPro. Advanced analytics and reporting features 
            will be available in the full commercial version after your 90-day proof-of-concept period.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-sm text-orange-100">
              <Sparkles className="w-4 h-4 inline mr-2" />
              <strong>What&apos;s Coming:</strong> Comprehensive analytics, conversion tracking, customer journey mapping, 
              and detailed reporting tools to optimize your customer engagement strategy.
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Analytics Grid - Three Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4 max-w-md">Conversion analytics available in the full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Conversion Analytics</h3>
            </div>
            <p className="text-gray-300 mb-4">Track chat-to-appointment conversion tracking and optimization insights.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Conversion Rate</span>
                <span className="font-medium text-emerald-400">--.-%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Conversions</span>
                <span className="font-medium text-emerald-400">-- this month</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Revenue Impact</span>
                <span className="font-medium text-emerald-400">$--,---</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4 max-w-md">Usage pattern analysis available in the full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Usage Pattern Analysis</h3>
            </div>
            <p className="text-gray-300 mb-4">Peak engagement hours and customer behavior pattern identification.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Peak Hours</span>
                <span className="font-medium text-blue-400">-- AM to -- PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Daily Average</span>
                <span className="font-medium text-blue-400">-- chats</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Bounce Rate</span>
                <span className="font-medium text-blue-400">--.-%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4 max-w-md">Content analytics available in the full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Content Analytics</h3>
            </div>
            <p className="text-gray-300 mb-4">AI-powered analysis of common questions and knowledge base optimization.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Top Questions</span>
                <span className="font-medium text-purple-400">-- topics</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Knowledge Gaps</span>
                <span className="font-medium text-purple-400">-- areas</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Satisfaction</span>
                <span className="font-medium text-purple-400">--.-%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4 max-w-md">Lead scoring available in the full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Lead Scoring & Qualification</h3>
            </div>
            <p className="text-gray-300 mb-4">Automatic lead classification and temperature tracking.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Hot Leads</span>
                <span className="font-medium text-amber-400">-- contacts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Qualification Rate</span>
                <span className="font-medium text-amber-400">--.-%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. Score</span>
                <span className="font-medium text-amber-400">-- points</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4 max-w-md">Booking analytics available in the full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Booking Analytics</h3>
            </div>
            <p className="text-gray-300 mb-4">Detailed insights into appointment scheduling patterns and booking success rates.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Monthly Bookings</span>
                <span className="font-medium text-indigo-400">-- calls</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Show-up Rate</span>
                <span className="font-medium text-indigo-400">--.-%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. Lead Time</span>
                <span className="font-medium text-indigo-400">-- days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop System Performance Section */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">System Performance & Monitoring</h3>
            <p className="text-cyan-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileAnalyticsTab />}
      tablet={<TabletAnalyticsTab />}
      desktop={<DesktopAnalyticsTab />}
    />
  );
};