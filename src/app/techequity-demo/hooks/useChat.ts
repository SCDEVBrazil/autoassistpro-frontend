// src/app/techequity-demo/hooks/useChat.ts
// PHASE 2 CHUNK 5: PARALLEL TESTING (Side-by-Side n8n vs Custom Route)
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

// Debug logger with color coding and timestamps
const sessionLogger = {
  info: (msg: string, data?: any) => {
    console.log(`🔵 [SESSION DEBUG] ${new Date().toISOString()} - ${msg}`, data || '');
  },
  warn: (msg: string, data?: any) => {
    console.warn(`🟡 [SESSION WARN] ${new Date().toISOString()} - ${msg}`, data || '');
  },
  error: (msg: string, data?: any) => {
    console.error(`🔴 [SESSION ERROR] ${new Date().toISOString()} - ${msg}`, data || '');
  },
  success: (msg: string, data?: any) => {
    console.log(`🟢 [SESSION SUCCESS] ${new Date().toISOString()} - ${msg}`, data || '');
  },
  // NEW: Comparison logger for parallel testing
  compare: (msg: string, data?: any) => {
    console.log(`🔶 [COMPARISON] ${new Date().toISOString()} - ${msg}`, data || '');
  }
};

export const useChat = () => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: 'Hello! To get started, please tell me your first and last name.'
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSchedulingPrompt, setShowSchedulingPrompt] = useState<boolean>(false);
  
  // Session management state with debugging
  const [sessionId, setSessionId] = useState<string>('');
  const [isFirstMessage, setIsFirstMessage] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('');
  const [isNameCollected, setIsNameCollected] = useState<boolean>(false);
  
  // Refs for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);
  
  // DEBUGGING: Track session ID changes
  const previousSessionId = useRef<string>('');
  
  useEffect(() => {
    if (sessionId !== previousSessionId.current) {
      sessionLogger.info(`Session ID changed from "${previousSessionId.current}" to "${sessionId}"`);
      sessionLogger.info(`Device type: ${deviceType}`);
      previousSessionId.current = sessionId;
    }
  }, [sessionId, deviceType]);

  // DEBUGGING: Monitor component lifecycle
  useEffect(() => {
    sessionLogger.info(`useChat hook initialized for device: ${deviceType}`);
    sessionLogger.info(`Current session ID on init: "${sessionId}"`);
    
    return () => {
      sessionLogger.info(`useChat hook cleanup for device: ${deviceType}`);
      sessionLogger.info(`Session ID on cleanup: "${sessionId}"`);
    };
  }, [deviceType, sessionId]);

  // FIXED: Better session persistence with multiple fallbacks
  useEffect(() => {
    sessionLogger.info('Initializing session persistence...');
    
    const initializeSession = () => {
      try {
        // Only try to restore session if we don't already have one
        if (sessionId && sessionId.startsWith('session_')) {
          sessionLogger.info('Session already exists, skipping initialization');
          return;
        }

        // Try to get stored session
        const savedSessionId = sessionStorage.getItem('chat-session-id');
        if (savedSessionId && savedSessionId.startsWith('session_')) {
          sessionLogger.info(`Found stored session: "${savedSessionId}" - will validate when chat opens`);
          return;
        }
        
        sessionLogger.info('No existing session found - will create new one when chat opens');
        
      } catch (error) {
        sessionLogger.error('Error during session initialization:', error);
      }
    };
    
    initializeSession();
  }, []); // Empty dependency array - run only once on mount

  // FIXED: Enhanced session saving that runs on every change
  useEffect(() => {
    if (sessionId && sessionId.startsWith('session_')) {
      try {
        // Save to multiple places for redundancy
        sessionStorage.setItem('chat-session-id', sessionId);
        
        // Update URL parameter
        const url = new URL(window.location.href);
        url.searchParams.set('sessionId', sessionId);
        window.history.replaceState({}, '', url.toString());
        
        sessionLogger.success(`Session ID persisted: "${sessionId}"`);
      } catch (error) {
        sessionLogger.error('Error persisting session ID:', error);
      }
    }
  }, [sessionId]);

  // Device-aware name validation
  const extractName = (input: string): { firstName: string; lastName: string } | null => {
    const words = input.trim().split(/\s+/);
    
    if (deviceType === 'mobile') {
      if (words.length >= 2) {
        return {
          firstName: words[0],
          lastName: words.slice(1).join(' ')
        };
      }
      if (words.length === 1 && words[0].length >= 2) {
        return {
          firstName: words[0],
          lastName: ''
        };
      }
    } else if (deviceType === 'tablet') {
      if (words.length >= 2) {
        return {
          firstName: words[0],
          lastName: words.slice(1).join(' ')
        };
      }
      if (words.length === 1 && words[0].length >= 3) {
        return {
          firstName: words[0],
          lastName: ''
        };
      }
    } else {
      if (words.length >= 2) {
        return {
          firstName: words[0],
          lastName: words.slice(1).join(' ')
        };
      }
    }
    return null;
  };

  // FIXED: Message logging with session tracking
  const logMessage = async (messageType: 'user' | 'ai', content: string, userInfo?: any): Promise<void> => {
    if (!sessionId) {
      sessionLogger.error('Attempted to log message without session ID');
      return;
    }

    sessionLogger.info(`Logging ${messageType} message for session: "${sessionId}"`);
    
    try {
      const logPayload = {
        clientId: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || 'client_techequity_001',
        sessionId: sessionId,
        messageType,
        content,
        userInfo,
        deviceType,
        timestamp: new Date().toISOString()
      };

      sessionLogger.info('Sending log payload:', logPayload);

      const response = await fetch('/api/chat-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logPayload),
      });

      const result = await response.json();
      
      if (result.success) {
        sessionLogger.success(`Message logged successfully for session: "${sessionId}"`);
      } else {
        sessionLogger.error('Failed to log message:', result.error);
      }
    } catch (error) {
      sessionLogger.error('Error logging message:', error);
    }
  };

  // FIXED: Enhanced session creation with better persistence
  const createNewSession = (): string => {
    // Clear any existing session data first to prevent conflicts
    try {
      sessionStorage.removeItem('chat-session-id');
      const url = new URL(window.location.href);
      url.searchParams.delete('sessionId');
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      sessionLogger.error('Error clearing old session:', error);
    }

    // Create completely unique session ID
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 15);
    const newSessionId = `session_${timestamp}_${randomPart}`;
    
    sessionLogger.success(`Created new session ID: "${newSessionId}"`);
    
    try {
      sessionStorage.setItem('chat-session-id', newSessionId);
      
      const url = new URL(window.location.href);
      url.searchParams.set('sessionId', newSessionId);
      window.history.replaceState({}, '', url.toString());
      
      sessionLogger.success(`New session persisted: "${newSessionId}"`);
    } catch (error) {
      sessionLogger.error('Error persisting new session:', error);
    }
    
    return newSessionId;
  };

  // Load conversation history
  const loadConversationHistory = async (sessionId: string): Promise<void> => {
    sessionLogger.info(`Loading conversation history for session: "${sessionId}"`);
    
    try {
      const response = await fetch(`/api/chat-logs?client=techequity&sessionId=${sessionId}`);
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        sessionLogger.success(`Loaded ${result.data.length} messages for session: "${sessionId}"`);
        
        const loadedMessages: Message[] = result.data.map((log: any) => ({
          type: log.messageType,
          content: log.content
        }));
        
        const lastUserMessage = result.data
          .reverse()
          .find((log: any) => log.messageType === 'user' && log.userInfo?.userName);
        
        if (lastUserMessage && lastUserMessage.userInfo?.userName) {
          setUserName(lastUserMessage.userInfo.userName);
          setIsNameCollected(true);
          sessionLogger.success(`Restored user name: "${lastUserMessage.userInfo.userName}"`);
        }
        
        setMessages(loadedMessages);
      } else {
        sessionLogger.info('No existing messages found, starting fresh');
        setMessages([{
          type: 'ai',
          content: 'Hello! To get started, please tell me your first and last name.'
        }]);
      }
    } catch (error) {
      sessionLogger.error('Error loading conversation history:', error);
      setMessages([{
        type: 'ai',
        content: 'Hello! To get started, please tell me your first and last name.'
      }]);
    }
  };

  // FIXED: Enhanced handleOpenChat that prevents duplicate sessions
  const handleOpenChat = (): void => {
    sessionLogger.info(`Opening chat (device: ${deviceType})`);
    setIsChatOpen(true);
    
    // Check if we already have a valid session
    if (sessionId && sessionId.startsWith('session_')) {
      sessionLogger.info(`Using existing session: "${sessionId}"`);
      loadConversationHistory(sessionId);
      return;
    }
    
    // Check if there's a stored session, but validate it exists in the backend
    try {
      const storedSessionId = sessionStorage.getItem('chat-session-id');
      
      if (storedSessionId && storedSessionId.startsWith('session_')) {
        sessionLogger.info(`Found stored session: "${storedSessionId}"`);
        
        // Validate if this session actually exists in the backend
        fetch(`/api/chat-logs?client=techequity&sessionId=${storedSessionId}&limit=1`)
          .then(response => response.json())
          .then(result => {
            if (result.success && result.data.length > 0) {
              sessionLogger.success(`Validated existing session: "${storedSessionId}"`);
              setSessionId(storedSessionId);
              loadConversationHistory(storedSessionId);
            } else {
              sessionLogger.info(`Stored session not found in backend, creating new session`);
              const newSessionId = createNewSession();
              setSessionId(newSessionId);
              
              // FIXED: Wait for state update before logging
              setTimeout(() => {
                // Don't log here - the initial message is already in state
                sessionLogger.info('New session created, initial message already displayed');
              }, 100);
            }
          })
          .catch(error => {
            sessionLogger.error('Error validating stored session:', error);
            const newSessionId = createNewSession();
            setSessionId(newSessionId);
            
            // FIXED: Wait for state update before logging
            setTimeout(() => {
              // Don't log here - the initial message is already in state
              sessionLogger.info('New session created after error, initial message already displayed');
            }, 100);
          });
        
        return;
      }
    } catch (error) {
      sessionLogger.error('Error checking stored session:', error);
    }
    
    // No valid stored session, create new one
    const newSessionId = createNewSession();
    setSessionId(newSessionId);
    
    // FIXED: Don't log the initial message - it's already in the messages state
    // The initial "Hello! To get started..." message is set in useState initialization
    sessionLogger.info('New session created, initial message already displayed');
  };

  // ========================================================================
  // PHASE 2 CHUNK 5: PARALLEL TESTING - SEND TO BOTH ENDPOINTS
  // ========================================================================
  const sendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || isLoading) return;
    
    sessionLogger.info(`Sending message with session: "${sessionId}"`);
    
    const messageContent = inputValue.trim();
    setInputValue('');
    
    const userMessage: Message = {
      type: 'user',
      content: messageContent
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Handle name collection (same as before)
      if (!isNameCollected) {
        const nameInfo = extractName(messageContent);
        if (nameInfo && (nameInfo.firstName.length >= 2)) {
          const fullName = nameInfo.lastName 
            ? `${nameInfo.firstName} ${nameInfo.lastName}`
            : nameInfo.firstName;
          
          setUserName(fullName);
          setIsNameCollected(true);
          
          sessionLogger.success(`Name collected: "${fullName}" for session: "${sessionId}"`);
          
          const confirmMessage: Message = {
            type: 'ai',
            content: `Nice to meet you, ${fullName}! How can our team help you today?`
          };
          setMessages(prev => [...prev, confirmMessage]);
          
          await logMessage('user', messageContent, { userName: fullName, firstName: nameInfo.firstName, lastName: nameInfo.lastName });
          await logMessage('ai', confirmMessage.content);
          
          setIsLoading(false);
          return;
        } else {
          const retryMessage: Message = {
            type: 'ai',
            content: 'Could you please provide both your first and last name?'
          };
          setMessages(prev => [...prev, retryMessage]);
          await logMessage('ai', retryMessage.content);
          setIsLoading(false);
          return;
        }
      } else {
        await logMessage('user', messageContent);
      }

      // ====================================================================
      // PHASE 2 CHUNK 6: SWITCHED TO CUSTOM /api/ai-chat ROUTE
      // ====================================================================
      sessionLogger.info(`Sending AI request to custom /api/ai-chat endpoint`);
      
      // Prepare request payload
      const requestPayload = {
        clientId: process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID || 'client_techequity_001',
        query: messageContent,
        sessionId: sessionId,
        userName: userName || `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} User`,
        deviceType: deviceType
      };

      // Call custom API endpoint
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      
      if (!jsonData.success || !jsonData.response) {
        throw new Error(jsonData.error || 'No response from AI');
      }

      const cleanResponse = jsonData.response;
      
      // Log metadata for debugging
      if (jsonData.metadata) {
        sessionLogger.info('Response metadata:', jsonData.metadata);
      }

      const aiMessage: Message = {
        type: 'ai',
        content: cleanResponse
      };

      setMessages(prev => [...prev, aiMessage]);
      await logMessage('ai', cleanResponse);

      // Check for scheduling prompt
      if (!showSchedulingPrompt && isNameCollected) {
        const serviceKeywords = ['service', 'solution', 'help', 'support', 'consulting', 'cybersecurity', 'operations'];
        const messageContainsServices = serviceKeywords.some(keyword => 
          messageContent.toLowerCase().includes(keyword) || cleanResponse.toLowerCase().includes(keyword)
        );
        
        if (messageContainsServices) {
          setShowSchedulingPrompt(true);
        }
      }

    } catch (error) {
      sessionLogger.error('Error sending message:', error);
      
      const errorMessage: Message = {
        type: 'ai',
        content: 'I apologize, but I encountered a technical error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
      await logMessage('ai', errorMessage.content);
    } finally {
      setIsLoading(false);
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: { key: string; shiftKey: boolean; preventDefault: () => void }): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Device-aware scheduling message configuration
  const addSchedulingMessages = (confirmationData: { date: string; time: string; email: string }): void => {
    const { date, time, email } = confirmationData;
    
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    const schedulingMessages = {
      mobile: `Great! Your call is set for ${dayName} at ${time}. Check ${email} for details.`,
      tablet: `Perfect! I've successfully scheduled your discovery call for ${dayName} at ${time}. You'll receive a detailed confirmation email at ${email} with the meeting link and agenda. Looking forward to discussing how we can help your business grow!`,
      desktop: `Excellent! Your discovery call has been successfully scheduled for ${dayName} at ${time}. You will receive a comprehensive confirmation email at ${email} containing the meeting details, agenda, and a calendar invitation. Our team is looking forward to discussing your business needs and exploring how our expertise can drive meaningful results for your organization.`
    };
    
    const confirmationMessage: Message = {
      type: 'ai',
      content: schedulingMessages[deviceType]
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
    logMessage('ai', confirmationMessage.content);
    setShowSchedulingPrompt(false);
    
    sessionLogger.success(`Scheduling confirmation sent for session: "${sessionId}"`);
  };

  // Session cleanup function for development
  const clearSession = () => {
    try {
      // Clear all storage locations
      localStorage.removeItem('chat-session-id');
      sessionStorage.removeItem('chat-session-id');
      
      // Clear URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('sessionId');
      window.history.replaceState({}, '', url.toString());
      
      // Reset all state
      setSessionId('');
      setUserName('');
      setIsNameCollected(false);
      setMessages([{
        type: 'ai',
        content: 'Hello! To get started, please tell me your first and last name.'
      }]);
      
      sessionLogger.success('Session cleared completely - next chat will get new unique ID');
    } catch (error) {
      sessionLogger.error('Error clearing session:', error);
    }
  };

  // DEBUG: Return session info for external inspection
  const getDebugInfo = () => ({
    sessionId,
    deviceType,
    messagesCount: messages.length,
    isNameCollected,
    userName,
    showSchedulingPrompt
  });

  return {
    // Core state
    isChatOpen,
    setIsChatOpen,
    messages,
    inputValue,
    setInputValue,
    isLoading,
    showSchedulingPrompt,
    sessionId,
    userName,
    isNameCollected,
    messagesEndRef,
    lastUserMessageRef,
    
    // Core functions
    handleOpenChat,
    sendMessage,
    handleKeyPress,
    addSchedulingMessages,
    
    // DEBUG functions (you can remove these in production)
    getDebugInfo,
    clearSession
  };
};