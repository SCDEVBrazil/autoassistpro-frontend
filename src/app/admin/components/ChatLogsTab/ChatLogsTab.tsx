// src/app/admin/components/ChatLogsTab/ChatLogsTab.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { MessageSquare, Users, Search, ChevronLeft, User, Bot, Trash2, ArrowLeft } from 'lucide-react';
import { ChatLog, ChatSession } from '../../types';
import { useState } from 'react';

// Hooks
import { useConversationProcessing } from './hooks/useConversationProcessing';
import { useConversationActions } from './hooks/useConversationActions';
import { useConversationFiltering } from './hooks/useConversationFiltering';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

// Components
import { PerformanceWidget } from './components/PerformanceWidget';
import { ConversationGrid } from './components/ConversationGrid';
import { ConversationDetail } from './components/ConversationDetail';
import { AdvancedChatFeatures } from './components/AdvancedChatFeatures';
import { LeadManagement } from './components/LeadManagement';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';

// Utils
import { formatTimestamp } from './utils/formatting';

interface ChatLogsTabProps {
  chatLogs: ChatLog[];
  chatSessions: ChatSession[];
  isLoading: boolean;
  selectedSession: string | null;
  onRefresh: () => void;
  onSelectSession: (sessionId: string | null) => void;
  onViewAppointment?: (appointmentId: number) => void;
  onDeleteConversation?: (sessionId: string) => void;
}

export const ChatLogsTab = ({
  chatLogs,
  chatSessions,
  isLoading,
  selectedSession,
  onRefresh,
  onSelectSession,
  onViewAppointment,
  onDeleteConversation
}: ChatLogsTabProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Custom hooks - Fixed to handle new useConversationProcessing return structure
  const { conversations } = useConversationProcessing(chatLogs);
  const { searchTerm, filteredConversations, setSearchTerm, clearSearch } = useConversationFiltering(conversations);
  const {
    selectedConversation,
    showDeleteConfirmation,
    handleConversationClick,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    handleBackToConversations
  } = useConversationActions({
    selectedSession,
    onSelectSession,
    onDeleteConversation,
    onViewAppointment
  });

  const selectedConversationData = conversations.find((conv: any) => conv.sessionId === selectedConversation);

  // Mobile: Single conversation list with drill-down
  const MobileChatLogsTab = () => {
    const [showConversationDetail, setShowConversationDetail] = useState(false);

    const handleMobileConversationClick = (sessionId: string) => {
      handleConversationClick(sessionId);
      setShowConversationDetail(true);
    };

    const handleMobileBackToList = () => {
      setShowConversationDetail(false);
      handleBackToConversations();
    };

    if (showConversationDetail && selectedConversationData) {
      return (
        <div className="space-y-4">
          {/* Mobile Conversation Detail */}
          <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
            {/* Mobile Detail Header */}
            <div className="p-4 border-b border-slate-600/50">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={handleMobileBackToList}
                  className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                  style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-white flex-1">
                  {selectedConversationData.userName}
                </h3>
              </div>
              <div className="text-sm text-gray-400">
                {selectedConversationData.messageCount} messages • {selectedConversationData.duration}
              </div>
            </div>

            {/* Mobile Messages */}
            <div className="p-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedConversationData.messages.map((log: any) => (
                  <div key={log.id} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      log.messageType === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {log.messageType === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="bg-slate-700/60 rounded-lg p-3">
                        <p className="text-sm text-gray-100 whitespace-pre-wrap">{log.content}</p>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Mobile Main Chat Logs Section */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-600/50">
            <h2 className="text-lg font-semibold text-white">Customer Conversations</h2>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Users className="w-4 h-4" />
              <span>{conversations.length} conversations</span>
            </div>
          </div>

          {/* Mobile Search Control */}
          <div className="p-4 border-b border-slate-600/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-3 bg-slate-600/80 border border-slate-500/60 rounded-lg focus:border-blue-400 focus:outline-none text-gray-100 placeholder-gray-400"
                style={{ minHeight: touchTargetSize }}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Mobile Performance Widget */}
          <div className="p-4 border-b border-slate-600/50">
            <PerformanceWidget />
          </div>

          {/* Mobile Conversations List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">Loading conversations...</div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {searchTerm ? 'No conversations match your search.' : 'No conversations found.'}
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {filteredConversations.map((conversation: any) => (
                <div key={conversation.sessionId} className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-4 hover:bg-slate-600/60 transition-colors">
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => handleMobileConversationClick(conversation.sessionId)}
                      className="flex-1 text-left"
                      style={{ minHeight: touchTargetSize }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{conversation.userName}</h3>
                          <div className="text-sm text-gray-400">
                            {conversation.messageCount} messages • {conversation.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">{conversation.firstMessage}</p>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(e, conversation.sessionId);
                      }}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Premium Features */}
        <AdvancedChatFeatures />
        <LeadManagement />
      </div>
    );
  };

  // Tablet: Two-panel layout (list + detail)
  const TabletChatLogsTab = () => (
    <div className="space-y-6">
      {/* Tablet Main Chat Logs Section */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="p-6 border-b border-slate-600/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Customer Conversations</h2>
              <p className="text-gray-300 mt-1">View and manage chat conversations by customer</p>
            </div>
            <div className="flex items-center gap-4">
              <PerformanceWidget />
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Users className="w-4 h-4" />
                <span>{conversations.length} conversations</span>
              </div>
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

          {/* Tablet Search Control */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, message, or session ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-600/80 border border-slate-500/60 rounded-lg focus:border-blue-400 focus:outline-none text-sm text-gray-100 placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Tablet Conversations Grid */}
        <div className="p-6">
          <ConversationGrid
            conversations={filteredConversations}
            isLoading={isLoading}
            searchTerm={searchTerm}
            selectedConversation={selectedConversation}
            onConversationClick={handleConversationClick}
            onDeleteClick={handleDeleteClick}
            onViewAppointment={onViewAppointment}
            onClearSearch={clearSearch}
            formatTimestamp={formatTimestamp}
          />
        </div>
      </div>

      {/* Tablet Selected Conversation Messages */}
      {selectedConversationData && (
        <ConversationDetail
          conversation={selectedConversationData}
          onBackToConversations={handleBackToConversations}
          formatTimestamp={formatTimestamp}
        />
      )}

      {/* Tablet Premium Feature Sections */}
      <AdvancedChatFeatures />
      <LeadManagement />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );

  // Desktop: Three-panel layout (filters + list + detail) - Original Design
  const DesktopChatLogsTab = () => (
    <div className="space-y-6">
      {/* Desktop Main Chat Logs Section */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="p-6 border-b border-slate-600/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Customer Conversations</h2>
              <p className="text-gray-300 mt-1">View and manage chat conversations by customer</p>
            </div>
            <div className="flex items-center gap-4">
              <PerformanceWidget />
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Users className="w-4 h-4" />
                <span>{conversations.length} conversations</span>
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

          {/* Desktop Search Control */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, message, or session ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-600/80 border border-slate-500/60 rounded-lg focus:border-blue-400 focus:outline-none text-sm text-gray-100 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Desktop Conversations Grid */}
        <div className="p-6">
          <ConversationGrid
            conversations={filteredConversations}
            isLoading={isLoading}
            searchTerm={searchTerm}
            selectedConversation={selectedConversation}
            onConversationClick={handleConversationClick}
            onDeleteClick={handleDeleteClick}
            onViewAppointment={onViewAppointment}
            onClearSearch={clearSearch}
            formatTimestamp={formatTimestamp}
          />
        </div>
      </div>

      {/* Desktop Selected Conversation Messages */}
      {selectedConversationData && (
        <ConversationDetail
          conversation={selectedConversationData}
          onBackToConversations={handleBackToConversations}
          formatTimestamp={formatTimestamp}
        />
      )}

      {/* Desktop Premium Feature Sections */}
      <AdvancedChatFeatures />
      <LeadManagement />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileChatLogsTab />}
      tablet={<TabletChatLogsTab />}
      desktop={<DesktopChatLogsTab />}
    />
  );
};