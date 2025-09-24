// src/app/techequity-demo/hooks/useFormData.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { FormData } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const useFormData = () => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    interest: ''
  });

  // Device-aware email validation patterns
  const validateEmail = (email: string): boolean => {
    if (deviceType === 'mobile') {
      // Mobile: Simplified email validation for touch typing
      const mobileEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return mobileEmailRegex.test(email);
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced validation
      const tabletEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return tabletEmailRegex.test(email);
    } else {
      // Desktop: Comprehensive email validation
      const desktopEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      return desktopEmailRegex.test(email);
    }
  };

  // Device-aware name validation
  const validateName = (name: string): boolean => {
    if (deviceType === 'mobile') {
      // Mobile: More lenient - allow shorter names due to touch typing challenges
      return name.trim().length >= 2;
    } else if (deviceType === 'tablet') {
      // Tablet: Moderate validation
      return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
    } else {
      // Desktop: Strict validation
      return name.trim().length >= 2 && /^[a-zA-Z\s'-]{2,50}$/.test(name);
    }
  };

  // Device-aware phone validation
  const validatePhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    
    if (deviceType === 'mobile') {
      // Mobile: Accept various formats due to touch input challenges
      return digits.length >= 10;
    } else if (deviceType === 'tablet') {
      // Tablet: Standard US phone validation
      return digits.length === 10 || digits.length === 11;
    } else {
      // Desktop: Strict validation
      return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
    }
  };

  // Device-specific phone formatting
  const formatPhoneNumber = (value: string): string => {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (deviceType === 'mobile') {
      // Mobile: Simplified formatting to reduce cognitive load
      if (phoneNumber.length <= 3) {
        return phoneNumber;
      } else if (phoneNumber.length <= 6) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      } else {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    } else {
      // Tablet/Desktop: Standard US formatting
      if (phoneNumber.length <= 3) {
        return phoneNumber;
      } else if (phoneNumber.length <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    }
  };

  // FIXED: Add company field handling for all device types in sanitizeInput function
// Replace the sanitizeInput function in useFormData.ts with this version

const sanitizeInput = (value: string, field: keyof FormData): string => {
  let sanitized = value;

  // Common sanitization for all devices
  sanitized = sanitized.replace(/[<>]/g, ''); // Remove potential HTML tags
  
  if (deviceType === 'mobile') {
    // Mobile: Less strict sanitization to accommodate touch typing errors
    if (field === 'email') {
      sanitized = sanitized.toLowerCase().trim();
    } else if (field === 'firstName' || field === 'lastName') {
      sanitized = sanitized.replace(/[^a-zA-Z\s'-]/g, '');
    } else if (field === 'company') {
      // Mobile: Allow spaces in company names
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s&.,'-]/g, '');
      sanitized = sanitized.replace(/\s+/g, ' '); // Normalize multiple spaces to single space
    }
  } else if (deviceType === 'tablet') {
    // Tablet: Moderate sanitization
    if (field === 'email') {
      sanitized = sanitized.toLowerCase().trim();
    } else if (field === 'firstName' || field === 'lastName') {
      sanitized = sanitized.replace(/[^a-zA-Z\s'-]/g, '');
      sanitized = sanitized.replace(/\s+/g, ' '); // Normalize spaces
    } else if (field === 'company') {
      // Tablet: Allow spaces in company names
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s&.,'-]/g, '');
      sanitized = sanitized.replace(/\s+/g, ' '); // Normalize spaces (no .trim())
    }
  } else {
    // Desktop: Comprehensive sanitization
    if (field === 'email') {
      sanitized = sanitized.toLowerCase().trim();
    } else if (field === 'firstName' || field === 'lastName') {
      sanitized = sanitized.replace(/[^a-zA-Z\s'-]/g, '');
      sanitized = sanitized.replace(/\s+/g, ' ').trim(); // Trim names
      sanitized = sanitized.replace(/^['-]|['-]$/g, ''); // Remove leading/trailing hyphens/apostrophes
    } else if (field === 'company') {
      // FIXED: Remove .trim() to allow trailing spaces during typing
      sanitized = sanitized.replace(/[^a-zA-Z0-9\s&.,'-]/g, '');
      sanitized = sanitized.replace(/\s+/g, ' '); // Normalize spaces but DON'T trim trailing
    }
  }

  return sanitized;
};

  // Device-aware phone change handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const formatted = formatPhoneNumber(e.target.value);
    
    // Device-specific phone length limits
    const maxLengths = {
      mobile: 12,   // More lenient for touch typing
      tablet: 14,   // Standard formatting
      desktop: 14   // Standard formatting
    };
    
    if (formatted.length <= maxLengths[deviceType]) {
      setFormData(prev => ({ ...prev, phone: formatted }));
    }
  };

  // FIXED: handleInputChange function in useFormData.ts
// Replace your existing handleInputChange function with this version

const handleInputChange = (field: keyof FormData, value: string): void => {
  let sanitized = sanitizeInput(value, field);
  
  // Device-specific field length limits
  const fieldLimits = {
    mobile: {
      firstName: 25,
      lastName: 25,
      email: 50,
      company: 40,
      interest: 100
    },
    tablet: {
      firstName: 30,
      lastName: 30,
      email: 60,
      company: 50,
      interest: 150
    },
    desktop: {
      firstName: 50,
      lastName: 50,
      email: 100,
      company: 100,
      interest: 200
    }
  };
  
  const limits = fieldLimits[deviceType];
  const fieldLimit = limits[field as keyof typeof limits] || 100;
  
  if (sanitized.length <= fieldLimit) {
    // FIXED: Apply capitalization BEFORE setting state, not after
    if ((field === 'firstName' || field === 'lastName' || field === 'company') && deviceType !== 'mobile') {
      sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
    }
    
    // Single state update with final processed value
    setFormData(prev => ({ ...prev, [field]: sanitized }));
  }
};

  // Device-aware form validation
  const validateForm = (): boolean => {
    const { firstName, lastName, email } = formData;
    
    if (deviceType === 'mobile') {
      // Mobile: Simplified validation - require only essential fields
      return !!(
        firstName.trim().length >= 2 &&
        lastName.trim().length >= 2 &&
        validateEmail(email)
      );
    } else if (deviceType === 'tablet') {
      // Tablet: Moderate validation
      return !!(
        validateName(firstName) &&
        validateName(lastName) &&
        validateEmail(email) &&
        (!formData.phone || validatePhone(formData.phone)) // Phone optional but validate if provided
      );
    } else {
      // Desktop: Comprehensive validation
      return !!(
        validateName(firstName) &&
        validateName(lastName) &&
        validateEmail(email) &&
        (!formData.phone || validatePhone(formData.phone)) &&
        formData.company.trim().length >= 2 // Company required on desktop
      );
    }
  };

  // Device-aware form validation with detailed errors
  const validateFormWithErrors = (): { isValid: boolean; errors: Partial<FormData> } => {
    const errors: Partial<FormData> = {};
    
    // Name validation
    if (!validateName(formData.firstName)) {
      errors.firstName = deviceType === 'mobile' 
        ? 'First name too short'
        : deviceType === 'tablet'
        ? 'Enter a valid first name'
        : 'First name must be 2-50 characters, letters only';
    }
    
    if (!validateName(formData.lastName)) {
      errors.lastName = deviceType === 'mobile'
        ? 'Last name too short'
        : deviceType === 'tablet'
        ? 'Enter a valid last name'
        : 'Last name must be 2-50 characters, letters only';
    }
    
    // Email validation
    if (!validateEmail(formData.email)) {
      errors.email = deviceType === 'mobile'
        ? 'Check email format'
        : deviceType === 'tablet'
        ? 'Enter a valid email address'
        : 'Please enter a valid email address';
    }
    
    // Phone validation (if provided)
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = deviceType === 'mobile'
        ? 'Check phone number'
        : deviceType === 'tablet'
        ? 'Enter a valid phone number'
        : 'Please enter a valid 10-digit phone number';
    }
    
    // Company validation (desktop only)
    if (deviceType === 'desktop' && formData.company.trim().length < 2) {
      errors.company = 'Company name is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Device-aware auto-complete suggestions
  const getAutoCompleteType = (field: keyof FormData): string => {
    const autoCompleteMap = {
      firstName: 'given-name',
      lastName: 'family-name',
      email: 'email',
      phone: 'tel',
      company: 'organization',
      interest: 'off'
    };
    
    // Mobile: Disable autocomplete for sensitive fields to reduce keyboard complexity
    if (deviceType === 'mobile' && (field === 'company' || field === 'interest')) {
      return 'off';
    }
    
    return autoCompleteMap[field];
  };

  // Device-aware input mode suggestions
  const getInputMode = (field: keyof FormData): string => {
    if (field === 'email') return 'email';
    if (field === 'phone') return 'tel';
    if (deviceType === 'mobile') {
      // Mobile: Optimize keyboard for specific fields
      if (field === 'firstName' || field === 'lastName') return 'text';
      if (field === 'company' || field === 'interest') return 'text';
    }
    return 'text';
  };

  // Device-specific placeholder text
  const getPlaceholder = (field: keyof FormData): string => {
    const placeholders = {
      mobile: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@email.com',
        phone: '555-123-4567',
        company: 'Company',
        interest: 'How can we help?'
      },
      tablet: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@company.com',
        phone: '(555) 123-4567',
        company: 'Your Company',
        interest: 'What services interest you?'
      },
      desktop: {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@company.com',
        phone: '(555) 123-4567',
        company: 'Your Company Name',
        interest: 'Tell us about your business needs...'
      }
    };
    
    return placeholders[deviceType][field];
  };

  // Device-aware form reset
  const resetForm = (): void => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      interest: ''
    });
    
    // Device-specific feedback for form reset
    if (deviceType === 'mobile') {
      // Mobile: Haptic feedback simulation (would trigger actual haptic on real device)
      console.log('Form reset - Mobile haptic feedback triggered');
    }
  };

  // Device-aware form pre-population from session data
  const prePopulateFromSession = (sessionData: any): void => {
    if (sessionData) {
      const updates: Partial<FormData> = {};
      
      // Safely extract and validate session data based on device capabilities
      if (sessionData.userName) {
        const nameParts = sessionData.userName.split(' ');
        if (nameParts.length >= 2) {
          updates.firstName = sanitizeInput(nameParts[0], 'firstName');
          updates.lastName = sanitizeInput(nameParts.slice(1).join(' '), 'lastName');
        }
      }
      
      if (sessionData.email && validateEmail(sessionData.email)) {
        updates.email = sanitizeInput(sessionData.email, 'email');
      }
      
      if (sessionData.phone && validatePhone(sessionData.phone)) {
        updates.phone = formatPhoneNumber(sessionData.phone);
      }
      
      if (sessionData.company) {
        updates.company = sanitizeInput(sessionData.company, 'company');
      }
      
      setFormData(prev => ({ ...prev, ...updates }));
    }
  };

  // Device-specific form submission preparation
  const prepareFormForSubmission = (): FormData & { deviceInfo: any } => {
    const cleanedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      phone: formData.phone.replace(/\D/g, ''), // Store only digits
      company: formData.company.trim(),
      interest: formData.interest.trim()
    };
    
    // Add device context for analytics/processing
    const deviceInfo = {
      deviceType,
      isTouchDevice,
      inputMethod: deviceType === 'mobile' ? 'touch' : 
                   deviceType === 'tablet' ? 'hybrid' : 'keyboard',
      timestamp: new Date().toISOString()
    };
    
    return { ...cleanedData, deviceInfo };
  };

  // Device-aware error message formatting
  const getErrorMessage = (field: keyof FormData, error: string): string => {
    if (deviceType === 'mobile') {
      // Mobile: Concise error messages
      const mobileErrors: Record<string, string> = {
        firstName: 'Name too short',
        lastName: 'Last name too short', 
        email: 'Invalid email',
        phone: 'Invalid phone',
        company: 'Company required',
        interest: 'Please specify'
      };
      return mobileErrors[field] || error;
    } else if (deviceType === 'tablet') {
      // Tablet: Moderate detail
      const tabletErrors: Record<string, string> = {
        firstName: 'Enter valid first name',
        lastName: 'Enter valid last name',
        email: 'Enter valid email address',
        phone: 'Enter valid phone number',
        company: 'Company name required',
        interest: 'Please tell us your interest'
      };
      return tabletErrors[field] || error;
    } else {
      // Desktop: Detailed error messages
      return error; // Use the detailed error from validateFormWithErrors
    }
  };

  // Touch-optimized input helpers
  const getTouchOptimizedProps = (field: keyof FormData) => {
    if (!isTouchDevice) return {};
    
    return {
      autoComplete: getAutoCompleteType(field),
      inputMode: getInputMode(field),
      autoCapitalize: (field === 'firstName' || field === 'lastName' || field === 'company') ? 'words' : 'none',
      autoCorrect: field === 'email' ? 'off' : 'on',
      spellCheck: field === 'email' || field === 'phone' ? false : true
    };
  };

  // Device-aware form analytics
  const trackFormInteraction = (action: string, field?: keyof FormData, value?: any): void => {
    const analyticsData = {
      action,
      field,
      deviceType,
      isTouchDevice,
      formCompleteness: Object.values(formData).filter(v => v.trim().length > 0).length,
      timestamp: new Date().toISOString()
    };
    
    // In a real implementation, this would send to analytics service
    console.log('Form interaction:', analyticsData);
  };

  // Performance optimization for mobile
  const getOptimizedFormData = () => {
    if (deviceType === 'mobile') {
      // Return only essential fields for mobile to reduce processing
      return {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };
    }
    return formData;
  };

  return {
    // Core state
    formData,
    setFormData,
    
    // Device-aware handlers
    handlePhoneChange,
    handleInputChange,
    resetForm,
    
    // Validation
    validateForm,
    validateFormWithErrors,
    validateEmail,
    validateName,
    validatePhone,
    
    // Device-specific utilities
    getPlaceholder,
    getAutoCompleteType,
    getInputMode,
    getTouchOptimizedProps,
    getErrorMessage,
    
    // Advanced features
    prePopulateFromSession,
    prepareFormForSubmission,
    trackFormInteraction,
    getOptimizedFormData,
    
    // Device info
    deviceType,
    isTouchDevice
  };
};