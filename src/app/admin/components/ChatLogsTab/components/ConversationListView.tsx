// List View Component
// src/app/admin/components/ChatLogsTab/components/ConversationListView.tsx

import React from 'react';
import { User, MessageSquare, Clock, Calendar, Trash2 } from 'lucide-react';
import { ConversationBox } from '../types';
import { formatSessionId } from '../utils/formatting';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface ConversationListViewProps {
  conversations: ConversationBox[];
  selectedConversation: string | null;
  onConversationClick: (sessionId: string) => void;
  onDeleteClick: (e: React.MouseEvent, sessionId: string) => void;
  onViewAppointment?: (appointmentId: number) => void;
  formatTimestamp: (timestamp: string) => string;
}

export const ConversationListView: React.FC<ConversationListViewProps> = ({
  conversations,
  selectedConversation,
  onConversationClick,
  onDeleteClick,
  onViewAppointment,
  formatTimestamp
}) => {
  const { type: deviceType } = useDeviceDetection();

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">No conversations found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.sessionId}
          onClick={() => onConversationClick(conversation.sessionId)}
          className={`bg-slate-700/60 border rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-600/60 relative ${
            selectedConversation === conversation.sessionId
              ? 'border-blue-500/50 bg-blue-900/20'
              : 'border-slate-600/60 hover:border-blue-500/30'
          }`}
        >
          {/* Delete Button */}
          <button
            onClick={(e) => onDeleteClick(e, conversation.sessionId)}
            className="absolute top-3 right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-70 hover:opacity-100"
            title="Delete conversation"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          <div className="flex items-center justify-between pr-8">
            {/* Left side - User info and preview */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-100 truncate">{conversation.userName}</h3>
                  {conversation.hasAppointment && (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-900/50 text-green-300 border border-green-700/50 flex-shrink-0">
                      Booked
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-300 line-clamp-1 mb-2">
                  {conversation.firstMessage}
                </p>
                
                {deviceType !== 'mobile' && (
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {conversation.messageCount} messages
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {conversation.duration}
                    </span>
                    <span className="font-mono text-gray-500">
                      Session: {formatSessionId(conversation.sessionId)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Timestamp and appointment link */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400">
                {formatTimestamp(conversation.lastActivity)}
              </span>
              
              {conversation.hasAppointment && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewAppointment && onViewAppointment(0);
                  }}
                  className="flex items-center gap-1 text-green-400 hover:text-green-300 text-xs transition-colors"
                >
                  <Calendar className="w-3 h-3" />
                  <span className="hidden sm:inline">View Call</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};