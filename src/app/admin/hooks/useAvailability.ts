// src/app/admin/hooks/useAvailability.ts - PART 1/3

import { useState, useCallback } from 'react';
import { WeeklySchedule, BlackoutDate, Notification } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const useAvailability = (setNotification: (notification: Notification | null) => void) => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({
    monday: { enabled: false, start: '09:00', end: '17:00' },
    tuesday: { enabled: false, start: '09:00', end: '17:00' },
    wednesday: { enabled: false, start: '09:00', end: '17:00' },
    thursday: { enabled: false, start: '09:00', end: '17:00' },
    friday: { enabled: false, start: '09:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '17:00' },
    sunday: { enabled: false, start: '09:00', end: '17:00' }
  });

  const [blackoutDates, setBlackoutDates] = useState<BlackoutDate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Device-aware weekly schedule loading with different retry strategies
  const loadWeeklySchedule = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Device-specific retry and timeout configuration
      const loadConfig = {
        mobile: { maxRetries: 2, timeout: 8000, simplifyData: true },
        tablet: { maxRetries: 3, timeout: 6000, simplifyData: false },
        desktop: { maxRetries: 3, timeout: 5000, simplifyData: false }
      };

      const { maxRetries, timeout, simplifyData } = loadConfig[deviceType];

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          // Device-specific query parameters
          const queryParams = new URLSearchParams({
            client: 'techequity',
            deviceType: deviceType,
            isTouchDevice: isTouchDevice.toString(),
            ...(simplifyData && { simplified: 'true' })
          });

          const response = await fetch(`/api/availability?${queryParams}`, {
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          const result = await response.json();
          
          if (result.success) {
            // Device-specific data processing
            const scheduleData = result.data;
            
            if (deviceType === 'mobile') {
              // Mobile: Ensure time formats are consistent (already in HH:MM format)
              console.log('Mobile schedule data processed');
            } else if (deviceType === 'tablet') {
              // Tablet: Validate time ranges for touch input
              Object.keys(scheduleData).forEach(day => {
                const dayData = scheduleData[day];
                if (dayData.enabled && dayData.start && dayData.end) {
                  // Basic time validation - ensure end time is after start time
                  const startMinutes = timeToMinutes(dayData.start);
                  const endMinutes = timeToMinutes(dayData.end);
                  
                  if (endMinutes <= startMinutes) {
                    console.warn(`Invalid time range for ${day}, using defaults`);
                    dayData.start = '09:00';
                    dayData.end = '17:00';
                  }
                }
              });
            }
            // Desktop: Use data as-is without processing

            setWeeklySchedule(scheduleData);
            console.log(`Weekly schedule loaded for ${deviceType}`);
            break;
          } else {
            console.error('Failed to load schedule:', result.error);
            if (attempt === maxRetries - 1) {
              // Device-specific error notifications
              const errorMessages = {
                mobile: 'Cannot load schedule. Check connection.',
                tablet: 'Failed to load schedule: ' + result.error,
                desktop: 'Failed to load schedule: ' + result.error
              };
              
              setNotification({ 
                type: 'error', 
                message: errorMessages[deviceType]
              });
              
              setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
            }
          }
        } catch (error) {
          console.error(`Schedule load attempt ${attempt + 1} failed:`, error);
          if (attempt < maxRetries - 1) {
            // Device-specific retry delays
            const retryDelays = {
              mobile: 1500,
              tablet: 1000,
              desktop: 750
            };
            
            await new Promise(resolve => setTimeout(resolve, retryDelays[deviceType]));
          } else {
            // Final error handling
            const errorMessages = {
              mobile: 'Connection error. Try again.',
              tablet: 'Error loading schedule. Please try again.',
              desktop: 'Error loading schedule. Please try again.'
            };
            
            setNotification({ 
              type: 'error', 
              message: errorMessages[deviceType]
            });
            setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
          }
        }
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      
      // Device-specific final error messages
      const errorMessages = {
        mobile: 'App error. Restart needed.',
        tablet: 'Error loading schedule. Please try again.',
        desktop: 'Error loading schedule. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
    } finally {
      setIsLoading(false);
    }
  }, [setNotification, deviceType, isTouchDevice]);

  // Device-aware schedule saving with different validation levels
  const saveWeeklySchedule = async () => {
    try {
      setIsLoading(true);
      
      // Device-specific pre-save validation
      if (!isValidSchedule()) {
        const errorMessages = {
          mobile: 'Check your schedule times.',
          tablet: 'Please check your schedule settings.',
          desktop: 'Please review your schedule settings and try again.'
        };
        
        setNotification({
          type: 'error',
          message: errorMessages[deviceType]
        });
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
        setIsLoading(false);
        return;
      }

      // Device-specific save configuration
      const saveConfig = {
        mobile: { timeout: 12000, showProgress: true, validateTimes: true },
        tablet: { timeout: 10000, showProgress: false, validateTimes: true },
        desktop: { timeout: 8000, showProgress: false, validateTimes: false }
      };

      const { timeout, showProgress, validateTimes } = saveConfig[deviceType];

      if (showProgress) {
        console.log(`Saving schedule on ${deviceType}...`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Prepare schedule data with device context
      const scheduleToSave = { ...weeklySchedule };
      
      if (validateTimes) {
        // Additional time validation for mobile/tablet touch input
        Object.keys(scheduleToSave).forEach(day => {
          const dayData = scheduleToSave[day as keyof WeeklySchedule];
          if (dayData.enabled) {
            // Ensure times are in HH:MM format
            if (dayData.start && !dayData.start.match(/^\d{2}:\d{2}$/)) {
              dayData.start = '09:00';
            }
            if (dayData.end && !dayData.end.match(/^\d{2}:\d{2}$/)) {
              dayData.end = '17:00';
            }
          }
        });
      }

      const requestPayload = {
        clientId: 'techequity',
        schedule: scheduleToSave,
        deviceType: deviceType,
        isTouchDevice: isTouchDevice,
        saveMethod: deviceType === 'mobile' ? 'mobile_touch' : 
                   deviceType === 'tablet' ? 'tablet_hybrid' : 'desktop_keyboard',
        lastModified: new Date().toISOString()
      };

      const response = await fetch('/api/availability', {
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
        // Device-specific success notifications
        const successMessages = {
          mobile: 'Saved!',
          tablet: 'Schedule saved successfully!',
          desktop: 'Schedule saved successfully!'
        };
        
        setNotification({ 
          type: 'success', 
          message: successMessages[deviceType]
        });
        
        // Device-specific success timing
        const successDurations = {
          mobile: 2500,
          tablet: 3000,
          desktop: 3000
        };
        
        setTimeout(() => setNotification(null), successDurations[deviceType]);
        
        console.log(`Schedule saved successfully on ${deviceType}`);
      } else {
        console.error('Failed to save schedule:', result.error);
        
        // Device-specific error messages
        const errorMessages = {
          mobile: 'Save failed. Try again.',
          tablet: 'Failed to save schedule: ' + result.error,
          desktop: 'Failed to save schedule: ' + result.error
        };
        
        setNotification({ 
          type: 'error', 
          message: errorMessages[deviceType]
        });
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      
      // Device-specific error handling
      const errorMessages = {
        mobile: 'Connection error.',
        tablet: 'Error saving schedule. Please try again.',
        desktop: 'Error saving schedule. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Utility function to convert time string to minutes for comparison
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Utility function to validate schedule has at least one enabled day
  const isValidSchedule = (): boolean => {
    const days = Object.values(weeklySchedule);
    return days.some(day => day.enabled);
  };

  // Device-aware day schedule updates with different validation approaches
  const updateDaySchedule = (day: keyof WeeklySchedule, field: string, value: string | boolean) => {
    if (field === 'enabled') {
      // Device-specific enabled toggle behavior
      if (deviceType === 'mobile' && isTouchDevice) {
        console.log(`Touch toggle for ${day}: ${value}`);
      }
      
      setWeeklySchedule(prev => ({
        ...prev,
        [day]: { ...prev[day], [field]: value }
      }));
    } else if (field === 'start' || field === 'end') {
      // Device-specific time input processing
      let processedValue = value as string;
      
      if (deviceType === 'mobile') {
        // Mobile: Ensure HH:MM format for touch time inputs
        if (processedValue && !processedValue.match(/^\d{2}:\d{2}$/)) {
          // If invalid format, keep previous value
          return;
        }
      } else if (deviceType === 'tablet') {
        // Tablet: More lenient validation but still structured
        if (processedValue && !processedValue.match(/^\d{1,2}:\d{2}$/)) {
          return;
        }
        // Pad single digit hours
        if (processedValue && processedValue.match(/^\d:\d{2}$/)) {
          processedValue = '0' + processedValue;
        }
      }
      // Desktop: Allow any reasonable time format
      
      // Validate time range when updating
      setWeeklySchedule(prev => {
        const currentDay = prev[day];
        const updatedDay = { ...currentDay, [field]: processedValue };
        
        // Check for valid time range if both start and end are set
        if (updatedDay.start && updatedDay.end) {
          const startMinutes = timeToMinutes(updatedDay.start);
          const endMinutes = timeToMinutes(updatedDay.end);
          
          if (endMinutes <= startMinutes) {
            // Device-specific invalid time handling
            if (deviceType === 'mobile') {
              console.log('Mobile: Invalid time range detected');
              return prev; // Don't update on mobile
            } else {
              // Allow update but log warning for tablet/desktop
              console.warn(`Warning: ${day} end time should be after start time`);
            }
          }
        }
        
        return {
          ...prev,
          [day]: updatedDay
        };
      });
    } else {
      // Standard field update
      setWeeklySchedule(prev => ({
        ...prev,
        [day]: { ...prev[day], [field]: value }
      }));
    }
  };

  // Device-aware blackout date loading with different data limits
  const loadBlackoutDates = useCallback(async () => {
    try {
      // Device-specific query limits for performance
      const queryParams = new URLSearchParams({
        client: 'techequity',
        deviceType: deviceType,
        ...(deviceType === 'mobile' && { limit: '20' }), // Limit on mobile
        ...(deviceType === 'tablet' && { limit: '50' })  // Moderate limit on tablet
        // Desktop: No limit
      });

      const response = await fetch(`/api/blackouts?${queryParams}`);
      const result = await response.json();
      
      if (result.success) {
        // Device-specific data sorting
        let blackoutData = result.data;
        
        if (deviceType === 'mobile') {
          // Mobile: Show only upcoming blackouts for simplicity
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          blackoutData = blackoutData
            .filter((blackout: BlackoutDate) => new Date(blackout.date) >= today)
            .slice(0, 15); // Limit to 15 for mobile performance
        } else if (deviceType === 'tablet') {
          // Tablet: Show recent and upcoming blackouts
          blackoutData = blackoutData
            .sort((a: BlackoutDate, b: BlackoutDate) => 
              new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 30);
        }
        // Desktop: Show all blackout dates without filtering
        
        setBlackoutDates(blackoutData);
        console.log(`Loaded ${blackoutData.length} blackout dates for ${deviceType}`);
      } else {
        console.error('Failed to load blackout dates:', result.error);
        // Don't show notifications for blackout loading failures unless it's critical
        if (deviceType === 'desktop') {
          setNotification({ 
            type: 'error', 
            message: 'Failed to load blackout dates: ' + result.error 
          });
          setTimeout(() => setNotification(null), 5000);
        }
      }
    } catch (error) {
      console.error('Error loading blackout dates:', error);
      // Only show error notification on desktop
      if (deviceType === 'desktop') {
        setNotification({ 
          type: 'error', 
          message: 'Error loading blackout dates. Please try again.' 
        });
        setTimeout(() => setNotification(null), 5000);
      }
    }
  }, [setNotification, deviceType]);

  // Device-aware blackout date addition with different confirmation patterns
  const addBlackoutDate = useCallback(async (date: string, reason: string) => {
    try {
      // Device-specific input validation
      if (!date || !reason) {
        const errorMessages = {
          mobile: 'Date and reason required.',
          tablet: 'Please provide both date and reason.',
          desktop: 'Please provide both date and reason for the blackout.'
        };
        
        setNotification({ 
          type: 'error', 
          message: errorMessages[deviceType] 
        });
        setTimeout(() => setNotification(null), 4000);
        return;
      }

      // Validate date format and future date
      const blackoutDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(blackoutDate.getTime()) || blackoutDate < today) {
        const errorMessages = {
          mobile: 'Invalid date.',
          tablet: 'Please select a valid future date.',
          desktop: 'Please select a valid date in the future.'
        };
        
        setNotification({ 
          type: 'error', 
          message: errorMessages[deviceType] 
        });
        setTimeout(() => setNotification(null), 4000);
        return;
      }

      // Device-specific request configuration
      const requestConfig = {
        mobile: { timeout: 10000 },
        tablet: { timeout: 8000 },
        desktop: { timeout: 6000 }
      };

      const { timeout } = requestConfig[deviceType];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch('/api/blackouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: 'techequity',
          date,
          reason: reason.trim(),
          deviceType: deviceType,
          addMethod: deviceType === 'mobile' ? 'mobile_touch' : 
                    deviceType === 'tablet' ? 'tablet_hybrid' : 'desktop_keyboard'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      
      if (result.success) {
        // Add the new blackout date to local state
        setBlackoutDates(prev => {
          // Device-specific insertion logic
          if (deviceType === 'mobile') {
            // Mobile: Add to beginning and limit total
            const updated = [result.data, ...prev].slice(0, 15);
            return updated;
          } else if (deviceType === 'tablet') {
            // Tablet: Add and sort by date
            const updated = [...prev, result.data].slice(0, 30);
            return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          } else {
            // Desktop: Simple append
            return [...prev, result.data];
          }
        });

        // Device-specific success notifications
        const successMessages = {
          mobile: 'Blackout added!',
          tablet: 'Blackout date added successfully!',
          desktop: 'Blackout date added successfully!'
        };
        
        setNotification({ 
          type: 'success', 
          message: successMessages[deviceType] 
        });
        
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 2500 : 3000);
        console.log(`Blackout date added via ${deviceType}`);
      } else {
        console.error('Failed to add blackout date:', result.error);
        
        // Device-specific error messages
        const errorMessages = {
          mobile: 'Add failed. Try again.',
          tablet: 'Failed to add blackout date: ' + result.error,
          desktop: 'Failed to add blackout date: ' + result.error
        };
        
        setNotification({ 
          type: 'error', 
          message: errorMessages[deviceType] 
        });
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
      }
    } catch (error) {
      console.error('Error adding blackout date:', error);
      
      // Device-specific error handling
      const errorMessages = {
        mobile: 'Connection error.',
        tablet: 'Error adding blackout date. Please try again.',
        desktop: 'Error adding blackout date. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType] 
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
    }
  }, [setNotification, deviceType]);

  // Device-aware blackout date removal with different confirmation strategies
  const removeBlackoutDate = useCallback(async (id: number) => {
    try {
      // Device-specific confirmation
      const confirmMessages = {
        mobile: 'Remove this blackout?',
        tablet: 'Remove this blackout date?',
        desktop: 'Are you sure you want to remove this blackout date?'
      };
      
      const confirmed = confirm(confirmMessages[deviceType]);
      if (!confirmed) return;

      // Device-specific request timeout
      const timeout = deviceType === 'mobile' ? 10000 : 
                     deviceType === 'tablet' ? 8000 : 6000;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`/api/blackouts?id=${id}&client=techequity&deviceType=${deviceType}`, {
        method: 'DELETE',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      
      if (result.success) {
        // Remove from local state
        setBlackoutDates(prev => prev.filter(date => date.id !== id));
        
        // Device-specific success notifications
        const successMessages = {
          mobile: 'Removed!',
          tablet: 'Blackout date removed successfully!',
          desktop: 'Blackout date removed successfully!'
        };
        
        setNotification({ 
          type: 'success', 
          message: successMessages[deviceType] 
        });
        
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 2000 : 3000);
        console.log(`Blackout date removed via ${deviceType}`);
      } else {
        console.error('Failed to remove blackout date:', result.error);
        
        // Device-specific error messages
        const errorMessages = {
          mobile: 'Remove failed.',
          tablet: 'Failed to remove blackout date: ' + result.error,
          desktop: 'Failed to remove blackout date: ' + result.error
        };
        
        setNotification({ 
          type: 'error', 
          message: errorMessages[deviceType] 
        });
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
      }
    } catch (error) {
      console.error('Error removing blackout date:', error);
      
      // Device-specific error handling
      const errorMessages = {
        mobile: 'Connection error.',
        tablet: 'Error removing blackout date. Please try again.',
        desktop: 'Error removing blackout date. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType] 
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
    }
  }, [setNotification, deviceType]);

  // Device-aware schedule validation with different strictness levels
  const validateScheduleForDevice = (): { isValid: boolean; message: string } => {
    const enabledDays = Object.entries(weeklySchedule).filter(([_, day]) => day.enabled);
    
    if (enabledDays.length === 0) {
      const messages = {
        mobile: 'Enable at least one day.',
        tablet: 'Please enable at least one day in your schedule.',
        desktop: 'Please enable at least one day in your weekly schedule.'
      };
      return { isValid: false, message: messages[deviceType] };
    }

    // Check for valid time ranges on enabled days
    for (const [dayName, day] of enabledDays) {
      if (!day.start || !day.end) {
        const messages = {
          mobile: `${dayName}: Missing times.`,
          tablet: `${dayName}: Please set both start and end times.`,
          desktop: `${dayName}: Please provide both start and end times.`
        };
        return { isValid: false, message: messages[deviceType] };
      }

      const startMinutes = timeToMinutes(day.start);
      const endMinutes = timeToMinutes(day.end);

      if (endMinutes <= startMinutes) {
        const messages = {
          mobile: `${dayName}: End before start.`,
          tablet: `${dayName}: End time must be after start time.`,
          desktop: `${dayName}: End time must be later than start time.`
        };
        return { isValid: false, message: messages[deviceType] };
      }

      // Device-specific minimum duration checks
      const durationMinutes = endMinutes - startMinutes;
      const minDuration = deviceType === 'mobile' ? 60 : 30; // Mobile requires 1hr minimum

      if (durationMinutes < minDuration) {
        const messages = {
          mobile: `${dayName}: Too short (min 1hr).`,
          tablet: `${dayName}: Schedule too short (minimum 30 minutes).`,
          desktop: `${dayName}: Schedule duration too short (minimum 30 minutes).`
        };
        return { isValid: false, message: messages[deviceType] };
      }
    }

    return { isValid: true, message: '' };
  };

  // Device-aware bulk schedule operations
  const bulkUpdateSchedule = (updates: Partial<WeeklySchedule>): void => {
    // Device-specific bulk operation limits
    const maxBulkUpdates = {
      mobile: 3,   // Limit bulk updates on mobile
      tablet: 5,   // Moderate bulk updates on tablet  
      desktop: 7   // Full week updates on desktop
    };

    const updateKeys = Object.keys(updates);
    if (updateKeys.length > maxBulkUpdates[deviceType]) {
      const messages = {
        mobile: `Too many updates. Max ${maxBulkUpdates.mobile} at once.`,
        tablet: `Bulk updates limited to ${maxBulkUpdates.tablet} days.`,
        desktop: `Bulk updates limited to ${maxBulkUpdates.desktop} days at once.`
      };
      
      setNotification({ type: 'error', message: messages[deviceType] });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    setWeeklySchedule(prev => {
      const updated = { ...prev };
      
      Object.entries(updates).forEach(([day, dayData]) => {
        if (day in updated && dayData) {
          updated[day as keyof WeeklySchedule] = {
            ...updated[day as keyof WeeklySchedule],
            ...dayData
          };
        }
      });

      return updated;
    });

    console.log(`Bulk schedule update completed on ${deviceType}: ${updateKeys.join(', ')}`);
  };

  // Device-aware schedule reset functionality
  const resetSchedule = (): void => {
    const confirmMessages = {
      mobile: 'Reset all schedule?',
      tablet: 'Reset entire weekly schedule?',
      desktop: 'Are you sure you want to reset the entire weekly schedule to default values?'
    };

    const confirmed = confirm(confirmMessages[deviceType]);
    if (!confirmed) return;

    const defaultSchedule: WeeklySchedule = {
      monday: { enabled: false, start: '09:00', end: '17:00' },
      tuesday: { enabled: false, start: '09:00', end: '17:00' },
      wednesday: { enabled: false, start: '09:00', end: '17:00' },
      thursday: { enabled: false, start: '09:00', end: '17:00' },
      friday: { enabled: false, start: '09:00', end: '17:00' },
      saturday: { enabled: false, start: '09:00', end: '17:00' },
      sunday: { enabled: false, start: '09:00', end: '17:00' }
    };

    setWeeklySchedule(defaultSchedule);

    const successMessages = {
      mobile: 'Schedule reset!',
      tablet: 'Schedule reset to defaults.',
      desktop: 'Weekly schedule has been reset to default values.'
    };

    setNotification({ type: 'success', message: successMessages[deviceType] });
    setTimeout(() => setNotification(null), deviceType === 'mobile' ? 2000 : 3000);
    
    console.log(`Schedule reset completed on ${deviceType}`);
  };

  // Device-aware schedule copy functionality
  const copyDaySchedule = (fromDay: keyof WeeklySchedule, toDays: (keyof WeeklySchedule)[]): void => {
    const sourceDay = weeklySchedule[fromDay];
    
    if (!sourceDay.enabled) {
      const messages = {
        mobile: 'Source day not enabled.',
        tablet: 'Cannot copy from disabled day.',
        desktop: 'Cannot copy schedule from a disabled day.'
      };
      
      setNotification({ type: 'error', message: messages[deviceType] });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    // Device-specific copy limits
    const maxCopyTargets = {
      mobile: 2,   // Copy to max 2 days on mobile
      tablet: 4,   // Copy to max 4 days on tablet
      desktop: 6   // Copy to max 6 days on desktop
    };

    if (toDays.length > maxCopyTargets[deviceType]) {
      const messages = {
        mobile: `Can copy to max ${maxCopyTargets.mobile} days.`,
        tablet: `Copy limited to ${maxCopyTargets.tablet} days at once.`,
        desktop: `Copy operation limited to ${maxCopyTargets.desktop} days at once.`
      };
      
      setNotification({ type: 'error', message: messages[deviceType] });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    setWeeklySchedule(prev => {
      const updated = { ...prev };
      
      toDays.forEach(day => {
        updated[day] = {
          enabled: sourceDay.enabled,
          start: sourceDay.start,
          end: sourceDay.end
        };
      });

      return updated;
    });

    const successMessages = {
      mobile: `${fromDay} copied to ${toDays.length} days.`,
      tablet: `${fromDay} schedule copied to ${toDays.join(', ')}.`,
      desktop: `Successfully copied ${fromDay} schedule to: ${toDays.join(', ')}.`
    };

    setNotification({ type: 'success', message: successMessages[deviceType] });
    setTimeout(() => setNotification(null), deviceType === 'mobile' ? 2500 : 3000);
    
    console.log(`Schedule copied from ${fromDay} to ${toDays.join(', ')} on ${deviceType}`);
  };

  // Device-aware schedule analytics
  const getScheduleStats = () => {
    const enabledDays = Object.values(weeklySchedule).filter(day => day.enabled);
    const totalHours = enabledDays.reduce((sum, day) => {
      if (day.start && day.end) {
        const duration = timeToMinutes(day.end) - timeToMinutes(day.start);
        return sum + (duration / 60);
      }
      return sum;
    }, 0);

    const stats = {
      enabledDays: enabledDays.length,
      totalWeeklyHours: Math.round(totalHours * 10) / 10,
      averageDailyHours: enabledDays.length > 0 ? Math.round((totalHours / enabledDays.length) * 10) / 10 : 0,
      hasWeekendHours: weeklySchedule.saturday.enabled || weeklySchedule.sunday.enabled
    };

    // Device-specific stats logging
    if (deviceType === 'desktop') {
      console.log('Schedule Statistics:', stats);
    }

    return stats;
  };

  // Device-aware next available slot calculation
  const getNextAvailableSlot = (): { day: string; time: string } | null => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = timeToMinutes(`${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`);
    
    const dayOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    // Check remaining time today first
    const todayKey = dayOrder[currentDay] as keyof WeeklySchedule;
    const todaySchedule = weeklySchedule[todayKey];
    
    if (todaySchedule.enabled && todaySchedule.start && todaySchedule.end) {
      const endTime = timeToMinutes(todaySchedule.end);
      if (currentTime < endTime) {
        return {
          day: todayKey,
          time: `${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${(currentTime % 60).toString().padStart(2, '0')}`
        };
      }
    }
    
    // Check next available day
    for (let i = 1; i <= 7; i++) {
      const dayIndex = (currentDay + i) % 7;
      const dayKey = dayOrder[dayIndex] as keyof WeeklySchedule;
      const daySchedule = weeklySchedule[dayKey];
      
      if (daySchedule.enabled && daySchedule.start) {
        return {
          day: dayKey,
          time: daySchedule.start
        };
      }
    }
    
    return null;
  };

  // Legacy compatibility function
  const addBlackout = () => {
    console.warn('addBlackout is deprecated, use addBlackoutDate instead');
  };

  // Return all hook functionality with device-aware features
  return {
    // Core state
    weeklySchedule,
    blackoutDates,
    isLoading,
    
    // Core actions
    loadWeeklySchedule,
    loadBlackoutDates,
    saveWeeklySchedule,
    updateDaySchedule,
    addBlackoutDate,
    removeBlackoutDate,
    
    // Legacy compatibility
    addBlackout,
    
    // Device-aware features
    deviceType,
    isTouchDevice,
    validateScheduleForDevice,
    bulkUpdateSchedule,
    resetSchedule,
    copyDaySchedule,
    getScheduleStats,
    getNextAvailableSlot
  };
};