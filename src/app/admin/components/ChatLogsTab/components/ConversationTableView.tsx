// Table View Component
// src/app/admin/components/ChatLogsTab/components/ConversationTableView.tsx

import React from 'react';
import { User, MessageSquare, Clock, Calendar, Trash2, ExternalLink } from 'lucide-react';
import { ConversationBox } from '../types';
import { formatSessionId } from '../utils/formatting';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

interface ConversationTableViewProps {
  conversations: ConversationBox[];
  selectedConversation: string | null;
  onConversationClick: (sessionId: string) => void;
  onDeleteClick: (e: React.MouseEvent, sessionId: string) => void;
  onViewAppointment?: (appointmentId: number) => void;
  formatTimestamp: (timestamp: string) => string;
}

export const ConversationTableView: React.FC<ConversationTableViewProps> = ({
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
    <div className="bg-slate-700/60 border border-slate-600/50 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/80 border-b border-slate-600/50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">User</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Preview</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Messages</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Duration</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Last Activity</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Status</th>
              {deviceType === 'desktop' && (
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-300">Session ID</th>
              )}
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conversation) => (
              <tr
                key={conversation.sessionId}
                onClick={() => onConversationClick(conversation.sessionId)}
                className={`border-b border-slate-600/30 cursor-pointer transition-colors hover:bg-slate-600/40 ${
                  selectedConversation === conversation.sessionId
                    ? 'bg-blue-900/20'
                    : ''
                }`}
              >
                {/* User */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-100 text-sm">
                        {conversation.userName}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Preview */}
                <td className="px-4 py-3 max-w-xs">
                  <div className="text-sm text-gray-300 truncate">
                    {conversation.firstMessage}
                  </div>
                </td>

                {/* Messages */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <MessageSquare className="w-3 h-3" />
                    {conversation.messageCount}
                  </div>
                </td>

                {/* Duration */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Clock className="w-3 h-3" />
                    {conversation.duration}
                  </div>
                </td>

                {/* Last Activity */}
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-300">
                    {formatTimestamp(conversation.lastActivity)}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {conversation.hasAppointment ? (
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-900/50 text-green-300 border border-green-700/50">
                      Booked
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">-</span>
                  )}
                </td>

                {/* Session ID (Desktop only) */}
                {deviceType === 'desktop' && (
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-gray-500">
                      {formatSessionId(conversation.sessionId)}
                    </div>
                  </td>
                )}

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {conversation.hasAppointment && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewAppointment && onViewAppointment(0);
                        }}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                        title="View scheduled call"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onConversationClick(conversation.sessionId);
                      }}
                      className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      title="View conversation"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => onDeleteClick(e, conversation.sessionId)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};