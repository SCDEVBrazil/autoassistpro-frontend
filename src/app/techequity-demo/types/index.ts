// src/app/techequity-demo/types/index.ts

export interface Message {
  type: 'user' | 'ai';
  content: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
}

export interface TimeSlot {
  time: string;
  value: string;
}

export interface DateSlot {
  date: string;
  dayName: string;
  slots: TimeSlot[];
}

export interface AvailableSlots extends Array<DateSlot> {}