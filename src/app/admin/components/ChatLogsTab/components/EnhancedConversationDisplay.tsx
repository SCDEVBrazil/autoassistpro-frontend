// Enhanced Conversation Display Component
// src/app/admin/components/ChatLogsTab/components/EnhancedConversationDisplay.tsx

import React from 'react';
import { ConversationBox } from '../types';
import { ViewMode } from '../hooks/useEnhancedChatLogs';
import { ConversationGrid } from './ConversationGrid';
import { ConversationListView } from './ConversationListView';
import { ConversationTableView } from './ConversationTableView';

interface EnhancedConversationDisplayProps {
  viewMode: ViewMode;
  conversations: ConversationBox[];
  isLoading: boolean;
  selectedConversation: string | null;
  onConversationClick: (sessionId: string) => void;
  onDeleteClick: (e: React.MouseEvent, sessionId: string) => void;
  onViewAppointment?: (appointmentId: number) => void;
  formatTimestamp: (timestamp: string) => string;
}

export const EnhancedConversationDisplay: React.FC<EnhancedConversationDisplayProps> = ({
  viewMode,
  conversations,
  isLoading,
  selectedConversation,
  onConversationClick,
  onDeleteClick,
  onViewAppointment,
  formatTimestamp
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading conversations...</div>
      </div>
    );
  }

  switch (viewMode) {
    case 'grid':
      return (
        <ConversationGrid
          conversations={conversations}
          isLoading={isLoading}
          searchTerm=""
          selectedConversation={selectedConversation}
          onConversationClick={onConversationClick}
          onDeleteClick={onDeleteClick}
          onViewAppointment={onViewAppointment}
          onClearSearch={() => {}}
          formatTimestamp={formatTimestamp}
        />
      );
    
    case 'list':
      return (
        <ConversationListView
          conversations={conversations}
          selectedConversation={selectedConversation}
          onConversationClick={onConversationClick}
          onDeleteClick={onDeleteClick}
          onViewAppointment={onViewAppointment}
          formatTimestamp={formatTimestamp}
        />
      );
    
    case 'table':
      return (
        <ConversationTableView
          conversations={conversations}
          selectedConversation={selectedConversation}
          onConversationClick={onConversationClick}
          onDeleteClick={onDeleteClick}
          onViewAppointment={onViewAppointment}
          formatTimestamp={formatTimestamp}
        />
      );
    
    default:
      return null;
  }
};