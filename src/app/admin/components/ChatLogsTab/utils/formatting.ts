// src/app/admin/components/ChatLogsTab/utils/formatting.ts

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

export const formatSessionId = (sessionId: string): string => {
  return sessionId.split('_')[1]?.substring(0, 8) || sessionId.substring(0, 8);
};