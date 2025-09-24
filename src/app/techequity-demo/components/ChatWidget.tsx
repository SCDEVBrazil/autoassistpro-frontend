// src/app/techequity-demo/components/ChatWidget.tsx

'use client';

import { MessageCircle, Send, X, Bot, User, Calendar, ArrowLeft } from 'lucide-react';
import { Message } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFormFieldHeight } from '@/utils/deviceUtils';

interface ChatWidgetProps {
  isChatOpen: boolean;
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  showSchedulingPrompt: boolean;
  sessionId: string;
  userName: string;
  isNameCollected: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  lastUserMessageRef: React.RefObject<HTMLDivElement>;
  setIsChatOpen: (open: boolean) => void;
  setInputValue: (value: string) => void;
  handleOpenChat: () => void;
  sendMessage: () => void;
  handleKeyPress: (e: { key: string; shiftKey: boolean; preventDefault: () => void; }) => void;
  onScheduleCall: () => void;
}

// Define proper interface for component props
interface ChatComponentProps extends ChatWidgetProps {
  touchTargetSize: string;
  fieldHeight: string;
}

// CRITICAL FIX: Move component definitions OUTSIDE the main component function
// This prevents React from creating new component instances on every render

// Mobile: Full-screen chat experience with swipe gestures
const MobileChatWidget = ({ 
  isChatOpen, messages, inputValue, isLoading, showSchedulingPrompt, 
  sessionId, userName, isNameCollected, messagesEndRef, lastUserMessageRef,
  setIsChatOpen, setInputValue, handleOpenChat, sendMessage, handleKeyPress, onScheduleCall,
  touchTargetSize, fieldHeight
}: ChatComponentProps) => (
  <>
    {/* Mobile Chat Toggle Button */}
    {!isChatOpen && (
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50 active:scale-95"
        style={{ 
          width: touchTargetSize, 
          height: touchTargetSize,
          minWidth: touchTargetSize,
          minHeight: touchTargetSize
        }}
      >
        <MessageCircle className="w-6 h-6 mx-auto" />
      </button>
    )}

    {/* Mobile Full-Screen Chat */}
    {isChatOpen && (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Mobile Header */}
        <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setIsChatOpen(false)}
            className="text-blue-100 hover:text-white transition-colors mr-3"
            style={{ minHeight: touchTargetSize, minWidth: touchTargetSize }}
          >
            <ArrowLeft className="w-6 h-6 mx-auto" />
          </button>
          <div className="flex-1 text-center">
            <h3 className="font-semibold text-lg">
              {isNameCollected && userName ? `Chat with ${userName}` : 'TechEquity Assistant'}
            </h3>
            <p className="text-xs text-blue-100">Powered by AutoAssistPro</p>
            {sessionId && (
              <p className="text-xs text-blue-200">Session: {sessionId.split('_')[1]}</p>
            )}
          </div>
          <div style={{ width: touchTargetSize }}></div>
        </div>

        {/* Mobile Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((message: Message, index: number) => {
            const isLastUserMessage = message.type === 'user' && 
              messages.slice(index + 1).every((msg: Message) => msg.type === 'ai');
            
            return (
              <div 
                key={index} 
                ref={isLastUserMessage ? lastUserMessageRef : null}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {message.type === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                  </div>
                  <div className={`rounded-xl p-4 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}>
                    <p className="text-base whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white text-gray-800 border border-gray-200 rounded-xl p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mobile Scheduling Prompt */}
        {showSchedulingPrompt && (
          <div className="px-4 py-3 bg-gray-100 border-t border-gray-200">
            <button
              onClick={onScheduleCall}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl text-base font-medium transition-colors flex items-center justify-center gap-2"
              style={{ minHeight: touchTargetSize }}
            >
              <Calendar className="w-5 h-5" />
              Schedule Discovery Call
            </button>
          </div>
        )}

        {/* Mobile Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about our services..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-500"
              style={{ minHeight: fieldHeight }}
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                width: fieldHeight,
                height: fieldHeight,
                minWidth: fieldHeight,
                minHeight: fieldHeight
              }}
            >
              <Send className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);

// Tablet: Large overlay with tablet-optimized interactions
const TabletChatWidget = ({ 
  isChatOpen, messages, inputValue, isLoading, showSchedulingPrompt, 
  sessionId, userName, isNameCollected, messagesEndRef, lastUserMessageRef,
  setIsChatOpen, setInputValue, handleOpenChat, sendMessage, handleKeyPress, onScheduleCall,
  touchTargetSize, fieldHeight
}: ChatComponentProps) => (
  <>
    {/* Tablet Chat Toggle Button */}
    {!isChatOpen && (
      <button
        onClick={handleOpenChat}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 z-50"
        style={{ 
          width: touchTargetSize, 
          height: touchTargetSize,
          minWidth: touchTargetSize,
          minHeight: touchTargetSize
        }}
      >
        <MessageCircle className="w-7 h-7 mx-auto" />
      </button>
    )}

    {/* Tablet Large Overlay */}
    {isChatOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
          {/* Tablet Header */}
          <div className="bg-blue-600 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-7 h-7" />
              <div>
                <h3 className="font-semibold text-lg">
                  {isNameCollected && userName ? `Chat with ${userName}` : 'TechEquity Assistant'}
                </h3>
                <p className="text-sm text-blue-100">Powered by AutoAssistPro</p>
                {sessionId && (
                  <p className="text-xs text-blue-200">Session: {sessionId.split('_')[1]}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-blue-100 hover:text-white transition-colors"
              style={{ 
                width: '40px', 
                height: '40px',
                minWidth: '40px',
                minHeight: '40px'
              }}
            >
              <X className="w-6 h-6 mx-auto" />
            </button>
          </div>

          {/* Tablet Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((message: Message, index: number) => {
              const isLastUserMessage = message.type === 'user' && 
                messages.slice(index + 1).every((msg: Message) => msg.type === 'ai');
              
              return (
                <div 
                  key={index} 
                  ref={isLastUserMessage ? lastUserMessageRef : null}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Tablet Scheduling Prompt */}
          {showSchedulingPrompt && (
            <div className="px-5 py-3 bg-gray-100 border-t border-gray-200">
              <button
                onClick={onScheduleCall}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Schedule Discovery Call
              </button>
            </div>
          )}

          {/* Tablet Input */}
          <div className="p-5 border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our services..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  minWidth: '40px',
                  minHeight: '40px'
                }}
              >
                <Send className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
);

// Desktop: Fixed-position widget with desktop interactions
const DesktopChatWidget = ({ 
  isChatOpen, messages, inputValue, isLoading, showSchedulingPrompt, 
  sessionId, userName, isNameCollected, messagesEndRef, lastUserMessageRef,
  setIsChatOpen, setInputValue, handleOpenChat, sendMessage, handleKeyPress, onScheduleCall
}: ChatComponentProps) => (
  <>
    {/* Desktop Chat Toggle Button */}
    {!isChatOpen && (
      <button
        onClick={handleOpenChat}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )}

    {/* Desktop Fixed Widget */}
    {isChatOpen && (
      <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
        {/* Desktop Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">
                {isNameCollected && userName ? `Chat with ${userName}` : 'TechEquity Assistant'}
              </h3>
              <p className="text-sm text-blue-100">Powered by AutoAssistPro</p>
              {sessionId && (
                <p className="text-xs text-blue-200">Session: {sessionId.split('_')[1]}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="text-blue-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((message: Message, index: number) => {
            const isLastUserMessage = message.type === 'user' && 
              messages.slice(index + 1).every((msg: Message) => msg.type === 'ai');
            
            return (
              <div 
                key={index} 
                ref={isLastUserMessage ? lastUserMessageRef : null}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Desktop Scheduling Prompt */}
        {showSchedulingPrompt && (
          <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
            <button
              onClick={onScheduleCall}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              Schedule Discovery Call
            </button>
          </div>
        )}

        {/* Desktop Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about our services..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);

export const ChatWidget = ({
  isChatOpen,
  messages,
  inputValue,
  isLoading,
  showSchedulingPrompt,
  sessionId,
  userName,
  isNameCollected,
  messagesEndRef,
  lastUserMessageRef,
  setIsChatOpen,
  setInputValue,
  handleOpenChat,
  sendMessage,
  handleKeyPress,
  onScheduleCall
}: ChatWidgetProps) => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);
  const fieldHeight = getFormFieldHeight(deviceType);

  // Pass all props to the static components with proper typing
  const componentProps: ChatComponentProps = {
    isChatOpen,
    messages,
    inputValue,
    isLoading,
    showSchedulingPrompt,
    sessionId,
    userName,
    isNameCollected,
    messagesEndRef,
    lastUserMessageRef,
    setIsChatOpen,
    setInputValue,
    handleOpenChat,
    sendMessage,
    handleKeyPress,
    onScheduleCall,
    touchTargetSize,
    fieldHeight
  };

  return (
    <ResponsiveWrapper
      mobile={<MobileChatWidget {...componentProps} />}
      tablet={<TabletChatWidget {...componentProps} />}
      desktop={<DesktopChatWidget {...componentProps} />}
    />
  );
};