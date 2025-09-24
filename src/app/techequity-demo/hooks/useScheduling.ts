// src/app/techequity-demo/hooks/useScheduling.ts

import { useState } from 'react';
import { FormData, AvailableSlots, DateSlot, TimeSlot } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const useScheduling = () => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  const [showSchedulingModal, setShowSchedulingModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<number>(0);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlots>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  // Device-aware slot loading with different retry strategies
  const loadAvailableSlots = async (): Promise<void> => {
    try {
      setIsLoadingSlots(true);
      
      // Device-specific retry configuration
      const retryConfig = {
        mobile: { maxRetries: 2, delay: 1000, timeout: 8000 },
        tablet: { maxRetries: 3, delay: 750, timeout: 6000 },
        desktop: { maxRetries: 3, delay: 500, timeout: 5000 }
      };

      const { maxRetries, delay, timeout } = retryConfig[deviceType];

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          // Device-specific slot limits for performance
          const slotLimits = {
            mobile: 7,    // 1 week for mobile
            tablet: 10,   // 10 days for tablet
            desktop: 14   // 2 weeks for desktop
          };

          const days = slotLimits[deviceType];
          const response = await fetch(`/api/availability/check?client=techequity&days=${days}`, {
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          const result = await response.json();
          
          if (result.success) {
            // Device-specific slot processing
            let processedSlots = result.data.availableSlots;
            
            if (deviceType === 'mobile') {
              // Mobile: Limit to 3 time slots per day for better UX
              processedSlots = processedSlots.map((dateSlot: DateSlot) => ({
                ...dateSlot,
                slots: dateSlot.slots.slice(0, 3)
              }));
            } else if (deviceType === 'tablet') {
              // Tablet: Limit to 5 time slots per day
              processedSlots = processedSlots.map((dateSlot: DateSlot) => ({
                ...dateSlot,
                slots: dateSlot.slots.slice(0, 5)
              }));
            }
            // Desktop: Show all available slots
            
            setAvailableSlots(processedSlots);
            console.log(`Loaded slots for ${deviceType}: ${processedSlots.length} days`);
            break;
          } else {
            console.error('Failed to load available slots:', result.error);
            if (attempt === maxRetries - 1) {
              setAvailableSlots([]);
            }
          }
        } catch (error) {
          console.error(`Failed to load slots (attempt ${attempt + 1}):`, error);
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
          } else {
            setAvailableSlots([]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Device-aware appointment saving with optimized error handling
  const saveAppointment = async (selectedDateSlot: DateSlot, selectedTimeSlot: TimeSlot, formData: FormData, sessionId?: string): Promise<boolean> => {
    try {
      // Device-specific timeout and retry configuration
      const saveConfig = {
        mobile: { timeout: 10000, showProgress: true },
        tablet: { timeout: 8000, showProgress: false },
        desktop: { timeout: 6000, showProgress: false }
      };

      const { timeout, showProgress } = saveConfig[deviceType];
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Device-specific request payload
      const requestPayload = {
        clientId: 'techequity',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        interest: formData.interest,
        date: selectedDateSlot.date,
        time: selectedTimeSlot.time,
        chatSessionId: sessionId || null,
        // Device context for analytics
        deviceType: deviceType,
        isTouchDevice: isTouchDevice,
        bookingMethod: deviceType === 'mobile' ? 'mobile_wizard' : 
                      deviceType === 'tablet' ? 'tablet_form' : 'desktop_form'
      };

      if (showProgress) {
        console.log(`Saving appointment on ${deviceType}...`);
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      
      if (result.success) {
        // Device-specific success logging
        console.log(`Appointment saved successfully on ${deviceType}`);
        return true;
      } else {
        console.error('Failed to save appointment:', result.error);
        
        // Device-specific error messages
        const errorMessages = {
          mobile: 'Unable to save appointment. Please check your connection and try again.',
          tablet: 'Failed to save appointment: ' + result.error,
          desktop: 'Failed to save appointment: ' + result.error
        };
        
        alert(errorMessages[deviceType]);
        return false;
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      
      // Device-specific error handling
      const errorMessages = {
        mobile: 'Connection error. Please try again.',
        tablet: 'Error saving appointment. Please try again.',
        desktop: 'Error saving appointment. Please try again.'
      };
      
      alert(errorMessages[deviceType]);
      return false;
    }
  };

  // Device-aware booking flow initiation
  const handleScheduleCall = (): void => {
    setShowSchedulingModal(true);
    
    // Device-specific initialization behavior
    if (deviceType === 'mobile') {
      // Mobile: Load slots immediately for wizard
      loadAvailableSlots();
      console.log('Initiating mobile booking wizard');
    } else if (deviceType === 'tablet') {
      // Tablet: Load slots with slight delay for better UX
      setTimeout(() => {
        loadAvailableSlots();
      }, 150);
      console.log('Initiating tablet booking form');
    } else {
      // Desktop: Standard loading
      loadAvailableSlots();
      console.log('Initiating desktop booking form');
    }
  };

  // Device-aware booking confirmation with different success patterns
  const handleBookingConfirmation = async (
    formData: FormData,
    sessionId?: string,
    onSuccess?: (dayName: string, time: string, email: string) => void
  ): Promise<void> => {
    if (availableSlots.length === 0 || selectedDate < 0 || selectedTime < 0) {
      const errorMessages = {
        mobile: 'Please select a date and time.',
        tablet: 'Please select both a date and time for your appointment.',
        desktop: 'Please select a date and time slot for your appointment.'
      };
      
      alert(errorMessages[deviceType]);
      return;
    }

    const selectedDateSlot = availableSlots[selectedDate];
    const selectedTimeSlot = selectedDateSlot.slots[selectedTime];

    setIsBooking(true);

    try {
      const success = await saveAppointment(selectedDateSlot, selectedTimeSlot, formData, sessionId);
      
      if (success) {
        // Device-specific success handling
        const dayName = new Date(selectedDateSlot.date).toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Call success callback with device context
        if (onSuccess) {
          onSuccess(dayName, selectedTimeSlot.time, formData.email);
        }

        // Device-specific modal closing behavior
        if (deviceType === 'mobile') {
          // Mobile: Immediate close for better flow
          setShowSchedulingModal(false);
          setSelectedDate(0);
          setSelectedTime(0);
        } else if (deviceType === 'tablet') {
          // Tablet: Brief delay to show confirmation
          setTimeout(() => {
            setShowSchedulingModal(false);
            setSelectedDate(0);
            setSelectedTime(0);
          }, 1000);
        } else {
          // Desktop: Standard delay with feedback
          setTimeout(() => {
            setShowSchedulingModal(false);
            setSelectedDate(0);
            setSelectedTime(0);
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Booking confirmation error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  // Device-aware modal closing
  const closeSchedulingModal = (): void => {
    setShowSchedulingModal(false);
    
    // Device-specific cleanup behavior
    if (deviceType === 'mobile') {
      // Mobile: Reset selections immediately
      setSelectedDate(0);
      setSelectedTime(0);
    } else {
      // Tablet/Desktop: Maintain selections for potential re-opening
      setTimeout(() => {
        if (!showSchedulingModal) {
          setSelectedDate(0);
          setSelectedTime(0);
        }
      }, 2000);
    }
  };

  // Device-aware date selection with validation
  const handleDateSelection = (index: number): void => {
    setSelectedDate(index);
    setSelectedTime(0); // Reset time selection
    
    // Device-specific feedback
    if (deviceType === 'mobile' && isTouchDevice) {
      // Mobile: Haptic feedback simulation via console (real implementation would use vibration API)
      console.log('Date selected via touch');
    }
    
    console.log(`Date selected on ${deviceType}: ${availableSlots[index]?.date}`);
  };

  // Device-aware time selection
  const handleTimeSelection = (index: number): void => {
    setSelectedTime(index);
    
    // Device-specific feedback
    if (deviceType === 'mobile' && isTouchDevice) {
      console.log('Time selected via touch');
    }
    
    const selectedDateSlot = availableSlots[selectedDate];
    const timeSlot = selectedDateSlot?.slots[index];
    console.log(`Time selected on ${deviceType}: ${timeSlot?.time}`);
  };

  // Device performance optimization utilities
  const getOptimizedSlots = (startIndex: number = 0, batchSize?: number): AvailableSlots => {
    const batchSizes = {
      mobile: 3,    // Show 3 days at a time on mobile
      tablet: 5,    // Show 5 days at a time on tablet
      desktop: 7    // Show full week on desktop
    };
    
    const size = batchSize || batchSizes[deviceType];
    return availableSlots.slice(startIndex, startIndex + size);
  };

  // Device-specific booking flow validation
  const validateBookingFlow = (): { isValid: boolean; message?: string } => {
    const validationMessages = {
      mobile: {
        noSlots: 'No time slots available. Please try again later.',
        noSelection: 'Please select a time slot.'
      },
      tablet: {
        noSlots: 'No available appointment slots found. Please check back later.',
        noSelection: 'Please select both a date and time for your appointment.'
      },
      desktop: {
        noSlots: 'No available appointment slots found. Please contact us directly or check back later.',
        noSelection: 'Please select a date and time slot from the available options.'
      }
    };

    const messages = validationMessages[deviceType];

    if (availableSlots.length === 0) {
      return { isValid: false, message: messages.noSlots };
    }

    if (selectedDate < 0 || selectedTime < 0) {
      return { isValid: false, message: messages.noSelection };
    }

    return { isValid: true };
  };

  return {
    // Core state
    showSchedulingModal,
    selectedDate,
    selectedTime,
    availableSlots,
    isLoadingSlots,
    isBooking,
    
    // Core actions
    setShowSchedulingModal,
    setSelectedDate,
    setSelectedTime,
    loadAvailableSlots,
    saveAppointment,
    handleScheduleCall,
    handleBookingConfirmation,
    
    // Device-aware features
    deviceType,
    isTouchDevice,
    closeSchedulingModal,
    handleDateSelection,
    handleTimeSelection,
    getOptimizedSlots,
    validateBookingFlow
  };
};