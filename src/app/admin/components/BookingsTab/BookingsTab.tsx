// src/app/admin/components/BookingsTab/BookingsTab.tsx

'use client';

import { Appointment } from '../../types';
import { useAppointmentFiltering } from './hooks/useAppointmentFiltering';
import { BookingsHeader } from './components/BookingsHeader';
import { AppointmentFilters } from './components/AppointmentFilters';
import { AppointmentTable } from './components/AppointmentTable';
import { PaginationControls } from './components/PaginationControls';
import { CrmIntegration } from './components/CrmIntegration';
import { FollowUpAutomation } from './components/FollowUpAutomation';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';
import { Edit, Trash2, MessageSquare, Mail, Phone, Building2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingsTabProps {
  scheduledCalls: Appointment[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: number) => void;
  onViewConversation?: (sessionId: string) => void;
}

export const BookingsTab = ({
  scheduledCalls,
  isLoading,
  onRefresh,
  onEdit,
  onDelete,
  onViewConversation
}: BookingsTabProps) => {
  const filtering = useAppointmentFiltering(scheduledCalls);
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  const hasActiveFilters = filtering.searchTerm || 
    filtering.statusFilter !== 'all' || 
    filtering.dateFilter !== 'upcoming';

  const formatSessionId = (sessionId: string) => {
    if (!sessionId) return 'N/A';
    const parts = sessionId.split('_');
    return parts.length > 1 ? `...${parts[1].substring(0, 6)}` : sessionId.substring(0, 8);
  };

  // Mobile: Card-based view with swipe actions
  const MobileBookingsTab = () => (
    <div className="space-y-4">
      {/* Mobile Main Bookings Section */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="p-4 border-b border-slate-600/50">
          <BookingsHeader 
            isLoading={isLoading}
            onRefresh={onRefresh}
          />

          <div className="mt-4">
            <AppointmentFilters
              searchTerm={filtering.searchTerm}
              statusFilter={filtering.statusFilter}
              dateFilter={filtering.dateFilter}
              startIndex={filtering.startIndex}
              endIndex={filtering.endIndex}
              totalCount={filtering.filteredAndSortedAppointments.length}
              onSearchChange={filtering.handleSearchChange}
              onFilterChange={filtering.handleFilterChange}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading appointments...</div>
          </div>
        ) : filtering.filteredAndSortedAppointments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                {hasActiveFilters
                  ? 'No appointments match your filters.' 
                  : 'No appointments scheduled yet.'
                }
              </div>
              {hasActiveFilters && (
                <button 
                  onClick={filtering.clearAllFilters}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Card List */}
            <div className="space-y-4 p-4">
              {filtering.currentAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-slate-700/60 border border-slate-600/60 rounded-lg p-4 hover:bg-slate-600/60 transition-colors">
                  {/* Header with name and status */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-100 text-lg">{appointment.firstName} {appointment.lastName}</h3>
                      {appointment.company && (
                        <div className="flex items-center gap-1 mt-1">
                          <Building2 className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-300">{appointment.company}</span>
                        </div>
                      )}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full bg-${appointment.status === 'confirmed' ? 'green' : appointment.status === 'pending' ? 'yellow' : appointment.status === 'cancelled' ? 'red' : 'blue'}-900/50 text-${appointment.status === 'confirmed' ? 'green' : appointment.status === 'pending' ? 'yellow' : appointment.status === 'cancelled' ? 'red' : 'blue'}-300 border border-${appointment.status === 'confirmed' ? 'green' : appointment.status === 'pending' ? 'yellow' : appointment.status === 'cancelled' ? 'red' : 'blue'}-700/50`}>
                      {appointment.status}
                    </span>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{appointment.email}</span>
                    </div>
                    {appointment.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{appointment.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <div className="font-medium text-gray-100">{appointment.date}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Time:</span>
                      <div className="font-medium text-gray-100">{appointment.time}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Interest:</span>
                      <div className="font-medium text-gray-100 capitalize">{appointment.interest || 'General'}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Chat Session:</span>
                      {appointment.chatSessionId ? (
                        <button
                          onClick={() => onViewConversation && onViewConversation(appointment.chatSessionId!)}
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors mt-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span className="font-mono">{formatSessionId(appointment.chatSessionId)}</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </div>
                  </div>

                  {appointment.chatSessionId && onViewConversation && (
                    <button
                      onClick={() => onViewConversation(appointment.chatSessionId!)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm mb-3"
                      style={{ minHeight: touchTargetSize }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      View Chat ({formatSessionId(appointment.chatSessionId)})
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-3 border-t border-slate-600/50">
                    <button 
                      onClick={() => onEdit(appointment)}
                      className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      disabled={isLoading}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(appointment.id)}
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

            {/* Mobile Pagination */}
            {filtering.totalPages > 1 && (
              <div className="p-4 border-t border-slate-600/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    Page {filtering.currentPage} of {filtering.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => filtering.goToPage(filtering.currentPage - 1)}
                      disabled={filtering.currentPage === 1}
                      className="p-2 bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
                      style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => filtering.goToPage(filtering.currentPage + 1)}
                      disabled={filtering.currentPage === filtering.totalPages}
                      className="p-2 bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
                      style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Premium Features - Simplified */}
      <div className="space-y-4">
        <CrmIntegration />
        <FollowUpAutomation />
      </div>
    </div>
  );

  // Tablet: Hybrid table/card view
  const TabletBookingsTab = () => (
    <div className="space-y-6">
      {/* Tablet Main Bookings Section */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="p-6 border-b border-slate-600/50">
          <BookingsHeader 
            isLoading={isLoading}
            onRefresh={onRefresh}
          />

          <AppointmentFilters
            searchTerm={filtering.searchTerm}
            statusFilter={filtering.statusFilter}
            dateFilter={filtering.dateFilter}
            startIndex={filtering.startIndex}
            endIndex={filtering.endIndex}
            totalCount={filtering.filteredAndSortedAppointments.length}
            onSearchChange={filtering.handleSearchChange}
            onFilterChange={filtering.handleFilterChange}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading appointments...</div>
          </div>
        ) : filtering.filteredAndSortedAppointments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                {hasActiveFilters
                  ? 'No appointments match your filters.' 
                  : 'No appointments scheduled yet.'
                }
              </div>
              {hasActiveFilters && (
                <button 
                  onClick={filtering.clearAllFilters}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <AppointmentTable
              appointments={filtering.currentAppointments}
              isLoading={isLoading}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewConversation={onViewConversation}
            />

            <PaginationControls
              currentPage={filtering.currentPage}
              totalPages={filtering.totalPages}
              onGoToPage={filtering.goToPage}
            />
          </>
        )}
      </div>

      {/* Tablet Premium Features */}
      <CrmIntegration />
      <FollowUpAutomation />
    </div>
  );

  // Desktop: Full table with all columns (original design)
  const DesktopBookingsTab = () => (
    <div className="space-y-6">
      {/* Desktop Main Bookings Section */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="p-6 border-b border-slate-600/50">
          <BookingsHeader 
            isLoading={isLoading}
            onRefresh={onRefresh}
          />

          <AppointmentFilters
            searchTerm={filtering.searchTerm}
            statusFilter={filtering.statusFilter}
            dateFilter={filtering.dateFilter}
            startIndex={filtering.startIndex}
            endIndex={filtering.endIndex}
            totalCount={filtering.filteredAndSortedAppointments.length}
            onSearchChange={filtering.handleSearchChange}
            onFilterChange={filtering.handleFilterChange}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading appointments...</div>
          </div>
        ) : filtering.filteredAndSortedAppointments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                {hasActiveFilters
                  ? 'No appointments match your filters.' 
                  : 'No appointments scheduled yet.'
                }
              </div>
              {hasActiveFilters && (
                <button 
                  onClick={filtering.clearAllFilters}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <AppointmentTable
              appointments={filtering.currentAppointments}
              isLoading={isLoading}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewConversation={onViewConversation}
            />

            <PaginationControls
              currentPage={filtering.currentPage}
              totalPages={filtering.totalPages}
              onGoToPage={filtering.goToPage}
            />
          </>
        )}
      </div>

      {/* Desktop Premium Features */}
      <CrmIntegration />
      <FollowUpAutomation />
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileBookingsTab />}
      tablet={<TabletBookingsTab />}
      desktop={<DesktopBookingsTab />}
    />
  );
};