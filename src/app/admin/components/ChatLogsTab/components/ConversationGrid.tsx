// src/app/admin/components/ChatLogsTab/components/ConversationGrid.tsx

'use client';

import { ConversationCard } from './ConversationCard';
import { ConversationBox } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface ConversationGridProps {
  conversations: ConversationBox[];
  isLoading: boolean;
  searchTerm: string;
  selectedConversation: string | null;
  onConversationClick: (sessionId: string) => void;
  onDeleteClick: (e: React.MouseEvent, sessionId: string) => void;
  onViewAppointment?: (appointmentId: number) => void;
  onClearSearch: () => void;
  formatTimestamp: (timestamp: string) => string;
}

export const ConversationGrid = ({
  conversations,
  isLoading,
  searchTerm,
  selectedConversation,
  onConversationClick,
  onDeleteClick,
  onViewAppointment,
  onClearSearch,
  formatTimestamp
}: ConversationGridProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Loading state - same for all devices
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading conversations...</div>
      </div>
    );
  }

  // Empty state - same for all devices
  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-400 mb-2">No conversations found.</div>
          {searchTerm && (
            <button 
              onClick={onClearSearch}
              className="text-blue-400 hover:text-blue-300 text-sm"
              style={{ minHeight: touchTargetSize }}
            >
              Clear search
            </button>
          )}
        </div>
      </div>
    );
  }

  // Mobile: Single column with large touch-friendly cards
  const MobileConversationGrid = () => (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.sessionId}
          conversation={conversation}
          isSelected={selectedConversation === conversation.sessionId}
          onConversationClick={onConversationClick}
          onDeleteClick={onDeleteClick}
          onViewAppointment={onViewAppointment}
          formatTimestamp={formatTimestamp}
        />
      ))}
    </div>
  );

  // Tablet: Two-column grid
  const TabletConversationGrid = () => (
    <div className="grid grid-cols-2 gap-4">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.sessionId}
          conversation={conversation}
          isSelected={selectedConversation === conversation.sessionId}
          onConversationClick={onConversationClick}
          onDeleteClick={onDeleteClick}
          onViewAppointment={onViewAppointment}
          formatTimestamp={formatTimestamp}
        />
      ))}
    </div>
  );

  // Desktop: Three-column grid
  const DesktopConversationGrid = () => (
    <div className="grid grid-cols-3 gap-4">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.sessionId}
          conversation={conversation}
          isSelected={selectedConversation === conversation.sessionId}
          onConversationClick={onConversationClick}
          onDeleteClick={onDeleteClick}
          onViewAppointment={onViewAppointment}
          formatTimestamp={formatTimestamp}
        />
      ))}
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileConversationGrid />}
      tablet={<TabletConversationGrid />}
      desktop={<DesktopConversationGrid />}
    />
  );
};