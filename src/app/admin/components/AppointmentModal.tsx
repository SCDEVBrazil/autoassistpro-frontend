// Appointment Modal Component
// src/app/admin/components/AppointmentModal.tsx

'use client';

import React from 'react';
import { X, User, Mail, Phone, Building2, Calendar, Clock, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: number) => void;
  onViewConversation?: (sessionId: string) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onViewConversation
}) => {
  if (!isOpen || !appointment) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(appointment);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this appointment?')) {
      onDelete(appointment.id);
      onClose();
    }
  };

  const handleViewConversation = () => {
    if (onViewConversation && appointment.chatSessionId) {
      onViewConversation(appointment.chatSessionId);
      onClose();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900/50 text-green-300 border-green-700/50';
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50';
      case 'cancelled':
        return 'bg-red-900/50 text-red-300 border-red-700/50';
      case 'completed':
        return 'bg-blue-900/50 text-blue-300 border-blue-700/50';
      default:
        return 'bg-gray-900/50 text-gray-300 border-gray-700/50';
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
        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-600/50 w-full max-w-2xl max-h-[90vh] flex flex-col">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-600/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Discovery Call Details
                </h2>
                <p className="text-gray-400 text-sm">
                  {formatDate(appointment.date)} at {formatTime(appointment.time)}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
                {appointment.chatSessionId && (
                  <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-900/50 text-blue-300 border border-blue-700/50">
                    Linked to Chat
                  </span>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="text-white font-medium">{appointment.firstName} {appointment.lastName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">{appointment.email}</p>
                  </div>
                </div>

                {appointment.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-white font-medium">{appointment.phone}</p>
                    </div>
                  </div>
                )}

                {appointment.company && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Company</p>
                      <p className="text-white font-medium">{appointment.company}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Appointment Details</h3>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white font-medium">{formatDate(appointment.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-400">Time</p>
                    <p className="text-white font-medium">{formatTime(appointment.time)}</p>
                  </div>
                </div>

                {appointment.interest && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">Interest/Topic</p>
                      <p className="text-white font-medium">{appointment.interest}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            {(appointment.createdAt || appointment.updatedAt) && (
              <div className="border-t border-slate-600/50 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {appointment.createdAt && (
                    <div>
                      <p className="text-gray-400">Created</p>
                      <p className="text-white">{new Date(appointment.createdAt).toLocaleString()}</p>
                    </div>
                  )}
                  {appointment.updatedAt && (
                    <div>
                      <p className="text-gray-400">Last Updated</p>
                      <p className="text-white">{new Date(appointment.updatedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-slate-600/50 bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {appointment.chatSessionId && (
                  <button
                    onClick={handleViewConversation}
                    className="bg-blue-600/20 border border-blue-500/60 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    View Chat Conversation
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {onEdit && (
                  <button
                    onClick={handleEdit}
                    className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="bg-red-600/20 border border-red-500/60 text-red-300 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
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