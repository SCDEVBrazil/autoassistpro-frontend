// src/app/admin/hooks/useSettings.ts - PART 1/3
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback } from 'react';
import { AppointmentSettings, Notification } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const useSettings = (setNotification: (notification: Notification | null) => void) => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  const [appointmentSettings, setAppointmentSettings] = useState<AppointmentSettings>({
    duration: 45,
    bufferTime: 15,
    advanceNotice: 24,
    maxBookingWindow: 60
  });
  const [isLoading, setIsLoading] = useState(false);

  // Device-aware settings loading with different retry strategies
  const loadAppointmentSettings = useCallback(async () => {
    try {
      // Device-specific retry and timeout configuration
      const loadConfig = {
        mobile: { maxRetries: 2, timeout: 8000, simplifyResponse: true },
        tablet: { maxRetries: 3, timeout: 6000, simplifyResponse: false },
        desktop: { maxRetries: 3, timeout: 5000, simplifyResponse: false }
      };

      const { maxRetries, timeout, simplifyResponse } = loadConfig[deviceType];

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          // Device-specific query parameters
          const queryParams = new URLSearchParams({
            client: 'techequity',
            deviceType: deviceType,
            isTouchDevice: isTouchDevice.toString(),
            ...(simplifyResponse && { simplified: 'true' })
          });

          const response = await fetch(`/api/settings?${queryParams}`, {
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          const result = await response.json();
          
          if (result.success) {
            // Device-specific settings validation and processing
            let settingsData = result.data;
            
            if (deviceType === 'mobile') {
              // Mobile: Validate and use sensible defaults for touch interface
              settingsData = {
                duration: Math.max(15, Math.min(180, settingsData.duration || 45)),
                bufferTime: Math.max(0, Math.min(60, settingsData.bufferTime || 15)),
                advanceNotice: Math.max(1, Math.min(168, settingsData.advanceNotice || 24)),
                maxBookingWindow: Math.max(1, Math.min(365, settingsData.maxBookingWindow || 60))
              };
            } else if (deviceType === 'tablet') {
              // Tablet: More flexible validation for hybrid interface
              settingsData = {
                duration: Math.max(15, Math.min(240, settingsData.duration || 45)),
                bufferTime: Math.max(0, Math.min(120, settingsData.bufferTime || 15)),
                advanceNotice: Math.max(1, Math.min(336, settingsData.advanceNotice || 24)),
                maxBookingWindow: Math.max(1, Math.min(730, settingsData.maxBookingWindow || 60))
              };
            }
            // Desktop: Use full range validation without restrictions

            setAppointmentSettings(settingsData);
            console.log(`Settings loaded for ${deviceType}`);
            break;
          } else {
            console.error('Failed to load settings:', result.error);
            if (attempt === maxRetries - 1) {
              // Device-specific error notifications
              const errorMessages = {
                mobile: 'Cannot load settings. Check connection.',
                tablet: 'Failed to load settings: ' + result.error,
                desktop: 'Failed to load settings: ' + result.error
              };
              
              setNotification({ 
                type: 'error', 
                message: errorMessages[deviceType]
              });
              
              setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
            }
          }
        } catch (error) {
          console.error(`Settings load attempt ${attempt + 1} failed:`, error);
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
              tablet: 'Error loading settings. Please try again.',
              desktop: 'Error loading settings. Please try again.'
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
      console.error('Error loading settings:', error);
      
      // Device-specific final error messages
      const errorMessages = {
        mobile: 'App error. Restart needed.',
        tablet: 'Error loading settings. Please try again.',
        desktop: 'Error loading settings. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
    }
  }, [setNotification, deviceType, isTouchDevice]);

  // Device-aware settings saving with different validation levels
  const saveAppointmentSettings = async () => {
    try {
      setIsLoading(true);
      
      // Device-specific validation before saving
      const validationResult = validateSettings();
      if (!validationResult.isValid) {
        const errorMessages = {
          mobile: validationResult.mobileMessage || 'Invalid settings.',
          tablet: validationResult.tabletMessage || validationResult.message || 'Please check your settings.',
          desktop: validationResult.message || 'Please review your settings and try again.'
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
        mobile: { timeout: 12000, showProgress: true },
        tablet: { timeout: 10000, showProgress: false },
        desktop: { timeout: 8000, showProgress: false }
      };

      const { timeout, showProgress } = saveConfig[deviceType];

      if (showProgress) {
        console.log(`Saving settings on ${deviceType}...`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const requestPayload = {
        clientId: 'techequity',
        duration: appointmentSettings.duration,
        bufferTime: appointmentSettings.bufferTime,
        advanceNotice: appointmentSettings.advanceNotice,
        maxBookingWindow: appointmentSettings.maxBookingWindow,
        deviceType: deviceType,
        isTouchDevice: isTouchDevice,
        saveMethod: deviceType === 'mobile' ? 'mobile_touch' : 
                   deviceType === 'tablet' ? 'tablet_hybrid' : 'desktop_keyboard',
        lastModified: new Date().toISOString()
      };

      const response = await fetch('/api/settings', {
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
          tablet: 'Settings saved successfully!',
          desktop: 'Settings saved successfully!'
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
        
        console.log(`Settings saved successfully on ${deviceType}`);
      } else {
        console.error('Failed to save settings:', result.error);
        
        // Device-specific error messages
        const errorMessages = {
          mobile: 'Save failed. Try again.',
          tablet: 'Failed to save settings: ' + result.error,
          desktop: 'Failed to save settings: ' + result.error
        };
        
        setNotification({ 
          type: 'error', 
          message: errorMessages[deviceType]
        });
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 4000 : 5000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      
      // Device-specific error handling
      const errorMessages = {
        mobile: 'Connection error.',
        tablet: 'Error saving settings. Please try again.',
        desktop: 'Error saving settings. Please try again.'
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

  // Device-aware settings validation
  const validateSettings = (): { 
    isValid: boolean; 
    message?: string; 
    mobileMessage?: string; 
    tabletMessage?: string;
  } => {
    const settings = appointmentSettings;
    
    // Validate duration
    if (settings.duration < 15 || settings.duration > 300) {
      return {
        isValid: false,
        message: 'Duration must be between 15 and 300 minutes',
        mobileMessage: 'Duration: 15-300 minutes',
        tabletMessage: 'Duration must be between 15-300 minutes'
      };
    }
    
    // Validate buffer time
    if (settings.bufferTime < 0 || settings.bufferTime > 120) {
      return {
        isValid: false,
        message: 'Buffer time must be between 0 and 120 minutes',
        mobileMessage: 'Buffer: 0-120 minutes',
        tabletMessage: 'Buffer time must be 0-120 minutes'
      };
    }
    
    // Validate advance notice
    if (settings.advanceNotice < 1 || settings.advanceNotice > 336) {
      return {
        isValid: false,
        message: 'Advance notice must be between 1 and 336 hours',
        mobileMessage: 'Notice: 1-336 hours',
        tabletMessage: 'Advance notice must be 1-336 hours'
      };
    }
    
    // Validate booking window
    if (settings.maxBookingWindow < 1 || settings.maxBookingWindow > 365) {
      return {
        isValid: false,
        message: 'Booking window must be between 1 and 365 days',
        mobileMessage: 'Window: 1-365 days',
        tabletMessage: 'Booking window must be 1-365 days'
      };
    }
    
    // Device-specific logical validation
    if (deviceType !== 'mobile') {
      // More thorough validation for tablet/desktop
      if (settings.bufferTime > settings.duration / 2) {
        return {
          isValid: false,
          message: 'Buffer time should not exceed half the appointment duration',
          tabletMessage: 'Buffer time too long for appointment duration'
        };
      }
    }
    
    return { isValid: true };
  };

  // Device-aware settings updates with different input processing
  const updateSettings = (field: keyof AppointmentSettings, value: number) => {
    // Device-specific input validation and processing
    let processedValue = value;
    
    if (deviceType === 'mobile') {
      // Mobile: Strict bounds and rounding for touch input
      switch (field) {
        case 'duration':
          processedValue = Math.max(15, Math.min(180, Math.round(value / 15) * 15)); // Round to 15min intervals
          break;
        case 'bufferTime':
          processedValue = Math.max(0, Math.min(60, Math.round(value / 5) * 5)); // Round to 5min intervals
          break;
        case 'advanceNotice':
          processedValue = Math.max(1, Math.min(168, Math.round(value))); // Round to hours
          break;
        case 'maxBookingWindow':
          processedValue = Math.max(1, Math.min(365, Math.round(value))); // Round to days
          break;
      }
    } else if (deviceType === 'tablet') {
      // Tablet: More flexible bounds with some rounding
      switch (field) {
        case 'duration':
          processedValue = Math.max(15, Math.min(240, Math.round(value / 5) * 5)); // Round to 5min intervals
          break;
        case 'bufferTime':
          processedValue = Math.max(0, Math.min(120, Math.round(value)));
          break;
        case 'advanceNotice':
          processedValue = Math.max(1, Math.min(336, Math.round(value)));
          break;
        case 'maxBookingWindow':
          processedValue = Math.max(1, Math.min(730, Math.round(value)));
          break;
      }
    } else {
      // Desktop: Full flexibility with minimal processing
      switch (field) {
        case 'duration':
          processedValue = Math.max(15, Math.min(480, value)); // Allow up to 8 hours
          break;
        case 'bufferTime':
          processedValue = Math.max(0, Math.min(240, value)); // Allow up to 4 hours
          break;
        case 'advanceNotice':
          processedValue = Math.max(1, Math.min(8760, value)); // Allow up to 1 year
          break;
        case 'maxBookingWindow':
          processedValue = Math.max(1, Math.min(1095, value)); // Allow up to 3 years
          break;
      }
    }
    
    // Update with processed value
    setAppointmentSettings(prev => ({ ...prev, [field]: processedValue }));
    
    // Device-specific input feedback
    if (deviceType === 'mobile' && isTouchDevice && processedValue !== value) {
      console.log(`Touch input rounded: ${field} ${value} -> ${processedValue}`);
    } else if (deviceType === 'tablet' && processedValue !== value) {
      console.log(`Input adjusted for tablet: ${field} ${value} -> ${processedValue}`);
    }
  };

  // Device-aware settings reset functionality
  const resetSettings = (): void => {
    const confirmMessages = {
      mobile: 'Reset to defaults?',
      tablet: 'Reset all settings to default values?',
      desktop: 'Are you sure you want to reset all appointment settings to their default values?'
    };

    const confirmed = confirm(confirmMessages[deviceType]);
    if (!confirmed) return;

    // Device-specific default settings
    const defaultSettings: AppointmentSettings = {
      duration: deviceType === 'mobile' ? 30 : 45, // Shorter default for mobile
      bufferTime: 15,
      advanceNotice: 24,
      maxBookingWindow: deviceType === 'mobile' ? 30 : 60 // Shorter window for mobile
    };

    setAppointmentSettings(defaultSettings);

    const successMessages = {
      mobile: 'Reset complete!',
      tablet: 'Settings reset to defaults.',
      desktop: 'All settings have been reset to default values.'
    };

    setNotification({ type: 'success', message: successMessages[deviceType] });
    setTimeout(() => setNotification(null), deviceType === 'mobile' ? 2000 : 3000);
    
    console.log(`Settings reset completed on ${deviceType}`);
  };

  // Device-aware settings presets
  const applySettingsPreset = (presetName: string): void => {
    let presetSettings: AppointmentSettings;
    
    switch (presetName) {
      case 'quick':
        presetSettings = {
          duration: deviceType === 'mobile' ? 15 : 30,
          bufferTime: 5,
          advanceNotice: 2,
          maxBookingWindow: 14
        };
        break;
      case 'standard':
        presetSettings = {
          duration: 45,
          bufferTime: 15,
          advanceNotice: 24,
          maxBookingWindow: 60
        };
        break;
      case 'extended':
        presetSettings = {
          duration: deviceType === 'mobile' ? 60 : 90,
          bufferTime: deviceType === 'mobile' ? 15 : 30,
          advanceNotice: 48,
          maxBookingWindow: deviceType === 'mobile' ? 90 : 180
        };
        break;
      case 'flexible':
        presetSettings = {
          duration: 60,
          bufferTime: 0,
          advanceNotice: 1,
          maxBookingWindow: deviceType === 'mobile' ? 365 : 730
        };
        break;
      default:
        console.warn(`Unknown preset: ${presetName}`);
        return;
    }
    
    setAppointmentSettings(presetSettings);
    
    const successMessages = {
      mobile: `${presetName} preset applied!`,
      tablet: `${presetName.charAt(0).toUpperCase() + presetName.slice(1)} preset applied successfully`,
      desktop: `Successfully applied ${presetName} settings preset`
    };

    setNotification({ type: 'success', message: successMessages[deviceType] });
    setTimeout(() => setNotification(null), deviceType === 'mobile' ? 2500 : 3000);
    
    console.log(`Applied ${presetName} preset on ${deviceType}`);
  };

  // Device-aware settings export functionality
  const exportSettings = (): void => {
    try {
      const settingsData = {
        appointmentSettings: appointmentSettings,
        deviceType: deviceType,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      const jsonString = JSON.stringify(settingsData, null, deviceType === 'mobile' ? 0 : 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `appointment-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const successMessages = {
        mobile: 'Settings exported!',
        tablet: 'Settings exported successfully',
        desktop: 'Appointment settings have been exported successfully'
      };

      setNotification({ type: 'success', message: successMessages[deviceType] });
      setTimeout(() => setNotification(null), 3000);
      
      console.log(`Settings exported on ${deviceType}`);
    } catch (error) {
      console.error('Export error:', error);
      
      const errorMessages = {
        mobile: 'Export failed.',
        tablet: 'Export failed. Please try again.',
        desktop: 'Settings export failed. Please try again.'
      };
      
      setNotification({ type: 'error', message: errorMessages[deviceType] });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Device-aware settings import functionality
  const importSettings = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!file.name.endsWith('.json')) {
        const errorMessages = {
          mobile: 'Use JSON files only.',
          tablet: 'Please select a JSON file.',
          desktop: 'Please select a valid JSON settings file.'
        };
        
        setNotification({ type: 'error', message: errorMessages[deviceType] });
        setTimeout(() => setNotification(null), 4000);
        reject(new Error('Invalid file type'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          
          if (!jsonData.appointmentSettings) {
            throw new Error('Invalid settings file format');
          }
          
          // Validate imported settings
          const importedSettings = jsonData.appointmentSettings;
          const validationResult = validateImportedSettings(importedSettings);
          
          if (!validationResult.isValid) {
            const errorMessages = {
              mobile: validationResult.mobileMessage || 'Invalid settings file.',
              tablet: validationResult.tabletMessage || validationResult.message || 'Invalid settings in file.',
              desktop: validationResult.message || 'The imported settings file contains invalid values.'
            };
            
            setNotification({ type: 'error', message: errorMessages[deviceType] });
            setTimeout(() => setNotification(null), 4000);
            reject(new Error(validationResult.message));
            return;
          }
          
          setAppointmentSettings(importedSettings);
          
          const successMessages = {
            mobile: 'Settings imported!',
            tablet: 'Settings imported successfully',
            desktop: 'Appointment settings have been imported successfully'
          };

          setNotification({ type: 'success', message: successMessages[deviceType] });
          setTimeout(() => setNotification(null), 3000);
          
          console.log(`Settings imported on ${deviceType}`);
          resolve();
        } catch (error) {
          console.error('Import error:', error);
          
          const errorMessages = {
            mobile: 'Import failed.',
            tablet: 'Failed to import settings. Invalid file.',
            desktop: 'Failed to import settings. Please check the file format.'
          };
          
          setNotification({ type: 'error', message: errorMessages[deviceType] });
          setTimeout(() => setNotification(null), 4000);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        const errorMessages = {
          mobile: 'File read error.',
          tablet: 'Error reading file.',
          desktop: 'Error reading the settings file.'
        };
        
        setNotification({ type: 'error', message: errorMessages[deviceType] });
        setTimeout(() => setNotification(null), 4000);
        reject(new Error('File read error'));
      };
      
      reader.readAsText(file);
    });
  };

  // Device-aware imported settings validation
  const validateImportedSettings = (settings: any): { 
    isValid: boolean; 
    message?: string; 
    mobileMessage?: string; 
    tabletMessage?: string;
  } => {
    if (!settings || typeof settings !== 'object') {
      return {
        isValid: false,
        message: 'Invalid settings format',
        mobileMessage: 'Bad file format',
        tabletMessage: 'Invalid settings format'
      };
    }
    
    // Check required fields
    const requiredFields: (keyof AppointmentSettings)[] = ['duration', 'bufferTime', 'advanceNotice', 'maxBookingWindow'];
    const missingFields = requiredFields.filter((field: keyof AppointmentSettings) => !(field in settings));
    
    if (missingFields.length > 0) {
      return {
        isValid: false,
        message: `Missing fields: ${missingFields.join(', ')}`,
        mobileMessage: 'Missing settings data',
        tabletMessage: `Missing: ${missingFields.join(', ')}`
      };
    }
    
    // Validate field types and ranges
    for (const field of requiredFields) {
      const value = settings[field];
      if (typeof value !== 'number' || isNaN(value) || value < 0) {
        return {
          isValid: false,
          message: `Invalid value for ${field}: ${value}`,
          mobileMessage: `Bad ${field} value`,
          tabletMessage: `Invalid ${field}: ${value}`
        };
      }
    }
    
    return { isValid: true };
  };

  // Device-aware settings analytics and recommendations
  const getSettingsAnalytics = () => {
    const settings = appointmentSettings;
    
    const analytics = {
      totalDurationWithBuffer: settings.duration + settings.bufferTime,
      dailyAppointmentCapacity: Math.floor(480 / (settings.duration + settings.bufferTime)), // 8-hour workday
      weeklyCapacity: Math.floor(480 / (settings.duration + settings.bufferTime)) * 5, // 5-day work week
      bufferRatio: Math.round((settings.bufferTime / settings.duration) * 100),
      isOptimizedForDevice: checkDeviceOptimization()
    };
    
    // Device-specific analytics logging
    if (deviceType === 'desktop') {
      console.log('Settings Analytics:', analytics);
    } else if (deviceType === 'mobile') {
      console.log(`Mobile analytics: ${analytics.dailyAppointmentCapacity} daily capacity, ${analytics.bufferRatio}% buffer`);
    }
    
    return analytics;
  };

  // Device-aware optimization checking
  const checkDeviceOptimization = (): boolean => {
    const settings = appointmentSettings;
    
    if (deviceType === 'mobile') {
      // Mobile optimization checks
      return (
        settings.duration >= 15 && settings.duration <= 120 && // Reasonable duration for mobile booking
        settings.bufferTime <= 30 && // Not too much buffer for touch interface
        settings.advanceNotice <= 72 && // Not too far in advance for mobile users
        settings.maxBookingWindow <= 90 // Reasonable booking window for mobile
      );
    } else if (deviceType === 'tablet') {
      // Tablet optimization checks
      return (
        settings.duration >= 15 && settings.duration <= 180 &&
        settings.bufferTime <= 60 &&
        settings.advanceNotice <= 168 &&
        settings.maxBookingWindow <= 180
      );
    } else {
      // Desktop optimization checks - more flexible
      return (
        settings.duration >= 15 && settings.duration <= 240 &&
        settings.bufferTime <= 120 &&
        settings.advanceNotice >= 1 &&
        settings.maxBookingWindow >= 1
      );
    }
  };

  // Device-aware settings recommendations
  const getSettingsRecommendations = (): string[] => {
    const settings = appointmentSettings;
    const recommendations: string[] = [];
    
    // Device-specific recommendations
    if (deviceType === 'mobile') {
      if (settings.duration > 90) {
        recommendations.push('Consider shorter appointments for mobile users');
      }
      if (settings.bufferTime > 20) {
        recommendations.push('Reduce buffer time for mobile efficiency');
      }
      if (settings.maxBookingWindow > 60) {
        recommendations.push('Shorter booking window works better on mobile');
      }
    } else if (deviceType === 'tablet') {
      if (settings.duration < 30) {
        recommendations.push('Consider longer appointments for tablet interface');
      }
      if (settings.bufferTime === 0) {
        recommendations.push('Add small buffer time for tablet scheduling');
      }
    } else {
      // Desktop recommendations
      if (settings.duration > 0 && settings.bufferTime === 0) {
        recommendations.push('Consider adding buffer time between appointments');
      }
      if (settings.advanceNotice < 12) {
        recommendations.push('Increase advance notice for better planning');
      }
      if (settings.maxBookingWindow > 180) {
        recommendations.push('Very long booking windows may reduce urgency');
      }
    }
    
    // Universal recommendations
    const bufferRatio = (settings.bufferTime / settings.duration) * 100;
    if (bufferRatio > 50) {
      recommendations.push('Buffer time seems excessive compared to appointment duration');
    }
    
    const dailyCapacity = Math.floor(480 / (settings.duration + settings.bufferTime));
    if (dailyCapacity < 3) {
      recommendations.push('Current settings allow very few daily appointments');
    } else if (dailyCapacity > 15) {
      recommendations.push('Consider if this many daily appointments is sustainable');
    }
    
    return recommendations;
  };

  // Device-aware bulk settings update
  const bulkUpdateSettings = (updates: Partial<AppointmentSettings>): void => {
    // Device-specific bulk update limits
    const maxUpdates = {
      mobile: 2,   // Limit simultaneous updates on mobile
      tablet: 3,   // Moderate updates on tablet
      desktop: 4   // Full updates on desktop
    };
    
    const updateKeys = Object.keys(updates) as (keyof AppointmentSettings)[];
    if (updateKeys.length > maxUpdates[deviceType]) {
      const messages = {
        mobile: `Can only update ${maxUpdates.mobile} settings at once.`,
        tablet: `Bulk updates limited to ${maxUpdates.tablet} settings.`,
        desktop: `Bulk updates limited to ${maxUpdates.desktop} settings at once.`
      };
      
      setNotification({ type: 'error', message: messages[deviceType] });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    // Apply updates with device-specific processing
    setAppointmentSettings(prev => {
      const updated = { ...prev };
      
      updateKeys.forEach((key: keyof AppointmentSettings) => {
        const value = updates[key];
        if (value !== undefined) {
          // Use the same processing logic as updateSettings
          let processedValue = value;
          
          if (deviceType === 'mobile') {
            switch (key) {
              case 'duration':
                processedValue = Math.max(15, Math.min(180, Math.round(value / 15) * 15));
                break;
              case 'bufferTime':
                processedValue = Math.max(0, Math.min(60, Math.round(value / 5) * 5));
                break;
              case 'advanceNotice':
                processedValue = Math.max(1, Math.min(168, Math.round(value)));
                break;
              case 'maxBookingWindow':
                processedValue = Math.max(1, Math.min(365, Math.round(value)));
                break;
            }
          } else if (deviceType === 'tablet') {
            switch (key) {
              case 'duration':
                processedValue = Math.max(15, Math.min(240, Math.round(value / 5) * 5));
                break;
              case 'bufferTime':
                processedValue = Math.max(0, Math.min(120, Math.round(value)));
                break;
              case 'advanceNotice':
                processedValue = Math.max(1, Math.min(336, Math.round(value)));
                break;
              case 'maxBookingWindow':
                processedValue = Math.max(1, Math.min(730, Math.round(value)));
                break;
            }
          }
          
          updated[key] = processedValue;
        }
      });

      return updated;
    });

    const successMessages = {
      mobile: `Updated ${updateKeys.length} settings!`,
      tablet: `Bulk update completed for ${updateKeys.join(', ')}`,
      desktop: `Successfully updated: ${updateKeys.join(', ')}`
    };

    setNotification({ type: 'success', message: successMessages[deviceType] });
    setTimeout(() => setNotification(null), deviceType === 'mobile' ? 2500 : 3000);
    
    console.log(`Bulk settings update completed on ${deviceType}: ${updateKeys.join(', ')}`);
  };

  // Device-aware settings comparison
  const compareWithDefaults = (): { [key in keyof AppointmentSettings]: { current: number; default: number; difference: number } } => {
    const defaults: AppointmentSettings = {
      duration: 45,
      bufferTime: 15,
      advanceNotice: 24,
      maxBookingWindow: 60
    };
    
    const comparison = {} as { [key in keyof AppointmentSettings]: { current: number; default: number; difference: number } };
    
    (Object.keys(defaults) as (keyof AppointmentSettings)[]).forEach((key: keyof AppointmentSettings) => {
      comparison[key] = {
        current: appointmentSettings[key],
        default: defaults[key],
        difference: appointmentSettings[key] - defaults[key]
      };
    });
    
    return comparison;
  };

  // Device-aware settings history (simulated for this implementation)
  const getSettingsHistory = (): { timestamp: string; settings: AppointmentSettings; deviceType: string }[] => {
    // In a real implementation, this would fetch from API
    // For now, return current settings as history
    return [{
      timestamp: new Date().toISOString(),
      settings: { ...appointmentSettings },
      deviceType: deviceType
    }];
  };

  // Device-aware auto-save functionality
  const setupAutoSave = (intervalMinutes: number = 5): () => void => {
    // Device-specific auto-save intervals
    const intervals = {
      mobile: Math.max(intervalMinutes, 10),  // Minimum 10 minutes on mobile
      tablet: Math.max(intervalMinutes, 5),   // Minimum 5 minutes on tablet
      desktop: Math.max(intervalMinutes, 3)   // Minimum 3 minutes on desktop
    };
    
    const actualInterval = intervals[deviceType] * 60 * 1000; // Convert to milliseconds
    let lastSettings = JSON.stringify(appointmentSettings);
    
    const intervalId = setInterval(async () => {
      const currentSettings = JSON.stringify(appointmentSettings);
      if (currentSettings !== lastSettings) {
        try {
          await saveAppointmentSettings();
          lastSettings = currentSettings;
          console.log(`Auto-saved settings on ${deviceType}`);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, actualInterval);
    
    console.log(`Auto-save setup for ${deviceType}: every ${intervals[deviceType]} minutes`);
    
    // Return cleanup function
    return () => {
      clearInterval(intervalId);
      console.log(`Auto-save cleared for ${deviceType}`);
    };
  };

  // Return all hook functionality with device-aware features
  return {
    // Core state
    appointmentSettings,
    isLoading,
    
    // Core actions
    loadAppointmentSettings,
    saveAppointmentSettings,
    updateSettings,
    
    // Device-aware features
    deviceType,
    isTouchDevice,
    resetSettings,
    applySettingsPreset,
    exportSettings,
    importSettings,
    getSettingsAnalytics,
    getSettingsRecommendations,
    bulkUpdateSettings,
    compareWithDefaults,
    getSettingsHistory,
    setupAutoSave,
    validateSettings,
    checkDeviceOptimization
  };
};