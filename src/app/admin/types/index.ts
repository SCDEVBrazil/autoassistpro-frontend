// src/app/admin/types/index.ts

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

export interface AppointmentSettings {
  duration: number;
  bufferTime: number;
  advanceNotice: number;
  maxBookingWindow: number;
}

export interface Appointment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  chatSessionId?: string; // Link to chat conversation
  createdAt?: string;
  updatedAt?: string;
}

export interface BlackoutDate {
  id: number;
  date: string;
  reason: string;
}

export interface Notification {
  type: 'success' | 'error';
  message: string;
}

export interface EditAppointmentForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  date: string;
  time: string;
  status: string;
}

export interface ChatLog {
  id: number;
  clientId: string;
  sessionId: string;
  messageType: 'user' | 'ai';
  content: string;
  userInfo?: any;
  timestamp: string;
  createdAt: string;
}

export interface ChatSession {
  sessionId: string;
  messageCount: number;
  firstMessage: string;
  lastActivity: string;
  duration: string;
  hasAppointment: boolean;
}

export type ActiveTab = 'availability' | 'bookings' | 'settings' | 'chat-logs' | 'analytics';