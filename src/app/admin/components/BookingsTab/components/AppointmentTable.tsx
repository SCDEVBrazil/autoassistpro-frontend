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
}

export const AppointmentTable = ({
  appointments,
  isLoading,
  onEdit,
  onDelete,
  onViewConversation
}: AppointmentTableProps) => {
  const { formatSessionId, getStatusStyles } = useAppointmentFormatting();
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

          {/* Contact Information */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">{call.email}</span>
            </div>
            {call.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{call.phone}</span>
              </div>
            )}
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div>
              <span className="text-gray-400">Date:</span>
              <div className="font-medium text-gray-100">{call.date}</div>
            </div>
            <div>
              <span className="text-gray-400">Time:</span>
              <div className="font-medium text-gray-100">{call.time}</div>
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
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span className="font-mono">{formatSessionId(call.chatSessionId)}</span>
                </button>
              ) : (
                <span className="text-gray-400 text-xs">None</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-slate-600/50">
            <button 
              onClick={() => onEdit(call)}
              className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              disabled={isLoading}
              style={{ minHeight: touchTargetSize }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button 
              onClick={() => onDelete(call.id)}
              className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              disabled={isLoading}
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

  // Tablet: Condensed table with essential columns
  const TabletAppointmentTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date & Time</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-600/50">
          {appointments.map((call) => (
            <tr key={call.id} className="hover:bg-slate-700/30">
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
                        <span>{call.phone}</span>
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
                <div>
                  <div className="font-medium text-gray-100">{call.date}</div>
                  <div className="text-sm text-gray-300">{call.time}</div>
                  {call.chatSessionId && onViewConversation && (
                    <button
                      onClick={() => onViewConversation(call.chatSessionId!)}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors mt-1"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span className="font-mono">{formatSessionId(call.chatSessionId)}</span>
                    </button>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(call.status)}`}>
                  {call.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onEdit(call)}
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    disabled={isLoading}
                    style={{ minHeight: touchTargetSize }}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(call.id)}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                    disabled={isLoading}
                    style={{ minHeight: touchTargetSize }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Desktop: Full table with all data (original design)
  const DesktopAppointmentTable = () => (
    <>
      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Interest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Chat Session</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-600/50">
            {appointments.map((call) => (
              <tr key={call.id} className="hover:bg-slate-700/30">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-100">{call.firstName} {call.lastName}</div>
                    <div className="text-sm text-gray-300 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {call.email}
                      </span>
                      {call.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {call.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {call.company && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-100">{call.company}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-300 capitalize">{call.interest || 'General'}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-100">{call.date}</div>
                    <div className="text-sm text-gray-300">{call.time}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {call.chatSessionId ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewConversation && onViewConversation(call.chatSessionId!)}
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors group"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <div>
                          <div className="font-mono text-xs">
                            {formatSessionId(call.chatSessionId)}
                          </div>
                          <div className="text-xs text-gray-400 group-hover:text-blue-300">
                            View Chat
                          </div>
                        </div>
                      </button>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        <span>--ms</span>
                        <Crown className="w-3 h-3" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      No chat session
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(call.status)}`}>
                    {call.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onEdit(call)}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                      disabled={isLoading}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(call.id)}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="lg:hidden space-y-4">
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

            {/* Contact Information */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{call.email}</span>
              </div>
              {call.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{call.phone}</span>
                </div>
              )}
            </div>

            {/* Appointment Details */}
            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
              <div>
                <span className="text-gray-400">Date:</span>
                <div className="font-medium text-gray-100">{call.date}</div>
              </div>
              <div>
                <span className="text-gray-400">Time:</span>
                <div className="font-medium text-gray-100">{call.time}</div>
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
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span className="font-mono">{formatSessionId(call.chatSessionId)}</span>
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">None</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-slate-600/50">
              <button 
                onClick={() => onEdit(call)}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button 
                onClick={() => onDelete(call.id)}
                className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Return the responsive wrapper with device-specific components
  return (
    <ResponsiveWrapper
      mobile={<MobileAppointmentTable />}
      tablet={<TabletAppointmentTable />}
      desktop={<DesktopAppointmentTable />}
    />
  );
};