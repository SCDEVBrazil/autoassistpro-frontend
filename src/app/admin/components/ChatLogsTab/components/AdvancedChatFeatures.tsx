// src/app/admin/components/ChatLogsTab/components/AdvancedChatFeatures.tsx

'use client';

import { Zap, Crown, Users } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

export const AdvancedChatFeatures = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Vertical stack with simplified previews
  const MobileAdvancedChatFeatures = () => (
    <>
      {/* Advanced Chat Features - Premium Features Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Advanced Chat Features</h3>
            <p className="text-emerald-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>

      {/* Mobile: Single column with simplified cards */}
      <div className="space-y-4">
        {/* File Upload & Sharing */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <Crown className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Premium Feature</h4>
              <p className="text-gray-600 text-xs mb-3">File upload and sharing available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-white">File Upload & Sharing</h4>
            </div>
            <p className="text-gray-300 text-xs mb-3">Allow customers to share documents and files during conversations.</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">File Types</span>
                <span className="font-medium text-blue-400">PDF, DOC, JPG</span>
              </div>
            </div>
          </div>
        </div>

        {/* Human Agent Escalation */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <Crown className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Premium Feature</h4>
              <p className="text-gray-600 text-xs mb-3">Agent escalation available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-600/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">Human Agent Escalation</h4>
            </div>
            <p className="text-gray-300 text-xs mb-3">Transfer complex conversations to human agents.</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Active Agents</span>
                <span className="font-medium text-orange-400">-- online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proactive Chat Triggers */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <Crown className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Premium Feature</h4>
              <p className="text-gray-600 text-xs mb-3">Proactive triggers available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-600/20 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">Proactive Chat Triggers</h4>
            </div>
            <p className="text-gray-300 text-xs mb-3">Automatically initiate conversations based on user behavior.</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Active Rules</span>
                <span className="font-medium text-purple-400">-- rules</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Language Support */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <Crown className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Premium Feature</h4>
              <p className="text-gray-600 text-xs mb-3">Multi-language support available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-white">Multi-Language Support</h4>
            </div>
            <p className="text-gray-300 text-xs mb-3">Real-time translation and localized responses.</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Languages</span>
                <span className="font-medium text-green-400">-- supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Tablet: Two-column layout
  const TabletAdvancedChatFeatures = () => (
    <>
      {/* Advanced Chat Features - Premium Features Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Advanced Chat Features</h3>
            <p className="text-emerald-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>

      {/* Tablet: Two-column grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* File Upload & Sharing */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <Crown className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <h4 className="text-base font-semibold text-gray-700 mb-2">Premium Feature</h4>
              <p className="text-gray-600 text-sm mb-3">File upload and sharing available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-white">File Upload & Sharing</h4>
            </div>
            <p className="text-gray-300 text-sm mb-3">Allow customers to share documents, images, and files during conversations.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Supported Formats</span>
                <span className="font-medium text-blue-400">PDF, DOC, JPG, PNG</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Max File Size</span>
                <span className="font-medium text-blue-400">-- MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Human Agent Escalation */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <Crown className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <h4 className="text-base font-semibold text-gray-700 mb-2">Premium Feature</h4>
              <p className="text-gray-600 text-sm mb-3">Agent escalation available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-600/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className="text-base font-semibold text-white">Human Agent Escalation</h4>
            </div>
            <p className="text-gray-300 text-sm mb-3">Seamlessly transfer complex conversations from AI to human agents.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Agents</span>
                <span className="font-medium text-orange-400">-- online</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Escalations Today</span>
                <span className="font-medium text-orange-400">-- transfers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proactive Chat Triggers */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <Crown className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <h4 className="text-base font-semibold text-gray-700 mb-2">Premium Feature</h4>
              <p className="text-gray-600 text-sm mb-3">Proactive triggers available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-base font-semibold text-white">Proactive Chat Triggers</h4>
            </div>
            <p className="text-gray-300 text-sm mb-3">Automatically initiate conversations based on user behavior and engagement patterns.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Triggers</span>
                <span className="font-medium text-purple-400">-- rules</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Triggered Today</span>
                <span className="font-medium text-purple-400">-- chats</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Language Support */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg">
              <Crown className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <h4 className="text-base font-semibold text-gray-700 mb-2">Premium Feature</h4>
              <p className="text-gray-600 text-sm mb-3">Multi-language support available in full version</p>
              <span className="bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h4 className="text-base font-semibold text-white">Multi-Language Support</h4>
            </div>
            <p className="text-gray-300 text-sm mb-3">Real-time translation and localized response capabilities.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Languages Supported</span>
                <span className="font-medium text-green-400">-- languages</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Translations Today</span>
                <span className="font-medium text-green-400">-- messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Desktop: Four-column layout
  const DesktopAdvancedChatFeatures = () => (
    <>
      {/* Advanced Chat Features - Premium Features Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Advanced Chat Features</h3>
            <p className="text-emerald-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>

      {/* Desktop: Four-column grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* File Upload & Sharing */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <Crown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4 max-w-md">File upload and sharing capabilities available in the full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">File Upload & Sharing</h3>
            </div>
            <p className="text-gray-300 mb-4">Allow customers to share documents, images, and files during chat conversations for better support.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Supported Formats</span>
                <span className="font-medium text-blue-400">PDF, DOC, JPG, PNG</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Max File Size</span>
                <span className="font-medium text-blue-400">-- MB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Files Shared Today</span>
                <span className="font-medium text-blue-400">-- files</span>
              </div>
            </div>
          </div>
        </div>

        {/* Human Agent Escalation */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <Crown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4 max-w-md">Human agent escalation system available in the full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-600/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Human Agent Escalation</h3>
            </div>
            <p className="text-gray-300 mb-4">Seamlessly transfer complex conversations from AI to human agents when specialized help is needed.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Agents</span>
                <span className="font-medium text-orange-400">-- online</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Escalations Today</span>
                <span className="font-medium text-orange-400">-- transfers</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. Response Time</span>
                <span className="font-medium text-orange-400">-- min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proactive Chat Triggers */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <Crown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4 max-w-md">Proactive chat triggers and automation available in the full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Proactive Chat Triggers</h3>
            </div>
            <p className="text-gray-300 mb-4">Automatically initiate conversations based on user behavior, time on page, and engagement patterns.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Active Triggers</span>
                <span className="font-medium text-purple-400">-- rules</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Triggered Today</span>
                <span className="font-medium text-purple-400">-- chats</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Conversion Rate</span>
                <span className="font-medium text-purple-400">--.-%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Language Support */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
              <Crown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
              <p className="text-gray-600 mb-4 max-w-md">Multi-language support and translation available in the full version</p>
              <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Multi-Language Support</h3>
            </div>
            <p className="text-gray-300 mb-4">Real-time translation and localized response capabilities for global customer support.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Languages Supported</span>
                <span className="font-medium text-green-400">-- languages</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Translations Today</span>
                <span className="font-medium text-green-400">-- messages</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Detection Accuracy</span>
                <span className="font-medium text-green-400">--.-%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileAdvancedChatFeatures />}
      tablet={<TabletAdvancedChatFeatures />}
      desktop={<DesktopAdvancedChatFeatures />}
    />
  );
};