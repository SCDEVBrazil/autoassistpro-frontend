// Fixed src/app/admin/components/ChatLogsTab/utils/formatting.ts

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

// FIX: Match the session ID formatting used in AppointmentTable - show full numeric part
export const formatSessionId = (sessionId: string): string => {
  if (!sessionId) return 'N/A';
  
  const parts = sessionId.split('_');
  
  if (parts.length > 1) {
    // Return the full numeric part, stop at second underscore if exists
    const numericPart = parts[1];
    const secondUnderscoreIndex = numericPart.indexOf('_');
    if (secondUnderscoreIndex > 0) {
      return numericPart.substring(0, secondUnderscoreIndex);
    }
    return numericPart; // Return FULL numeric part
  }
  
  return sessionId;
};