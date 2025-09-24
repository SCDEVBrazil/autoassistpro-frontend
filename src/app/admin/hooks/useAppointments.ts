// src/app/admin/hooks/useAppointments.ts - PART 1/3

import { useState, useCallback } from 'react';
import { Appointment, EditAppointmentForm, Notification } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const useAppointments = (setNotification: (notification: Notification | null) => void) => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  const [scheduledCalls, setScheduledCalls] = useState<Appointment[]>([]);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState<EditAppointmentForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    interest: '',
    date: '',
    time: '',
    status: 'confirmed'
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Confirmation modal state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);

  // Device-aware appointment loading with different strategies
  const loadScheduledCalls = useCallback(async () => {
    try {
      // Device-specific retry and timeout configuration
      const loadConfig = {
        mobile: { maxRetries: 2, timeout: 8000, batchSize: 20 },
        tablet: { maxRetries: 3, timeout: 6000, batchSize: 50 },
        desktop: { maxRetries: 3, timeout: 5000, batchSize: 100 }
      };

      const { maxRetries, timeout, batchSize } = loadConfig[deviceType];

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          // Device-specific query parameters for performance
          const queryParams = new URLSearchParams({
            client: 'techequity',
            limit: batchSize.toString(),
            deviceType: deviceType,
            isTouchDevice: isTouchDevice.toString()
          });

          const response = await fetch(`/api/appointments?${queryParams}`, {
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          const result = await response.json();
          
          if (result.success) {
            // Device-specific data processing
            let processedData = result.data;
            
            if (deviceType === 'mobile') {
              // Mobile: Sort by upcoming first, limit recent data
              processedData = processedData
                .sort((a: Appointment, b: Appointment) => {
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);
                  const now = new Date();
                  
                  // Prioritize upcoming appointments for mobile
                  const aIsUpcoming = dateA >= now;
                  const bIsUpcoming = dateB >= now;
                  
                  if (aIsUpcoming && !bIsUpcoming) return -1;
                  if (!aIsUpcoming && bIsUpcoming) return 1;
                  
                  return dateA.getTime() - dateB.getTime();
                })
                .slice(0, 15); // Limit to 15 most relevant for mobile
            } else if (deviceType === 'tablet') {
              // Tablet: Balanced sorting and reasonable limit
              processedData = processedData
                .sort((a: Appointment, b: Appointment) => {
                  const dateA = new Date(a.date);
                  const dateB = new Date(b.date);
                  return dateA.getTime() - dateB.getTime();
                })
                .slice(0, 30); // Limit to 30 for tablet
            }
            // Desktop: Show all data without processing

            setScheduledCalls(processedData);
            console.log(`Loaded ${processedData.length} appointments for ${deviceType}`);
            break;
          } else {
            console.error('Failed to load appointments:', result.error);
            if (attempt === maxRetries - 1) {
              // Device-specific error notifications
              const errorMessages = {
                mobile: 'Unable to load appointments. Check connection.',
                tablet: 'Failed to load appointments: ' + result.error,
                desktop: 'Failed to load appointments: ' + result.error
              };
              
              setNotification({ 
                type: 'error', 
                message: errorMessages[deviceType]
              });
              
              setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 5000);
            }
          }
        } catch (error) {
          console.error(`Load attempt ${attempt + 1} failed:`, error);
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
              mobile: 'Connection error. Please try again.',
              tablet: 'Error loading appointments. Please try again.',
              desktop: 'Error loading appointments. Please try again.'
            };
            
            setNotification({ 
              type: 'error', 
              message: errorMessages[deviceType]
            });
            setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 5000);
          }
        }
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      
      // Device-specific final error messages
      const errorMessages = {
        mobile: 'App error. Please restart.',
        tablet: 'Error loading appointments. Please try again.',
        desktop: 'Error loading appointments. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 5000);
    }
  }, [setNotification, deviceType, isTouchDevice]);

  // Device-aware delete initiation with different UX patterns
  const initiateDeleteAppointment = (appointmentId: number) => {
    setAppointmentToDelete(appointmentId);
    setShowDeleteConfirmation(true);
    
    // Device-specific interaction logging
    console.log(`Delete initiated on ${deviceType} for appointment ${appointmentId}`);
    
    if (deviceType === 'mobile' && isTouchDevice) {
      // Mobile: Additional touch interaction tracking
      console.log('Touch delete interaction recorded');
    }
  };

  // Device-aware delete confirmation with optimized error handling
  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;

    try {
      setIsLoading(true);
      
      // Device-specific delete configuration
      const deleteConfig = {
        mobile: { timeout: 10000, showProgress: true },
        tablet: { timeout: 8000, showProgress: false },
        desktop: { timeout: 6000, showProgress: false }
      };

      const { timeout, showProgress } = deleteConfig[deviceType];

      if (showProgress) {
        console.log(`Deleting appointment on ${deviceType}...`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`/api/appointments?id=${appointmentToDelete}&client=techequity&deviceType=${deviceType}`, {
        method: 'DELETE',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      
      if (result.success) {
        // Device-specific success notifications
        const successMessages = {
          mobile: 'Deleted!',
          tablet: 'Appointment deleted successfully!',
          desktop: 'Appointment deleted successfully!'
        };
        
        setNotification({ 
          type: 'success', 
          message: successMessages[deviceType]
        });
        
        // Device-specific notification timing
        const successDurations = {
          mobile: 2000,
          tablet: 3000,
          desktop: 3000
        };
        
        setTimeout(() => setNotification(null), successDurations[deviceType]);
        loadScheduledCalls();
      } else {
        console.error('Failed to delete appointment:', result.error);
        
        // Device-specific error messages
        const errorMessages = {
          mobile: 'Delete failed. Try again.',
          tablet: 'Failed to delete appointment: ' + result.error,
          desktop: 'Failed to delete appointment: ' + result.error
        };
        
        setNotification({ 
          type: 'error', 
          message: errorMessages[deviceType]
        });
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 5000);
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      
      // Device-specific error handling
      const errorMessages = {
        mobile: 'Connection error.',
        tablet: 'Error deleting appointment. Please try again.',
        desktop: 'Error deleting appointment. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 5000);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirmation(false);
      setAppointmentToDelete(null);
    }
  };

  // Device-aware cancel delete with different interaction patterns
  const cancelDeleteAppointment = () => {
    setShowDeleteConfirmation(false);
    setAppointmentToDelete(null);
    
    // Device-specific interaction logging
    if (deviceType === 'mobile' && isTouchDevice) {
      console.log('Touch cancel interaction recorded');
    } else if (deviceType === 'tablet') {
      console.log('Hybrid cancel interaction recorded');
    } else {
      console.log('Click cancel interaction recorded');
    }
  };

  // Device-aware edit modal opening with different data preparation
  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    
    // Device-specific form preparation
    const baseForm = {
      firstName: appointment.firstName,
      lastName: appointment.lastName,
      email: appointment.email,
      phone: appointment.phone || '',
      company: appointment.company || '',
      interest: appointment.interest || 'general',
      date: appointment.date,
      time: appointment.time,
      status: appointment.status
    };
    
    if (deviceType === 'mobile') {
      // Mobile: Pre-validate critical fields
      setEditForm({
        ...baseForm,
        firstName: baseForm.firstName.trim(),
        lastName: baseForm.lastName.trim(),
        email: baseForm.email.trim().toLowerCase()
      });
      console.log('Mobile edit modal opened with pre-validation');
    } else if (deviceType === 'tablet') {
      // Tablet: Standard preparation with formatting
      setEditForm({
        ...baseForm,
        phone: baseForm.phone ? formatPhoneNumber(baseForm.phone) : ''
      });
      console.log('Tablet edit modal opened with formatting');
    } else {
      // Desktop: Full form preparation
      setEditForm(baseForm);
      console.log('Desktop edit modal opened');
    }
    
    // Device-specific modal behavior tracking
    if (isTouchDevice) {
      console.log(`Touch edit initiated for appointment ${appointment.id}`);
    }
  };

  // Device-aware modal closing with different cleanup strategies
  const closeEditModal = () => {
    setEditingAppointment(null);
    
    // Device-specific form reset timing
    if (deviceType === 'mobile') {
      // Mobile: Immediate reset for better performance
      setEditForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        interest: '',
        date: '',
        time: '',
        status: 'confirmed'
      });
      console.log('Mobile edit modal closed with immediate reset');
    } else {
      // Tablet/Desktop: Delayed reset to allow for potential re-opening
      setTimeout(() => {
        setEditForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          interest: '',
          date: '',
          time: '',
          status: 'confirmed'
        });
      }, deviceType === 'tablet' ? 500 : 1000);
      console.log(`${deviceType} edit modal closed with delayed reset`);
    }
  };

  // Device-aware appointment saving with different validation strategies
  const saveEditedAppointment = async () => {
    if (!editingAppointment) return;

    try {
      setIsLoading(true);
      
      // Device-specific validation
      const validationResults = validateEditForm();
      if (!validationResults.isValid) {
        const errorMessages = {
          mobile: validationResults.mobileMessage || 'Please check your input.',
          tablet: validationResults.tabletMessage || validationResults.message || 'Please check all required fields.',
          desktop: validationResults.message || 'Please check all required fields and try again.'
        };
        
        setNotification({
          type: 'error',
          message: errorMessages[deviceType]
        });
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 4000);
        setIsLoading(false);
        return;
      }

      // Device-specific save configuration
      const saveConfig = {
        mobile: { timeout: 12000, showProgress: true, validateOnSave: true },
        tablet: { timeout: 10000, showProgress: false, validateOnSave: true },
        desktop: { timeout: 8000, showProgress: false, validateOnSave: false }
      };

      const { timeout, showProgress, validateOnSave } = saveConfig[deviceType];

      if (showProgress) {
        console.log(`Saving appointment on ${deviceType}...`);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Prepare request payload with device context
      const requestPayload = {
        id: editingAppointment.id,
        clientId: 'techequity',
        ...editForm,
        deviceType: deviceType,
        isTouchDevice: isTouchDevice,
        editMethod: deviceType === 'mobile' ? 'mobile_wizard' : 
                   deviceType === 'tablet' ? 'tablet_form' : 'desktop_form',
        lastModified: new Date().toISOString()
      };

      // Additional validation for mobile if enabled
      // Additional validation for mobile if enabled
      if (validateOnSave && deviceType === 'mobile') {
        (requestPayload as any).mobileValidated = true;
      }

      const response = await fetch('/api/appointments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      
      if (result.success) {
        // Device-specific success handling
        const successMessages = {
          mobile: 'Saved!',
          tablet: 'Appointment updated successfully!',
          desktop: 'Appointment updated successfully!'
        };
        
        setNotification({ 
          type: 'success', 
          message: successMessages[deviceType]
        });
        
        // Device-specific success timing
        const successDurations = {
          mobile: 2000,
          tablet: 3000,
          desktop: 3000
        };
        
        setTimeout(() => setNotification(null), successDurations[deviceType]);
        
        // Device-specific modal closing behavior
        if (deviceType === 'mobile') {
          // Mobile: Immediate close and refresh
          closeEditModal();
          loadScheduledCalls();
        } else if (deviceType === 'tablet') {
          // Tablet: Brief confirmation then close
          setTimeout(() => {
            closeEditModal();
            loadScheduledCalls();
          }, 1000);
        } else {
          // Desktop: Standard timing
          setTimeout(() => {
            closeEditModal();
            loadScheduledCalls();
          }, 1500);
        }
      } else {
        console.error('Failed to update appointment:', result.error);
        
        // Device-specific error messages
        const errorMessages = {
          mobile: 'Save failed. Check connection.',
          tablet: 'Failed to update appointment: ' + result.error,
          desktop: 'Failed to update appointment: ' + result.error
        };
        
        setNotification({ 
          type: 'error', 
          message: errorMessages[deviceType]
        });
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 5000);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      
      // Device-specific error handling
      const errorMessages = {
        mobile: 'Connection error.',
        tablet: 'Error updating appointment. Please try again.',
        desktop: 'Error updating appointment. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Device-aware phone number formatting with different validation levels
  const formatPhoneNumber = (value: string): string => {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (deviceType === 'mobile') {
      // Mobile: Simplified formatting for touch typing
      if (phoneNumber.length <= 3) {
        return phoneNumber;
      } else if (phoneNumber.length <= 6) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      } else {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced formatting
      if (phoneNumber.length <= 3) {
        return phoneNumber;
      } else if (phoneNumber.length <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    } else {
      // Desktop: Full formatting
      if (phoneNumber.length <= 3) {
        return phoneNumber;
      } else if (phoneNumber.length <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    }
  };

  // Device-aware form validation with different strictness levels
  const validateEditForm = (): { isValid: boolean; message?: string; mobileMessage?: string; tabletMessage?: string } => {
    const requiredFields = ['firstName', 'lastName', 'email', 'date', 'time'];
    const missingFields = requiredFields.filter(field => !editForm[field as keyof EditAppointmentForm]?.trim());
    
    if (missingFields.length > 0) {
      const fieldNames = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        date: 'Date',
        time: 'Time'
      };
      
      const missingFieldNames = missingFields.map(field => fieldNames[field as keyof typeof fieldNames]);
      
      return {
        isValid: false,
        message: `Please fill in: ${missingFieldNames.join(', ')}`,
        mobileMessage: `Missing: ${missingFieldNames.slice(0, 2).join(', ')}${missingFieldNames.length > 2 ? '...' : ''}`,
        tabletMessage: `Required fields missing: ${missingFieldNames.join(', ')}`
      };
    }
    
    // Email validation with device-specific requirements
    const emailRegex = deviceType === 'mobile' ? 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/ : // Simplified for mobile
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(editForm.email)) {
      return {
        isValid: false,
        message: 'Please enter a valid email address',
        mobileMessage: 'Invalid email',
        tabletMessage: 'Please enter a valid email address'
      };
    }
    
    // Phone validation (if provided) with device-specific requirements
    if (editForm.phone && editForm.phone.trim()) {
      const phoneDigits = editForm.phone.replace(/\D/g, '');
      const minLength = deviceType === 'mobile' ? 7 : 10; // More lenient on mobile
      
      if (phoneDigits.length < minLength) {
        return {
          isValid: false,
          message: `Phone number must have at least ${minLength} digits`,
          mobileMessage: 'Phone too short',
          tabletMessage: `Phone must have ${minLength}+ digits`
        };
      }
    }
    
    return { isValid: true };
  };

  // Device-aware form change handling with different input processing
  const handleEditFormChange = (field: keyof EditAppointmentForm, value: string) => {
    if (field === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setEditForm(prev => ({ ...prev, [field]: formattedPhone }));
      
      // Device-specific input tracking
      if (deviceType === 'mobile' && isTouchDevice) {
        console.log('Touch phone input recorded');
      }
    } else if (field === 'email') {
      // Device-specific email processing
      const processedEmail = deviceType === 'mobile' ? 
        value.toLowerCase().trim() : // Mobile: Auto-lowercase and trim
        value.trim(); // Tablet/Desktop: Just trim
      
      setEditForm(prev => ({ ...prev, [field]: processedEmail }));
    } else if (field === 'firstName' || field === 'lastName') {
      // Device-specific name processing
      const processedName = deviceType === 'mobile' ?
        value.replace(/[^a-zA-Z\s'-]/g, '').slice(0, 25) : // Mobile: Restrict characters and length
        value.slice(0, 50); // Tablet/Desktop: Just length limit
      
      setEditForm(prev => ({ ...prev, [field]: processedName }));
    } else {
      // Standard field processing
      setEditForm(prev => ({ ...prev, [field]: value }));
    }
    
    // Device-specific real-time validation feedback
    if (deviceType === 'mobile') {
      // Mobile: Minimal validation during typing for performance
      if (field === 'email' && value.includes('@') && !value.includes('.')) {
        console.log('Mobile: Email validation hint needed');
      }
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced validation
      debounceValidation(field, value);
    } else {
      // Desktop: Real-time validation
      validateFieldRealTime(field, value);
    }
  };

  // Device-aware real-time field validation
  const validateFieldRealTime = (field: keyof EditAppointmentForm, value: string): void => {
    if (field === 'email' && value.length > 3) {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValid && deviceType === 'desktop') {
        console.log('Desktop: Real-time email validation failed');
      }
    } else if (field === 'phone' && value.length > 5) {
      const phoneDigits = value.replace(/\D/g, '');
      if (phoneDigits.length < 10 && deviceType === 'desktop') {
        console.log('Desktop: Real-time phone validation warning');
      }
    }
  };

  // Device-aware debounced validation for tablet
  const debounceValidation = (() => {
    let timeoutId: NodeJS.Timeout;
    return (field: keyof EditAppointmentForm, value: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        validateFieldRealTime(field, value);
      }, 500);
    };
  })();

  // Device-aware appointment filtering with different performance optimizations
  const getOptimizedAppointments = (startIndex: number = 0, batchSize?: number): Appointment[] => {
    const batchSizes = {
      mobile: 5,     // Small batches for mobile performance
      tablet: 10,    // Medium batches for tablets
      desktop: 20    // Larger batches for desktop
    };
    
    const size = batchSize || batchSizes[deviceType];
    return scheduledCalls.slice(startIndex, startIndex + size);
  };

  // Device-aware appointment search with different strategies
  const searchAppointments = (query: string): Appointment[] => {
    if (!query.trim()) return scheduledCalls;
    
    const searchTerm = query.toLowerCase().trim();
    
    return scheduledCalls.filter(appointment => {
      const searchFields = [
        `${appointment.firstName} ${appointment.lastName}`.toLowerCase(),
        appointment.email.toLowerCase(),
        appointment.company?.toLowerCase() || '',
        appointment.phone?.replace(/\D/g, '') || ''
      ];
      
      if (deviceType === 'mobile') {
        // Mobile: Simple partial matching for performance
        return searchFields.some(field => field.includes(searchTerm));
      } else if (deviceType === 'tablet') {
        // Tablet: Balanced search with word matching
        return searchFields.some(field => 
          field.includes(searchTerm) || 
          field.split(' ').some(word => word.startsWith(searchTerm))
        );
      } else {
        // Desktop: Advanced search with fuzzy matching
        return searchFields.some(field => {
          if (field.includes(searchTerm)) return true;
          
          // Word-based search
          const words = field.split(' ');
          if (words.some(word => word.startsWith(searchTerm))) return true;
          
          // Simple fuzzy search for desktop
          if (searchTerm.length > 2) {
            return field.replace(/\s/g, '').includes(searchTerm.replace(/\s/g, ''));
          }
          
          return false;
        });
      }
    });
  };

  // Device-aware status update with different confirmation patterns
  const updateAppointmentStatus = async (appointmentId: number, newStatus: string): Promise<void> => {
    try {
      // Device-specific confirmation requirements
      const confirmationRequired = {
        mobile: ['cancelled'], // Only confirm cancellations on mobile
        tablet: ['cancelled', 'completed'],
        desktop: ['cancelled', 'completed']
      };
      
      const requiresConfirmation = confirmationRequired[deviceType].includes(newStatus);
      
      if (requiresConfirmation) {
        const confirmMessages = {
          mobile: `${newStatus === 'cancelled' ? 'Cancel' : 'Complete'} appointment?`,
          tablet: `Are you sure you want to mark this appointment as ${newStatus}?`,
          desktop: `Are you sure you want to change the appointment status to ${newStatus}? This action cannot be undone.`
        };
        
        const confirmed = confirm(confirmMessages[deviceType]);
        if (!confirmed) return;
      }
      
      setIsLoading(true);
      
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: appointmentId,
          clientId: 'techequity',
          status: newStatus,
          deviceType: deviceType,
          updateMethod: 'status_only'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Device-specific success notifications
        const successMessages = {
          mobile: 'Updated!',
          tablet: `Status updated to ${newStatus}`,
          desktop: `Appointment status successfully updated to ${newStatus}`
        };
        
        setNotification({ 
          type: 'success', 
          message: successMessages[deviceType]
        });
        
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 2000 : 3000);
        loadScheduledCalls();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      
      const errorMessages = {
        mobile: 'Update failed.',
        tablet: 'Failed to update status. Please try again.',
        desktop: 'Failed to update appointment status. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Device-aware bulk operations with different confirmation strategies
  const bulkDeleteAppointments = async (appointmentIds: number[]): Promise<void> => {
    if (appointmentIds.length === 0) return;
    
    // Device-specific bulk operation limits
    const maxBulkSize = {
      mobile: 3,   // Limit bulk operations on mobile
      tablet: 10,  // Medium bulk size for tablet
      desktop: 50  // Large bulk size for desktop
    };
    
    if (appointmentIds.length > maxBulkSize[deviceType]) {
      const limitMessages = {
        mobile: `Can only delete ${maxBulkSize.mobile} items at once.`,
        tablet: `Bulk delete limited to ${maxBulkSize.tablet} items.`,
        desktop: `Bulk delete limited to ${maxBulkSize.desktop} items.`
      };
      
      setNotification({ 
        type: 'error', 
        message: limitMessages[deviceType]
      });
      setTimeout(() => setNotification(null), 4000);
      return;
    }
    
    // Device-specific confirmation
    const confirmMessages = {
      mobile: `Delete ${appointmentIds.length} appointments?`,
      tablet: `Delete ${appointmentIds.length} selected appointments? This cannot be undone.`,
      desktop: `Are you sure you want to delete ${appointmentIds.length} selected appointments? This action cannot be undone and will permanently remove all associated data.`
    };
    
    const confirmed = confirm(confirmMessages[deviceType]);
    if (!confirmed) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/appointments/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: appointmentIds,
          clientId: 'techequity',
          deviceType: deviceType
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const successMessages = {
          mobile: `${appointmentIds.length} deleted!`,
          tablet: `${appointmentIds.length} appointments deleted successfully`,
          desktop: `Successfully deleted ${appointmentIds.length} appointments`
        };
        
        setNotification({ 
          type: 'success', 
          message: successMessages[deviceType]
        });
        
        setTimeout(() => setNotification(null), deviceType === 'mobile' ? 2500 : 3500);
        loadScheduledCalls();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error in bulk delete:', error);
      
      const errorMessages = {
        mobile: 'Bulk delete failed.',
        tablet: 'Failed to delete appointments. Please try again.',
        desktop: 'Bulk delete operation failed. Please try again.'
      };
      
      setNotification({ 
        type: 'error', 
        message: errorMessages[deviceType]
      });
      setTimeout(() => setNotification(null), deviceType === 'mobile' ? 3000 : 5000);
    } finally {
      setIsLoading(false);
    }
  };

  // Return all hook functionality with device-aware features
  return {
    // Core state
    scheduledCalls,
    editingAppointment,
    editForm,
    isLoading,
    showDeleteConfirmation,
    appointmentToDelete,
    
    // Core actions
    loadScheduledCalls,
    initiateDeleteAppointment,
    confirmDeleteAppointment,
    cancelDeleteAppointment,
    openEditModal,
    closeEditModal,
    saveEditedAppointment,
    handleEditFormChange,
    
    // Device-aware features
    deviceType,
    isTouchDevice,
    getOptimizedAppointments,
    searchAppointments,
    updateAppointmentStatus,
    bulkDeleteAppointments,
    validateEditForm,
    formatPhoneNumber
  };
};