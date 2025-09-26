// src/app/admin/components/BookingsTab/components/AppointmentTable.tsx

'use client';

import { Edit, Trash2, Mail, Phone, Building2, MessageSquare, Activity, Crown, Calendar } from 'lucide-react';
import { Appointment } from '../../../types';
import { useAppointmentFormatting } from '../hooks/useAppointmentFormatting';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface AppointmentTableProps {
  appointments: Appointment[];
  isLoading: boolean;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: number) => void;
  onViewConversation?: (sessionId: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
}

// FIXES for AppointmentTable.tsx component

export const AppointmentTable = ({
  appointments,
  isLoading,
  onEdit,
  onDelete,
  onViewConversation,
  onAppointmentClick
}: AppointmentTableProps) => {
  // FIX: Use ALL formatting functions, not just formatSessionId and getStatusStyles
  const { 
    formatSessionId, 
    getStatusStyles, 
    formatDisplayDate,      // ADD THIS
    formatDisplayTime,      // ADD THIS  
    formatPhoneNumber      // ADD THIS
  } = useAppointmentFormatting();
  
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Swipeable cards with action gestures
  const MobileAppointmentTable = () => (
    <div className="space-y-4">
      {appointments.map((call) => (
        <div key={call.id} className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-4 hover:bg-slate-600/60 transition-colors">
          {/* Header with name and status */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium text-gray-100 text-lg">{call.firstName} {call.lastName}</h3>
              {call.company && (
                <div className="flex items-center gap-1 mt-1">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-300">{call.company}</span>
                </div>
              )}
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(call.status)}`}>
              {call.status}
            </span>
          </div>

          {/* Contact Information - FIX PHONE FORMATTING */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{call.email}</span>
            </div>
            {call.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{formatPhoneNumber(call.phone)}</span>
              </div>
            )}
          </div>

          {/* Appointment Details - FIX DATE AND TIME FORMATTING */}
          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div>
              <span className="text-gray-400">Date:</span>
              <div className="font-medium text-gray-100">{formatDisplayDate(call.date)}</div>
            </div>
            <div>
              <span className="text-gray-400">Time:</span>
              <div className="font-medium text-gray-100">{formatDisplayTime(call.time)}</div>
            </div>
            <div>
              <span className="text-gray-400">Interest:</span>
              <div className="font-medium text-gray-100 capitalize">{call.interest || 'General'}</div>
            </div>
            <div>
              <span className="text-gray-400">Chat Session:</span>
              {call.chatSessionId ? (
                <button
                  onClick={() => onViewConversation && onViewConversation(call.chatSessionId!)}
                  className="text-blue-400 hover:text-blue-300 text-xs font-medium underline transition-colors"
                  style={{ minHeight: touchTargetSize }}
                >
                  {formatSessionId(call.chatSessionId)}
                </button>
              ) : (
                <span className="text-gray-400 text-xs">None</span>
              )}
            </div>
          </div>

          {/* Action buttons - Mobile optimized */}
          <div className="flex gap-2 pt-3 border-t border-slate-600/50">
            <button
              onClick={() => onEdit(call)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium"
              style={{ minHeight: touchTargetSize }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(call.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
              style={{ minHeight: touchTargetSize }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Tablet: Two-column grid with more details
  const TabletAppointmentTable = () => (
    <div className="grid grid-cols-2 gap-4">
      {appointments.map((call) => (
        <div key={call.id}
        className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-4 hover:bg-slate-600/60 transition-colors"
        onClick={() => onAppointmentClick && onAppointmentClick(call)}
        >
          {/* Similar structure but with formatDisplayDate, formatDisplayTime, formatPhoneNumber */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium text-gray-100 text-base">{call.firstName} {call.lastName}</h3>
              {call.company && (
                <div className="flex items-center gap-1 mt-1">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-300">{call.company}</span>
                </div>
              )}
            </div>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(call.status)}`}>
              {call.status}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{call.email}</span>
            </div>
            {call.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{formatPhoneNumber(call.phone)}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div>
              <span className="text-gray-400">Date:</span>
              <div className="font-medium text-gray-100">{formatDisplayDate(call.date)}</div>
            </div>
            <div>
              <span className="text-gray-400">Time:</span>
              <div className="font-medium text-gray-100">{formatDisplayTime(call.time)}</div>
            </div>
          </div>

          {call.chatSessionId && (
            <div className="text-xs text-gray-400 mb-3">
              Session: 
              <button
                onClick={() => onViewConversation && onViewConversation(call.chatSessionId!)}
                className="text-blue-400 hover:text-blue-300 ml-1 underline transition-colors"
              >
                {formatSessionId(call.chatSessionId)}
              </button>
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t border-slate-600/50">
            <button
              onClick={() => onEdit(call)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(call.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop: Full table with all details - FIX TABLE DISPLAY
  const DesktopAppointmentTable = () => (
    <div className="overflow-hidden bg-slate-800/50 rounded-lg border border-slate-600/50">
      <table className="min-w-full divide-y divide-slate-600/50">
        <thead className="bg-slate-700/30">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Interest</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date & Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Chat Session</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-600/50">
          {appointments.map((call) => (
            <tr key={call.id}
              className="hover:bg-slate-700/30 cursor-pointer"
              onClick={() => onAppointmentClick && onAppointmentClick(call)}
            >
              <td className="px-4 py-4">
                <div>
                  <div className="font-medium text-gray-100">{call.firstName} {call.lastName}</div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{call.email}</span>
                    </div>
                    {call.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{formatPhoneNumber(call.phone)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                {call.company ? (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-100">{call.company}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-4">
                <span className="text-gray-100 capitalize">{call.interest || 'General'}</span>
              </td>
              <td className="px-4 py-4">
                <div>
                  <div className="font-medium text-gray-100">{formatDisplayDate(call.date)}</div>
                  <div className="text-sm text-gray-300">{formatDisplayTime(call.time)}</div>
                </div>
              </td>
              <td className="px-4 py-4">
                {call.chatSessionId && onViewConversation ? (
                  <button
                    onClick={() => onViewConversation(call.chatSessionId!)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors group"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-mono">{formatSessionId(call.chatSessionId)}</span>
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">None</span>
                )}
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(call.status)}`}>
                  {call.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(call)}
                    className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                    title="Edit appointment"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(call.id)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                    title="Delete appointment"
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
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading appointments...</div>
      </div>
    );
  }

  // Empty state  
  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">No appointments found.</div>
      </div>
    );
  }

  return (
    <ResponsiveWrapper
      mobile={<MobileAppointmentTable />}
      tablet={<TabletAppointmentTable />}
      desktop={<DesktopAppointmentTable />}
    />
  );
};