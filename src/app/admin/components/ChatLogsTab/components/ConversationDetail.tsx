// src/app/admin/components/ChatLogsTab/components/ConversationDetail.tsx

'use client';

import { User, Bot, Activity, Crown, ArrowLeft } from 'lucide-react';
import { ConversationBox } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';
import { formatSessionId } from '../utils/formatting';

interface ConversationDetailProps {
  conversation: ConversationBox;
  onBackToConversations: () => void;
  formatTimestamp: (timestamp: string) => string;
}

export const ConversationDetail = ({
  conversation,
  onBackToConversations,
  formatTimestamp
}: ConversationDetailProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Full-screen message view with touch navigation
  const MobileConversationDetail = () => (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Mobile Header - Touch optimized */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm border-b border-slate-600/50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBackToConversations}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors rounded-full hover:bg-slate-700/50"
            style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white truncate">
              {conversation.userName}
            </h2>
            <p className="text-sm text-gray-400 truncate">
              Session: {formatSessionId(conversation.sessionId)}
            </p>
          </div>
        </div>
        
        {/* Mobile Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{conversation.messageCount} messages</span>
          <span>•</span>
          <span>{conversation.duration}</span>
          <div className="ml-auto flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span className="text-xs">--ms</span>
          </div>
        </div>
      </div>

      {/* Mobile Messages - Full screen */}
      <div className="flex-1 overflow-hidden bg-slate-900">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {conversation.messages.map((log) => (
            <div key={log.id} className="flex gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                log.messageType === 'user' ? 'bg-blue-600' : 'bg-gray-600'
              }`}>
                {log.messageType === 'user' ? 
                  <User className="w-5 h-5 text-white" /> : 
                  <Bot className="w-5 h-5 text-white" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    log.messageType === 'user' ? 'text-blue-400' : 'text-gray-300'
                  }`}>
                    {log.messageType === 'user' ? conversation.userName : 'AI Assistant'}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-4">
                  <p className="text-sm text-gray-100 whitespace-pre-wrap break-words leading-relaxed">
                    {log.content}
                  </p>
                  {log.userInfo && log.userInfo.action && (
                    <div className="mt-3 text-xs text-blue-400 bg-blue-900/20 px-3 py-2 rounded border border-blue-800/30">
                      Action: {log.userInfo.action}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Tablet: Modal overlay with gesture support
  const TabletConversationDetail = () => (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-6">
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Tablet Header */}
        <div className="p-5 border-b border-slate-600/50 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToConversations}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors p-2 rounded hover:bg-slate-700/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Conversations
              </button>
              <div className="h-4 w-px bg-slate-600"></div>
              <h3 className="text-lg font-semibold text-white">
                Conversation with {conversation.userName}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                <span>Avg. response: --ms</span>
                <Crown className="w-3 h-3" />
              </div>
              <div className="text-sm text-gray-400">
                Session: {formatSessionId(conversation.sessionId)}
              </div>
            </div>
          </div>
          
          {/* Tablet Stats Bar */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{conversation.messageCount} messages</span>
            <span>•</span>
            <span>{conversation.duration}</span>
          </div>
        </div>
        
        {/* Tablet Messages Container */}
        <div className="flex-1 overflow-hidden">
          <div className="p-5 h-full overflow-y-auto">
            <div className="space-y-4">
              {conversation.messages.map((log) => (
                <div key={log.id} className="flex gap-3 p-4 bg-slate-700/60 border border-slate-600/60 rounded-lg hover:bg-slate-600/60 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    log.messageType === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {log.messageType === 'user' ? 
                      <User className="w-4 h-4 text-white" /> : 
                      <Bot className="w-4 h-4 text-white" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        log.messageType === 'user' ? 'text-blue-400' : 'text-gray-300'
                      }`}>
                        {log.messageType === 'user' ? conversation.userName : 'AI Assistant'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-100 whitespace-pre-wrap break-words">
                      {log.content}
                    </p>
                    {log.userInfo && log.userInfo.action && (
                      <div className="mt-2 text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-800/30">
                        Action: {log.userInfo.action}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop: Panel view with full features
  const DesktopConversationDetail = () => (
    <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
      <div className="p-6 border-b border-slate-600/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToConversations}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Conversations
            </button>
            <div className="h-4 w-px bg-slate-600"></div>
            <h3 className="text-lg font-semibold text-white">
              Conversation with {conversation.userName}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            {/* Performance indicator for this conversation */}
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <Activity className="w-3 h-3" />
              <span>Avg. response: --ms</span>
              <Crown className="w-3 h-3" />
            </div>
            <div className="text-sm text-gray-400">
              Session: {formatSessionId(conversation.sessionId)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {conversation.messages.map((log) => (
            <div key={log.id} className="flex gap-3 p-4 bg-slate-700/60 border border-slate-600/60 rounded-lg hover:bg-slate-600/60 transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                log.messageType === 'user' ? 'bg-blue-600' : 'bg-gray-600'
              }`}>
                {log.messageType === 'user' ? 
                  <User className="w-4 h-4 text-white" /> : 
                  <Bot className="w-4 h-4 text-white" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    log.messageType === 'user' ? 'text-blue-400' : 'text-gray-300'
                  }`}>
                    {log.messageType === 'user' ? conversation.userName : 'AI Assistant'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-100 whitespace-pre-wrap break-words">
                  {log.content}
                </p>
                {log.userInfo && log.userInfo.action && (
                  <div className="mt-2 text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-800/30">
                    Action: {log.userInfo.action}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileConversationDetail />}
      tablet={<TabletConversationDetail />}
      desktop={<DesktopConversationDetail />}
    />
  );
};