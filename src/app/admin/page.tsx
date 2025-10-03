// src/app/admin/page.tsx - Complete Fixed Version with AppointmentModal

'use client';

import { useState, useEffect } from 'react';
import { ActiveTab, Notification, Appointment } from './types';
import { useAuth } from './hooks/useAuth';
import { useAppointments } from './hooks/useAppointments';
import { useAvailability } from './hooks/useAvailability';
import { useSettings } from './hooks/useSettings';
import { useChatLogs } from './hooks/useChatLogs';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';

// Components
import { AuthForm } from './components/AuthForm';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AvailabilityTab } from './components/AvailabilityTab';
import { BookingsTab } from './components/BookingsTab/BookingsTab';
import { SettingsTab } from './components/SettingsTab';
import { ChatLogsTab } from './components/ChatLogsTab/ChatLogsTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { EditAppointmentModal } from './components/EditAppointmentModal';
import { AppointmentModal } from './components/AppointmentModal';
import { NotificationModal } from './components/NotificationModal';
import { ConfirmationModal } from './components/ConfirmationModal';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('availability');
  const [notification, setNotification] = useState<Notification | null>(null);
  
  // NEW: Appointment modal state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  // Authentication hook
  const { isAuthenticated, loginForm, handleLogin, handleLogout, updateLoginForm } = useAuth();

  // Custom hooks for data management
  const appointments = useAppointments(setNotification);
  const availability = useAvailability(setNotification);
  const settings = useSettings(setNotification);
  
  // UPDATED: Pass appointments.scheduledCalls to useChatLogs for database-driven appointment detection
  const chatLogs = useChatLogs(setNotification, appointments.scheduledCalls);

  // Navigation handlers for cross-linking between tabs
  const handleViewConversation = (sessionId: string) => {
    setActiveTab('chat-logs');
    // Close appointment modal if open
    if (showAppointmentModal) {
      setShowAppointmentModal(false);
      setSelectedAppointment(null);
    }
    setTimeout(() => {
      chatLogs.handleSelectSession(sessionId);
    }, 100);
  };

  // UPDATED: Enhanced appointment view handler
  const handleViewAppointment = (appointmentId: number) => {
    console.log('Looking for appointment with ID:', appointmentId);
    
    // Handle special case where appointmentId is -1 (find by sessionId)
    if (appointmentId === -1) {
      // We need to find the appointment by sessionId from the currently selected conversation
      const currentSessionId = chatLogs.selectedSession;
      if (currentSessionId) {
        const appointment = appointments.scheduledCalls.find(apt => apt.chatSessionId === currentSessionId);
        if (appointment) {
          setActiveTab('bookings');
          setSelectedAppointment(appointment);
          setShowAppointmentModal(true);
          console.log('Opening appointment modal for session:', currentSessionId);
          return;
        }
      }
      
      setNotification({
        type: 'error',
        message: 'Unable to find linked appointment. The appointment may have been deleted or the link is broken.'
      });
      return;
    }
    
    // Find the specific appointment by ID
    const appointment = appointments.scheduledCalls.find(apt => apt.id === appointmentId);
    if (appointment) {
      // Switch to bookings tab
      setActiveTab('bookings');
      
      // Open the appointment modal
      setSelectedAppointment(appointment);
      setShowAppointmentModal(true);
      
      console.log('Opening appointment modal for:', appointment.firstName, appointment.lastName);
    } else {
      console.warn('Appointment not found with ID:', appointmentId);
      setNotification({
        type: 'error',
        message: `Appointment with ID ${appointmentId} not found.`
      });
    }
  };

  // NEW: Appointment modal close handler
  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(null);
  };

  // Chat logs delete handler
  const handleDeleteConversation = async (sessionId: string) => {
    await chatLogs.deleteConversation(sessionId);
  };

  // Load data once when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      availability.loadWeeklySchedule();
      availability.loadBlackoutDates();
      appointments.loadScheduledCalls();
      settings.loadAppointmentSettings();
      chatLogs.loadAllChatData();
    }
  }, [isAuthenticated]);

  // FIXED: Graceful polling effect for appointments and chat logs
  useEffect(() => {
    if (isAuthenticated && (activeTab === 'bookings' || activeTab === 'chat-logs')) {
      const pollInterval = setInterval(async () => {
        try {
          if (activeTab === 'bookings') {
            // For appointments, the existing load function is fine
            await appointments.loadScheduledCalls();
          } else if (activeTab === 'chat-logs') {
            // FIXED: Use refreshChatData instead of loadAllChatData for graceful updates
            await chatLogs.refreshChatData();
          }
        } catch (error) {
          console.error('Polling update failed:', error);
          // Don't show error notifications for background updates
          // as they can be disruptive to the user experience
        }
      }, 60000); // 60 seconds

      console.log(`Started graceful polling for ${activeTab} tab`);
      return () => {
        clearInterval(pollInterval);
        console.log(`Stopped polling for ${activeTab} tab`);
      };
    }
  }, [isAuthenticated, activeTab, appointments.loadScheduledCalls, chatLogs.refreshChatData]);

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthForm
        loginForm={loginForm}
        onLogin={handleLogin}
        onUpdateForm={updateLoginForm}
      />
    );
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'availability':
        return (
          <AvailabilityTab
            weeklySchedule={availability.weeklySchedule}
            blackoutDates={availability.blackoutDates}
            isLoading={availability.isLoading}
            onUpdateDaySchedule={availability.updateDaySchedule}
            onSaveSchedule={availability.saveWeeklySchedule}
            onAddBlackout={availability.addBlackoutDate}
            onRemoveBlackout={availability.removeBlackoutDate}
          />
        );
      case 'bookings':
        return (
          <BookingsTab
            scheduledCalls={appointments.scheduledCalls}
            isLoading={appointments.isLoading}
            onRefresh={appointments.loadScheduledCalls}
            onEdit={appointments.openEditModal}
            onDelete={appointments.initiateDeleteAppointment}
            onViewConversation={handleViewConversation}
            onAppointmentClick={(appointment) => {
              setSelectedAppointment(appointment);
              setShowAppointmentModal(true);
            }}
          />
        );
      case 'chat-logs':
        return (
          <ChatLogsTab
            chatLogs={chatLogs.chatLogs}
            chatSessions={chatLogs.chatSessions}
            isLoading={chatLogs.isLoading}
            selectedSession={chatLogs.selectedSession}
            onRefresh={chatLogs.refreshChatData}
            onSelectSession={chatLogs.handleSelectSession}
            onViewAppointment={handleViewAppointment}
            onDeleteConversation={handleDeleteConversation}
          />
        );
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return (
          <SettingsTab
            appointmentSettings={settings.appointmentSettings}
            isLoading={settings.isLoading}
            onUpdateSettings={settings.updateSettings}
            onSaveSettings={settings.saveAppointmentSettings}
          />
        );
      default:
        return null;
    }
  };

  // Mobile: Bottom tab navigation with simplified interface
  const MobileAdminPanel = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 pb-20">
      <Header onLogout={handleLogout} />
      
      {/* Mobile Content */}
      <div className="px-4 py-4">
        {renderTabContent()}
      </div>

      {/* Mobile Bottom Navigation - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 z-50">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Modals */}
      <EditAppointmentModal
        editingAppointment={appointments.editingAppointment}
        editForm={appointments.editForm}
        isLoading={appointments.isLoading}
        onClose={appointments.closeEditModal}
        onSave={appointments.saveEditedAppointment}
        onFormChange={appointments.handleEditFormChange}
      />

      {/* NEW: Appointment Details Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
        onEdit={(appointment) => {
          appointments.openEditModal(appointment);
          setShowAppointmentModal(false);
        }}
        onDelete={(appointmentId) => {
          appointments.initiateDeleteAppointment(appointmentId);
          setShowAppointmentModal(false);
        }}
        onViewConversation={handleViewConversation}
      />

      <ConfirmationModal
        isOpen={appointments.showDeleteConfirmation}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 text-white hover:bg-red-700"
        onConfirm={appointments.confirmDeleteAppointment}
        onCancel={appointments.cancelDeleteAppointment}
      />

      <NotificationModal
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );

  // Tablet: Side navigation with optimized layout
  const TabletAdminPanel = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <Header onLogout={handleLogout} />
      
      <div className="flex">
        {/* Tablet Side Navigation */}
        <div className="w-20 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tablet Content */}
        <div className="flex-1 px-6 py-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      <EditAppointmentModal
        editingAppointment={appointments.editingAppointment}
        editForm={appointments.editForm}
        isLoading={appointments.isLoading}
        onClose={appointments.closeEditModal}
        onSave={appointments.saveEditedAppointment}
        onFormChange={appointments.handleEditFormChange}
      />

      {/* NEW: Appointment Details Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
        onEdit={(appointment) => {
          appointments.openEditModal(appointment);
          setShowAppointmentModal(false);
        }}
        onDelete={(appointmentId) => {
          appointments.initiateDeleteAppointment(appointmentId);
          setShowAppointmentModal(false);
        }}
        onViewConversation={handleViewConversation}
      />

      <ConfirmationModal
        isOpen={appointments.showDeleteConfirmation}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 text-white hover:bg-red-700"
        onConfirm={appointments.confirmDeleteAppointment}
        onCancel={appointments.cancelDeleteAppointment}
      />

      <NotificationModal
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );

  // Desktop: Full dashboard layout with all features (original design)
  const DesktopAdminPanel = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <Header onLogout={handleLogout} />
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderTabContent()}
      </div>

      {/* Modals */}
      <EditAppointmentModal
        editingAppointment={appointments.editingAppointment}
        editForm={appointments.editForm}
        isLoading={appointments.isLoading}
        onClose={appointments.closeEditModal}
        onSave={appointments.saveEditedAppointment}
        onFormChange={appointments.handleEditFormChange}
      />

      {/* NEW: Appointment Details Modal */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
        onEdit={(appointment) => {
          appointments.openEditModal(appointment);
          setShowAppointmentModal(false);
        }}
        onDelete={(appointmentId) => {
          appointments.initiateDeleteAppointment(appointmentId);
          setShowAppointmentModal(false);
        }}
        onViewConversation={handleViewConversation}
      />

      <ConfirmationModal
        isOpen={appointments.showDeleteConfirmation}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 text-white hover:bg-red-700"
        onConfirm={appointments.confirmDeleteAppointment}
        onCancel={appointments.cancelDeleteAppointment}
      />

      <NotificationModal
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileAdminPanel />}
      tablet={<TabletAdminPanel />}
      desktop={<DesktopAdminPanel />}
    />
  );
}