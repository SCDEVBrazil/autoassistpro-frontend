// src/app/techequity-demo/hooks/useChat.ts
// COMPLETE FIXED VERSION WITH PROPER SESSION PERSISTENCE
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
      sessionLogger.info(`Component re-render caused session change`);
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
  }, []);

  // FIXED: Better session persistence with multiple fallbacks
  useEffect(() => {
    sessionLogger.info('Initializing session persistence...');
    
    const initializeSession = () => {
      try {
        // Method 1: Try localStorage first
        const savedSessionId = localStorage.getItem('chat-session-id');
        if (savedSessionId && savedSessionId.startsWith('session_')) {
          sessionLogger.success(`Restored session from localStorage: "${savedSessionId}"`);
          setSessionId(savedSessionId);
          loadConversationHistory(savedSessionId);
          return;
        }
        
        // Method 2: Try sessionStorage as backup
        const sessionStorageId = sessionStorage.getItem('chat-session-id');
        if (sessionStorageId && sessionStorageId.startsWith('session_')) {
          sessionLogger.success(`Restored session from sessionStorage: "${sessionStorageId}"`);
          setSessionId(sessionStorageId);
          // Also save to localStorage for future use
          localStorage.setItem('chat-session-id', sessionStorageId);
          loadConversationHistory(sessionStorageId);
          return;
        }
        
        // Method 3: Check URL parameters for session ID
        const urlParams = new URLSearchParams(window.location.search);
        const urlSessionId = urlParams.get('sessionId');
        if (urlSessionId && urlSessionId.startsWith('session_')) {
          sessionLogger.success(`Found session in URL parameters: "${urlSessionId}"`);
          setSessionId(urlSessionId);
          // Save to both storages
          localStorage.setItem('chat-session-id', urlSessionId);
          sessionStorage.setItem('chat-session-id', urlSessionId);
          loadConversationHistory(urlSessionId);
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
        localStorage.setItem('chat-session-id', sessionId);
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
        clientId: 'techequity',
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
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substr(2, 9);
    const newSessionId = `session_${timestamp}_${randomPart}`;
    
    sessionLogger.success(`Created new session ID: "${newSessionId}"`);
    sessionLogger.info(`Device type: ${deviceType}`);
    sessionLogger.info(`Timestamp: ${timestamp}`);
    sessionLogger.info(`Random part: ${randomPart}`);
    
    // CRITICAL: Save to multiple places immediately
    try {
      localStorage.setItem('chat-session-id', newSessionId);
      sessionStorage.setItem('chat-session-id', newSessionId);
      
      // Also add to URL for better tracking
      const url = new URL(window.location.href);
      url.searchParams.set('sessionId', newSessionId);
      window.history.replaceState({}, '', url.toString());
      
      sessionLogger.success('Session ID saved to all storage methods');
    } catch (error) {
      sessionLogger.error('Error saving session ID:', error);
    }
    
    return newSessionId;
  };

  // FIXED: Load conversation history with debugging
  const loadConversationHistory = async (sessionIdToLoad: string): Promise<void> => {
    sessionLogger.info(`Loading conversation history for session: "${sessionIdToLoad}"`);
    
    try {
      const response = await fetch(`/api/chat-logs?client=techequity&sessionId=${sessionIdToLoad}&limit=50`);
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        sessionLogger.success(`Loaded ${result.data.length} messages for session: "${sessionIdToLoad}"`);
        
        const loadedMessages: Message[] = result.data.map((log: any) => ({
          type: log.messageType as 'user' | 'ai',
          content: log.content
        }));
        
        setMessages(loadedMessages);
        
        // Check if name was already collected
        const userMessages = result.data.filter((log: any) => log.messageType === 'user');
        if (userMessages.length > 0 && userMessages[0].userInfo?.userName) {
          setUserName(userMessages[0].userInfo.userName);
          setIsNameCollected(true);
          sessionLogger.success(`Restored user name: "${userMessages[0].userInfo.userName}"`);
        }
      } else {
        sessionLogger.info(`No existing conversation found for session: "${sessionIdToLoad}"`);
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
    
    // Check storage one more time before creating new session
    try {
      const storedSessionId = localStorage.getItem('chat-session-id') || 
                             sessionStorage.getItem('chat-session-id');
      
      if (storedSessionId && storedSessionId.startsWith('session_')) {
        sessionLogger.success(`Found stored session during chat open: "${storedSessionId}"`);
        setSessionId(storedSessionId);
        loadConversationHistory(storedSessionId);
        return;
      }
    } catch (error) {
      sessionLogger.error('Error checking stored session:', error);
    }
    
    // Only create new session if absolutely necessary
    const newSessionId = createNewSession();
    setSessionId(newSessionId);
    
    setTimeout(() => {
      logMessage('ai', 'Hello! To get started, please tell me your first and last name.');
    }, 100);
  };

  // Send message function
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
      // Handle name collection
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

      // Send to AI
      sessionLogger.info(`Sending AI request for session: "${sessionId}"`);
      
      const response = await fetch('https://n8n-production-26f5.up.railway.app/webhook/44a5dd65-4e87-4e02-bc22-b5fe27350fd6', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: messageContent,
          sessionId: sessionId,
          userName: userName || `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} User`,
          deviceType: deviceType,
          isTouchDevice: isTouchDevice
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      let cleanResponse = responseText;

      try {
        const jsonResponse = JSON.parse(responseText);
        if (jsonResponse.response) {
          cleanResponse = jsonResponse.response;
        }
      } catch (e) {
        // Use raw text response
      }

      cleanResponse = cleanResponse.replace(/^["']|["']$/g, '');

      const aiMessage: Message = {
        type: 'ai',
        content: cleanResponse
      };

      setMessages(prev => [...prev, aiMessage]);
      await logMessage('ai', cleanResponse);

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
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = (): void => {
    if (deviceType === 'mobile') {
      if (lastUserMessageRef.current) {
        lastUserMessageRef.current.scrollIntoView({ block: 'start' });
      } else {
        messagesEndRef.current?.scrollIntoView({ block: 'end' });
      }
    } else {
      if (lastUserMessageRef.current) {
        lastUserMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (deviceType === 'tablet') {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToBottom();
    }
  }, [messages, deviceType]);

  // Key press handler
  const handleKeyPress = (e: { key: string; shiftKey: boolean; preventDefault: () => void }): void => {
    if (e.key === 'Enter') {
      if (deviceType === 'desktop') {
        if (e.shiftKey) {
          return;
        } else {
          e.preventDefault();
          sendMessage();
        }
      } else if (deviceType === 'tablet') {
        if (e.shiftKey) {
          return;
        } else {
          e.preventDefault();
          sendMessage();
        }
      } else {
        if (!e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      }
    }
  };

  // Add scheduling messages
  const addSchedulingMessages = (dayName: string, time: string, email: string): void => {
    const schedulingMessages = {
      mobile: `Great! I've scheduled your call for ${dayName} at ${time}. You'll receive a confirmation at ${email}.`,
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
      localStorage.removeItem('chat-session-id');
      sessionStorage.removeItem('chat-session-id');
      
      const url = new URL(window.location.href);
      url.searchParams.delete('sessionId');
      window.history.replaceState({}, '', url.toString());
      
      setSessionId('');
      setUserName('');
      setIsNameCollected(false);
      setMessages([{
        type: 'ai',
        content: 'Hello! To get started, please tell me your first and last name.'
      }]);
      
      sessionLogger.success('Session cleared completely');
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