// src/app/admin/components/ChatLogsTab/components/ConversationCard.tsx

'use client';

import { User, MessageSquare, Clock, Trash2, TrendingUp, Crown, Calendar } from 'lucide-react';
import { ConversationBox } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface ConversationCardProps {
  conversation: ConversationBox;
  isSelected: boolean;
  onConversationClick: (sessionId: string) => void;
  onDeleteClick: (e: React.MouseEvent, sessionId: string) => void;
  onViewAppointment?: (appointmentId: number) => void;
  formatTimestamp: (timestamp: string) => string;
}

export const ConversationCard = ({
  conversation,
  isSelected,
  onConversationClick,
  onDeleteClick,
  onViewAppointment,
  formatTimestamp
}: ConversationCardProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Simplified card with essential info and swipe actions
  const MobileConversationCard = () => (
    <div
      onClick={() => onConversationClick(conversation.sessionId)}
      className={`bg-slate-700/60 border rounded-lg p-3 cursor-pointer transition-all hover:bg-slate-600/60 relative ${
        isSelected
          ? 'border-blue-500/50 bg-blue-900/20'
          : 'border-slate-600/60 hover:border-blue-500/30'
      }`}
    >
      {/* Mobile Delete Button - Larger touch target */}
      <button
        onClick={(e) => onDeleteClick(e, conversation.sessionId)}
        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-70 hover:opacity-100"
        style={{ 
          width: touchTargetSize, 
          height: touchTargetSize,
          minWidth: '32px',
          minHeight: '32px'
        }}
        title="Delete conversation"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Mobile User Info - Simplified */}
      <div className="flex items-start justify-between mb-3 pr-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-100 text-sm truncate">{conversation.userName}</h4>
            <p className="text-xs text-gray-400 font-mono truncate">
              {conversation.sessionId.split('_')[1]?.substring(0, 8)}
            </p>
          </div>
        </div>
        {conversation.hasAppointment && (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-900/50 text-green-300 border border-green-700/50 flex-shrink-0">
            Booked
          </span>
        )}
      </div>

      {/* Mobile Conversation Preview - Essential only */}
      <div className="mb-3">
        <p className="text-xs text-gray-300 line-clamp-2">
          {conversation.firstMessage}
        </p>
      </div>

      {/* Mobile Stats - Simplified */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span className="hidden xs:inline">{conversation.messageCount}</span>
            <span className="xs:hidden">{conversation.messageCount}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="hidden xs:inline">{conversation.duration}</span>
          </span>
        </div>
        <span className="truncate text-xs">{formatTimestamp(conversation.lastActivity)}</span>
      </div>

      {/* Mobile Appointment Link - Touch optimized */}
      {conversation.hasAppointment && (
        <div className="mt-3 pt-2 border-t border-slate-600/50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewAppointment && onViewAppointment(0);
            }}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 text-xs transition-colors w-full justify-center py-2 rounded"
            style={{ minHeight: '32px' }}
          >
            <Calendar className="w-4 h-4" />
            <span>View Call</span>
          </button>
        </div>
      )}
    </div>
  );

  // Tablet: Medium card with balanced information
  const TabletConversationCard = () => (
    <div
      onClick={() => onConversationClick(conversation.sessionId)}
      className={`bg-slate-700/60 border rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-600/60 relative ${
        isSelected
          ? 'border-blue-500/50 bg-blue-900/20'
          : 'border-slate-600/60 hover:border-blue-500/30'
      }`}
    >
      {/* Tablet Delete Button */}
      <button
        onClick={(e) => onDeleteClick(e, conversation.sessionId)}
        className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-70 hover:opacity-100"
        title="Delete conversation"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Tablet Lead Score Badge */}
      <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold opacity-75">
        Score: --
      </div>

      {/* Tablet User Info */}
      <div className="flex items-start justify-between mb-3 pr-8 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100 text-sm">{conversation.userName}</h3>
            <p className="text-xs text-gray-400 font-mono">
              Session: {conversation.sessionId.split('_')[1]?.substring(0, 10)}
            </p>
          </div>
        </div>
        {conversation.hasAppointment && (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-900/50 text-green-300 border border-green-700/50">
            Booked
          </span>
        )}
      </div>

      {/* Tablet Conversation Preview */}
      <div className="mb-3">
        <p className="text-sm text-gray-300 line-clamp-2">
          {conversation.firstMessage}
        </p>
      </div>

      {/* Tablet Lead Temperature - Condensed */}
      <div className="mb-3 p-2 bg-slate-600/40 rounded border border-slate-500/40 opacity-75">
        <div className="flex items-center gap-2 text-xs">
          <TrendingUp className="w-3 h-3 text-gray-400" />
          <span className="text-gray-400">Lead Temp:</span>
          <span className="font-medium text-gray-300">-- °</span>
          <Crown className="w-3 h-3 text-gray-400 ml-auto" />
        </div>
      </div>

      {/* Tablet Stats and Timestamp */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {conversation.messageCount}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {conversation.duration}
          </span>
        </div>
        <span>{formatTimestamp(conversation.lastActivity)}</span>
      </div>

      {/* Tablet Appointment Link */}
      {conversation.hasAppointment && (
        <div className="mt-2 pt-2 border-t border-slate-600/50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewAppointment && onViewAppointment(0);
            }}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 text-xs transition-colors"
          >
            <Calendar className="w-3 h-3" />
            <span>View Scheduled Call</span>
          </button>
        </div>
      )}
    </div>
  );

  // Desktop: Full card with all details
  const DesktopConversationCard = () => (
    <div
      onClick={() => onConversationClick(conversation.sessionId)}
      className={`bg-slate-700/60 border rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-600/60 relative ${
        isSelected
          ? 'border-blue-500/50 bg-blue-900/20'
          : 'border-slate-600/60 hover:border-blue-500/30'
      }`}
    >
      {/* Desktop Delete Button */}
      <button
        onClick={(e) => onDeleteClick(e, conversation.sessionId)}
        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-70 hover:opacity-100"
        title="Delete conversation"
      >
        <Trash2 className="w-3 h-3" />
      </button>

      {/* Desktop Premium Lead Score Badge - BETA placeholder */}
      <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold opacity-75">
        Score: --
      </div>

      {/* Desktop User Info */}
      <div className="flex items-start justify-between mb-3 pr-8 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100">{conversation.userName}</h3>
            <p className="text-xs text-gray-400 font-mono">
              Session: {conversation.sessionId.split('_')[1]?.substring(0, 10)}
            </p>
          </div>
        </div>
        {conversation.hasAppointment && (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-900/50 text-green-300 border border-green-700/50">
            Booked
          </span>
        )}
      </div>

      {/* Desktop Conversation Preview */}
      <div className="mb-3">
        <p className="text-sm text-gray-300 line-clamp-2">
          {conversation.firstMessage}
        </p>
      </div>

      {/* Desktop Premium Lead Temperature - BETA placeholder */}
      <div className="mb-3 p-2 bg-slate-600/40 rounded border border-slate-500/40 opacity-75">
        <div className="flex items-center gap-2 text-xs">
          <TrendingUp className="w-3 h-3 text-gray-400" />
          <span className="text-gray-400">Lead Temperature:</span>
          <span className="font-medium text-gray-300">-- °</span>
          <Crown className="w-3 h-3 text-gray-400 ml-auto" />
        </div>
      </div>

      {/* Desktop Stats and Appointment Link */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {conversation.messageCount}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {conversation.duration}
          </span>
        </div>
        <span>{formatTimestamp(conversation.lastActivity)}</span>
      </div>

      {/* Desktop Appointment Link if booking was made */}
      {conversation.hasAppointment && (
        <div className="mt-2 pt-2 border-t border-slate-600/50">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent conversation selection
              onViewAppointment && onViewAppointment(0); // We'll improve this ID lookup later
            }}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 text-xs transition-colors"
          >
            <Calendar className="w-3 h-3" />
            <span>View Scheduled Call</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileConversationCard />}
      tablet={<TabletConversationCard />}
      desktop={<DesktopConversationCard />}
    />
  );
};