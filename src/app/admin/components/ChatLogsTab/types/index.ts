// src/app/admin/components/ChatLogsTab/types/index.ts

import { ChatLog } from '../../../types';

export interface ConversationBox {
  sessionId: string;
  userName: string;
  messageCount: number;
  firstMessage: string;
  lastActivity: string;
  duration: string;
  hasAppointment: boolean;
  messages: ChatLog[];
  appointmentId?: number;
}