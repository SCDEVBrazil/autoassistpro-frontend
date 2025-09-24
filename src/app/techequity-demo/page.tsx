// src/app/techequity-demo/page.tsx

'use client';

// Hooks
import { useChat } from './hooks/useChat';
import { useScheduling } from './hooks/useScheduling';
import { useFormData } from './hooks/useFormData';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';

// Components
import { DemoBanner } from './components/DemoBanner';
import { SiteHeader } from './components/SiteHeader';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { ChatWidget } from './components/ChatWidget';
import { SchedulingModal } from './components/SchedulingModal';

// Define interfaces for the component props
interface DemoPageProps {
  chat: ReturnType<typeof useChat>;
  scheduling: ReturnType<typeof useScheduling>;
  formData: ReturnType<typeof useFormData>;
  handleScheduleCall: () => void;
  handleBookingConfirmation: () => Promise<void>;
}

// CRITICAL FIX: Move component definitions OUTSIDE the main component function
// This prevents React from creating new component instances on every render

// Mobile: Simplified orchestration with mobile-specific hooks
const MobileTechEquityDemo = ({ 
  chat, scheduling, formData, handleScheduleCall, handleBookingConfirmation 
}: DemoPageProps) => (
  <div className="min-h-screen bg-white">
    <DemoBanner />
    <SiteHeader />
    <HeroSection />
    <ServicesSection />
    <AboutSection />
    <ContactSection />

    <ChatWidget
      isChatOpen={chat.isChatOpen}
      messages={chat.messages}
      inputValue={chat.inputValue}
      isLoading={chat.isLoading}
      showSchedulingPrompt={chat.showSchedulingPrompt}
      sessionId={chat.sessionId}
      userName={chat.userName}
      isNameCollected={chat.isNameCollected}
      messagesEndRef={chat.messagesEndRef as React.RefObject<HTMLDivElement>}
      lastUserMessageRef={chat.lastUserMessageRef as React.RefObject<HTMLDivElement>}
      setIsChatOpen={chat.setIsChatOpen}
      setInputValue={chat.setInputValue}
      handleOpenChat={chat.handleOpenChat}
      sendMessage={chat.sendMessage}
      handleKeyPress={chat.handleKeyPress}
      onScheduleCall={handleScheduleCall}
    />

    <SchedulingModal
      showSchedulingModal={scheduling.showSchedulingModal}
      formData={formData.formData}
      selectedDate={scheduling.selectedDate}
      selectedTime={scheduling.selectedTime}
      availableSlots={scheduling.availableSlots}
      isLoadingSlots={scheduling.isLoadingSlots}
      isBooking={scheduling.isBooking}
      handleInputChange={formData.handleInputChange}
      handlePhoneChange={formData.handlePhoneChange}
      setSelectedDate={scheduling.setSelectedDate}
      setSelectedTime={scheduling.setSelectedTime}
      closeSchedulingModal={scheduling.closeSchedulingModal}
      onBookingConfirmation={handleBookingConfirmation}
    />
  </div>
);

// Tablet: Hybrid approach
const TabletTechEquityDemo = ({ 
  chat, scheduling, formData, handleScheduleCall, handleBookingConfirmation 
}: DemoPageProps) => (
  <div className="min-h-screen bg-white">
    <DemoBanner />
    <SiteHeader />
    
    {/* Tablet optimized content flow with improved spacing */}
    <div className="space-y-8">
      <HeroSection />
      
      {/* Tablet content sections with container wrapping */}
      <div className="container mx-auto px-6 space-y-12">
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </div>
    </div>

    <ChatWidget
      isChatOpen={chat.isChatOpen}
      messages={chat.messages}
      inputValue={chat.inputValue}
      isLoading={chat.isLoading}
      showSchedulingPrompt={chat.showSchedulingPrompt}
      sessionId={chat.sessionId}
      userName={chat.userName}
      isNameCollected={chat.isNameCollected}
      messagesEndRef={chat.messagesEndRef as React.RefObject<HTMLDivElement>}
      lastUserMessageRef={chat.lastUserMessageRef as React.RefObject<HTMLDivElement>}
      setIsChatOpen={chat.setIsChatOpen}
      setInputValue={chat.setInputValue}
      handleOpenChat={chat.handleOpenChat}
      sendMessage={chat.sendMessage}
      handleKeyPress={chat.handleKeyPress}
      onScheduleCall={handleScheduleCall}
    />

    <SchedulingModal
      showSchedulingModal={scheduling.showSchedulingModal}
      formData={formData.formData}
      selectedDate={scheduling.selectedDate}
      selectedTime={scheduling.selectedTime}
      availableSlots={scheduling.availableSlots}
      isLoadingSlots={scheduling.isLoadingSlots}
      isBooking={scheduling.isBooking}
      handleInputChange={formData.handleInputChange}
      handlePhoneChange={formData.handlePhoneChange}
      setSelectedDate={scheduling.setSelectedDate}
      setSelectedTime={scheduling.setSelectedTime}
      closeSchedulingModal={scheduling.closeSchedulingModal}
      onBookingConfirmation={handleBookingConfirmation}
    />
  </div>
);

// Desktop: Full feature orchestration
const DesktopTechEquityDemo = ({ 
  chat, scheduling, formData, handleScheduleCall, handleBookingConfirmation 
}: DemoPageProps) => (
  <div className="min-h-screen bg-white">
    <DemoBanner />
    <SiteHeader />
    
    {/* Desktop full-featured layout maintaining original structure */}
    <main className="relative">
      <HeroSection />
      
      {/* Desktop content sections with original spacing */}
      <div className="space-y-16">
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </div>
    </main>

    <ChatWidget
      isChatOpen={chat.isChatOpen}
      messages={chat.messages}
      inputValue={chat.inputValue}
      isLoading={chat.isLoading}
      showSchedulingPrompt={chat.showSchedulingPrompt}
      sessionId={chat.sessionId}
      userName={chat.userName}
      isNameCollected={chat.isNameCollected}
      messagesEndRef={chat.messagesEndRef as React.RefObject<HTMLDivElement>}
      lastUserMessageRef={chat.lastUserMessageRef as React.RefObject<HTMLDivElement>}
      setIsChatOpen={chat.setIsChatOpen}
      setInputValue={chat.setInputValue}
      handleOpenChat={chat.handleOpenChat}
      sendMessage={chat.sendMessage}
      handleKeyPress={chat.handleKeyPress}
      onScheduleCall={handleScheduleCall}
    />

    <SchedulingModal
      showSchedulingModal={scheduling.showSchedulingModal}
      formData={formData.formData}
      selectedDate={scheduling.selectedDate}
      selectedTime={scheduling.selectedTime}
      availableSlots={scheduling.availableSlots}
      isLoadingSlots={scheduling.isLoadingSlots}
      isBooking={scheduling.isBooking}
      handleInputChange={formData.handleInputChange}
      handlePhoneChange={formData.handlePhoneChange}
      setSelectedDate={scheduling.setSelectedDate}
      setSelectedTime={scheduling.setSelectedTime}
      closeSchedulingModal={scheduling.closeSchedulingModal}
      onBookingConfirmation={handleBookingConfirmation}
    />
  </div>
);

export default function TechEquityDemo() {
  // Custom hooks
  const chat = useChat();
  const scheduling = useScheduling();
  const formData = useFormData();

  // Combined handler for scheduling call
  const handleScheduleCall = () => {
    scheduling.handleScheduleCall();
    formData.resetForm();
  };

  // Combined handler for booking confirmation
  const handleBookingConfirmation = async () => {
    await scheduling.handleBookingConfirmation(
      formData.formData,
      chat.sessionId, // Pass the chat session ID
      (dayName: string, time: string, email: string) => {
        chat.addSchedulingMessages(dayName, time, email);
      }
    );
  };

  // Pass all data and handlers to the static components
  const componentProps: DemoPageProps = {
    chat,
    scheduling,
    formData,
    handleScheduleCall,
    handleBookingConfirmation
  };

  return (
    <ResponsiveWrapper
      mobile={<MobileTechEquityDemo {...componentProps} />}
      tablet={<TabletTechEquityDemo {...componentProps} />}
      desktop={<DesktopTechEquityDemo {...componentProps} />}
    />
  );
}