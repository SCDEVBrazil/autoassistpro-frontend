// src/app/admin/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { ActiveTab, Notification } from './types';
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
import { NotificationModal } from './components/NotificationModal';
import { ConfirmationModal } from './components/ConfirmationModal';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('availability');
  const [notification, setNotification] = useState<Notification | null>(null);

  // Authentication hook
  const { isAuthenticated, loginForm, handleLogin, handleLogout, updateLoginForm } = useAuth();

  // Custom hooks for data management
  const appointments = useAppointments(setNotification);
  const availability = useAvailability(setNotification);
  const settings = useSettings(setNotification);
  const chatLogs = useChatLogs(setNotification);

  // Navigation handlers for cross-linking between tabs
  const handleViewConversation = (sessionId: string) => {
    setActiveTab('chat-logs');
    setTimeout(() => {
      chatLogs.handleSelectSession(sessionId);
    }, 100);
  };

  const handleViewAppointment = (appointmentId: number) => {
    setActiveTab('bookings');
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

  // Polling effect for appointments and chat logs
  useEffect(() => {
    if (isAuthenticated && (activeTab === 'bookings' || activeTab === 'chat-logs')) {
      const pollInterval = setInterval(() => {
        if (activeTab === 'bookings') {
          appointments.loadScheduledCalls();
        } else if (activeTab === 'chat-logs') {
          chatLogs.loadAllChatData();
        }
      }, 60000);

      return () => clearInterval(pollInterval);
    }
  }, [isAuthenticated, activeTab]);

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

  // Tablet: Side navigation with condensed panels
  const TabletAdminPanel = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <Header onLogout={handleLogout} />
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tablet content with medium padding */}
      <div className="max-w-6xl mx-auto px-4 py-6">
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