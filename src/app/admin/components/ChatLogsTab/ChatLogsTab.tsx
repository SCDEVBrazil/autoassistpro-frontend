// Updated ChatLogsTab Component with Enhanced Features
// src/app/admin/components/ChatLogsTab/ChatLogsTab.tsx

'use client';

import React, { useState } from 'react';
import { MessageSquare, Users, Search, User, Bot, Trash2, ArrowLeft } from 'lucide-react';
import { ChatLog, ChatSession } from '../../types';
import { formatSessionId } from './utils/formatting';

// Hooks
import { useConversationProcessing } from './hooks/useConversationProcessing';
import { useConversationActions } from './hooks/useConversationActions';
import { useEnhancedChatLogs } from './hooks/useEnhancedChatLogs';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

// Components
import { PerformanceWidget } from './components/PerformanceWidget';
import { EnhancedChatControls } from './components/EnhancedChatControls';
import { EnhancedConversationDisplay } from './components/EnhancedConversationDisplay';
import { EnhancedPagination } from './components/EnhancedPagination';
import { ConversationModal } from './components/ConversationModal';
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

  // Process conversations
  const { conversations } = useConversationProcessing(chatLogs);
  
  // Enhanced chat logs with pagination, filtering, and view modes
  const {
    viewMode,
    setViewMode,
    conversations: paginatedConversations,
    pagination,
    goToPage,
    changePageSize,
    filters,
    setSearchTerm,
    setFilter,
    setSort,
    clearFilters,
    filteredCount
  } = useEnhancedChatLogs(conversations);

  // Conversation actions
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

  // Mobile: Single conversation list with drill-down and enhanced features
  const MobileChatLogsTab = () => {
    return (
      <div className="space-y-4">
        {/* Mobile Main Chat Logs Section */}
        <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
          {/* Mobile Header */}
          <div className="p-4 border-b border-slate-600/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Customer Conversations</h2>
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                style={{ minHeight: touchTargetSize }}
              >
                Refresh
              </button>
            </div>
            <PerformanceWidget />
          </div>

          {/* Mobile Enhanced Controls */}
          <div className="p-4 border-b border-slate-600/50">
            <EnhancedChatControls
              viewMode={viewMode}
              setViewMode={setViewMode}
              searchTerm={filters.searchTerm}
              setSearchTerm={setSearchTerm}
              filter={filters.filter}
              setFilter={setFilter}
              sort={filters.sort}
              setSort={setSort}
              totalItems={conversations.length}
              filteredCount={filteredCount}
              onClearFilters={clearFilters}
              deviceType={deviceType}
            />
          </div>

          {/* Mobile Conversations Display */}
          <div className="p-4">
            <EnhancedConversationDisplay
              viewMode={viewMode}
              conversations={paginatedConversations}
              isLoading={isLoading}
              selectedConversation={selectedConversation}
              onConversationClick={handleConversationClick}
              onDeleteClick={handleDeleteClick}
              onViewAppointment={onViewAppointment}
              formatTimestamp={formatTimestamp}
            />
          </div>

          {/* Mobile Pagination */}
          <div className="p-4 border-t border-slate-600/50">
            <EnhancedPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              onPageChange={goToPage}
              viewMode={viewMode}
              deviceType={deviceType}
            />
          </div>
        </div>

        {/* Mobile Premium Features */}
        <AdvancedChatFeatures />
        <LeadManagement />

        {/* Mobile Conversation Modal */}
        {selectedConversationData && (
          <ConversationModal
            conversation={selectedConversationData}
            isOpen={!!selectedConversationData}
            onClose={handleBackToConversations}
            onViewAppointment={onViewAppointment}
            formatTimestamp={formatTimestamp}
          />
        )}

        <DeleteConfirmationModal
          isOpen={showDeleteConfirmation}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    );
  };

  // Tablet: Enhanced two-panel layout
  const TabletChatLogsTab = () => (
    <div className="space-y-6">
      {/* Tablet Main Chat Logs Section */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="p-6 border-b border-slate-600/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Customer Conversations</h2>
              <p className="text-gray-300 mt-1">View and manage chat conversations by customer</p>
            </div>
            <div className="flex items-center gap-4">
              <PerformanceWidget />
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

          {/* Tablet Enhanced Controls */}
          <EnhancedChatControls
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchTerm={filters.searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filters.filter}
            setFilter={setFilter}
            sort={filters.sort}
            setSort={setSort}
            totalItems={conversations.length}
            filteredCount={filteredCount}
            onClearFilters={clearFilters}
            deviceType={deviceType}
          />
        </div>

        {/* Tablet Conversations Display */}
        <div className="p-6">
          <EnhancedConversationDisplay
            viewMode={viewMode}
            conversations={paginatedConversations}
            isLoading={isLoading}
            selectedConversation={selectedConversation}
            onConversationClick={handleConversationClick}
            onDeleteClick={handleDeleteClick}
            onViewAppointment={onViewAppointment}
            formatTimestamp={formatTimestamp}
          />

          {/* Tablet Pagination */}
          <EnhancedPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
            viewMode={viewMode}
            deviceType={deviceType}
          />
        </div>
      </div>

      {/* Tablet Premium Feature Sections */}
      <AdvancedChatFeatures />
      <LeadManagement />

      {/* Tablet Conversation Modal */}
      {selectedConversationData && (
        <ConversationModal
          conversation={selectedConversationData}
          isOpen={!!selectedConversationData}
          onClose={handleBackToConversations}
          onViewAppointment={onViewAppointment}
          formatTimestamp={formatTimestamp}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );

  // Desktop: Enhanced three-panel layout with full features - WITH CENTERED HEADER
  const DesktopChatLogsTab = () => (
    <div className="space-y-6">
      {/* Desktop Main Chat Logs Section */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="p-6 border-b border-slate-600/50">
          {/* CORRECTED: Centered Title Section */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white">Customer Conversations</h2>
            <p className="text-gray-300 mt-1">View and manage chat conversations by customer</p>
          </div>

          {/* CORRECTED: Centered Performance Widget and Refresh Button Row */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <PerformanceWidget />
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-6 py-2.5 rounded-lg transition-colors text-sm flex items-center gap-3 font-medium min-w-[120px] justify-center"
            >
              <svg 
                className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Desktop Enhanced Controls */}
          <EnhancedChatControls
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchTerm={filters.searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filters.filter}
            setFilter={setFilter}
            sort={filters.sort}
            setSort={setSort}
            totalItems={conversations.length}
            filteredCount={filteredCount}
            onClearFilters={clearFilters}
            deviceType={deviceType}
          />
        </div>

        {/* Desktop Conversations Display */}
        <div className="p-6">
          <EnhancedConversationDisplay
            viewMode={viewMode}
            conversations={paginatedConversations}
            isLoading={isLoading}
            selectedConversation={selectedConversation}
            onConversationClick={handleConversationClick}
            onDeleteClick={handleDeleteClick}
            onViewAppointment={onViewAppointment}
            formatTimestamp={formatTimestamp}
          />

          {/* Desktop Pagination */}
          <EnhancedPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            onPageChange={goToPage}
            onPageSizeChange={changePageSize}
            viewMode={viewMode}
            deviceType={deviceType}
          />
        </div>
      </div>

      {/* Desktop Premium Feature Sections */}
      <AdvancedChatFeatures />
      <LeadManagement />

      {/* Desktop Conversation Modal */}
      {selectedConversationData && (
        <ConversationModal
          conversation={selectedConversationData}
          isOpen={!!selectedConversationData}
          onClose={handleBackToConversations}
          onViewAppointment={onViewAppointment}
          formatTimestamp={formatTimestamp}
        />
      )}

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