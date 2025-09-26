// Conversation Modal Component
// src/app/admin/components/ChatLogsTab/components/ConversationModal.tsx

'use client';

import React from 'react';
import { ArrowLeft, X, User, Bot, Activity, Clock } from 'lucide-react';
import { ConversationBox } from '../types';

interface ConversationModalProps {
  conversation: ConversationBox;
  isOpen: boolean;
  onClose: () => void;
  onViewAppointment?: (appointmentId: number) => void;
  formatTimestamp: (timestamp: string) => string;
}

export const ConversationModal: React.FC<ConversationModalProps> = ({
  conversation,
  isOpen,
  onClose,
  onViewAppointment,
  formatTimestamp
}) => {
  if (!isOpen) return null;

  // Handler for viewing the appointment
  const handleViewAppointment = () => {
    if (onViewAppointment) {
      // For now, we'll need to get the appointmentId from the parent component
      // The parent should pass appointments and find the one with matching chatSessionId
      console.log('Looking for appointment with sessionId:', conversation.sessionId);
      
      // Temporary: use appointmentId if available, otherwise log for debugging
      if (conversation.appointmentId) {
        onViewAppointment(conversation.appointmentId);
      } else {
        console.warn('No appointmentId found for conversation:', conversation.sessionId);
        // You could pass a special value to indicate we need to find by sessionId
        onViewAppointment(-1); // Use -1 to indicate "find by sessionId"
      }
      onClose(); // Close modal after navigating
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-600/50 w-full max-w-4xl max-h-[90vh] flex flex-col">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-600/50">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Conversations
              </button>
              
              <div className="w-px h-6 bg-slate-600"></div>
              
              <h2 className="text-xl font-semibold text-white">
                Conversation with {conversation.userName}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Conversation Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span>Avg. response: --ms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Session: {conversation.sessionId.slice(-8)}</span>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {conversation.messages.map((message, index) => (
                <div key={message.id || index} className="flex gap-4">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.messageType === 'user' ? 'bg-blue-600' : 'bg-slate-600'
                  }`}>
                    {message.messageType === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">
                        {message.messageType === 'user' ? conversation.userName : 'AI Assistant'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    
                    <div className={`rounded-lg p-4 ${
                      message.messageType === 'user' 
                        ? 'bg-blue-600/20 border border-blue-500/30' 
                        : 'bg-slate-700/50 border border-slate-600/50'
                    }`}>
                      <p className="text-gray-100 whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-slate-600/50 bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div>
                  <span className="font-medium">Messages:</span> {conversation.messageCount}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {conversation.duration}
                </div>
                <div>
                  <span className="font-medium">Last Activity:</span> {formatTimestamp(conversation.lastActivity)}
                </div>
                {conversation.hasAppointment && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 font-medium">Appointment Booked</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {conversation.hasAppointment && (
                  <button 
                    onClick={handleViewAppointment}
                    className="bg-green-600/20 border border-green-500/60 text-green-300 px-4 py-2 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium"
                  >
                    View Appointment
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};