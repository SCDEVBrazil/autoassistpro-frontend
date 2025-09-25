// src/app/admin/components/BookingsTab/hooks/useAppointmentFormatting.ts - PART 1/3

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const useAppointmentFormatting = () => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();

  // Device-aware session ID formatting with different detail levels
  const formatSessionId = useCallback((sessionId: string): string => {
    if (!sessionId) return 'N/A';
    
    const parts = sessionId.split('_');
    
    if (parts.length > 1) {
      // Return the full numeric part for ALL devices, stop at second underscore if exists
      const numericPart = parts[1];
      const secondUnderscoreIndex = numericPart.indexOf('_');
      if (secondUnderscoreIndex > 0) {
        return numericPart.substring(0, secondUnderscoreIndex);
      }
      return numericPart; // Return FULL numeric part for all devices
    }
    
    return sessionId;
  }, []);

  // Device-aware status styling with touch-optimized variants
  const getStatusStyles = useCallback((status: string): string => {
    const baseStyles = {
      confirmed: {
        mobile: 'bg-green-800/60 text-green-200 border border-green-600/60',
        tablet: 'bg-green-900/40 text-green-300 border border-green-700/50',
        desktop: 'bg-green-900/50 text-green-300 border border-green-700/50'
      },
      pending: {
        mobile: 'bg-yellow-800/60 text-yellow-200 border border-yellow-600/60',
        tablet: 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/50',
        desktop: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700/50'
      },
      cancelled: {
        mobile: 'bg-red-800/60 text-red-200 border border-red-600/60',
        tablet: 'bg-red-900/40 text-red-300 border border-red-700/50',
        desktop: 'bg-red-900/50 text-red-300 border border-red-700/50'
      },
      completed: {
        mobile: 'bg-blue-800/60 text-blue-200 border border-blue-600/60',
        tablet: 'bg-blue-900/40 text-blue-300 border border-blue-700/50',
        desktop: 'bg-blue-900/50 text-blue-300 border border-blue-700/50'
      },
      default: {
        mobile: 'bg-gray-800/60 text-gray-200 border border-gray-600/60',
        tablet: 'bg-gray-900/40 text-gray-300 border border-gray-700/50',
        desktop: 'bg-gray-900/50 text-gray-300 border border-gray-700/50'
      }
    };

    const statusKey = status as keyof typeof baseStyles;
    const deviceStyles = baseStyles[statusKey] || baseStyles.default;
    return deviceStyles[deviceType];
  }, [deviceType]);

  // Device-aware date formatting with different verbosity levels
  const formatDisplayDate = useCallback((dateString: string): string => {
    if (!dateString) return 'TBD';
    
    try {
      // Handle both "YYYY-MM-DD" and ISO date formats
      let date: Date;
      
      if (dateString.includes('T')) {
        // ISO format like "2025-09-26T05:00:00.000Z"
        date = new Date(dateString);
      } else {
        // Simple date format like "2025-09-26"
        const [year, month, day] = dateString.split('-').map(Number);
        if (!year || !month || !day) {
          return 'Invalid Date';
        }
        date = new Date(year, month - 1, day); // month is 0-indexed
      }
      
      // Validate the date
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      if (deviceType === 'mobile') {
        // Mobile: Compact date format
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } else if (deviceType === 'tablet') {
        // Tablet: Balanced date format
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      } else {
        // Desktop: Full date format
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch (error) {
      console.warn('Date formatting error:', error, 'for date:', dateString);
      return 'Invalid Date';
    }
  }, [deviceType]);

  // Device-aware date checking with different precision requirements
  const isUpcoming = useCallback((dateString: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(dateString);
    appointmentDate.setHours(0, 0, 0, 0);
    
    // All devices use the same logic, but could add device-specific tolerance
    return appointmentDate >= today;
  }, []);

  // Device-aware time formatting
  const formatDisplayTime = useCallback((timeString: string): string => {
    if (!timeString) return 'TBD';
    
    // Handle both "10:00 AM" and "10:00" formats
    let cleanTimeString = timeString;
    
    // If it already has AM/PM, parse it directly
    if (timeString.includes('AM') || timeString.includes('PM')) {
      const [time, period] = timeString.split(' ');
      return `${time} ${period}`;
    }
    
    // If it's 24-hour format, convert it
    const [hours, minutes] = cleanTimeString.split(':').map(Number);
    const date = new Date(2000, 0, 1, hours, minutes);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  // Device-aware phone number formatting
  const formatPhoneNumber = useCallback((phoneString: string): string => {
    if (!phoneString) return '';
    
    // Remove all non-digit characters
    const phoneNumber = phoneString.replace(/\D/g, '');
    
    // Format consistently across all devices
    if (phoneNumber.length === 10) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length === 11 && phoneNumber.startsWith('1')) {
      // Handle US country code
      return `+1 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 11)}`;
    } else if (phoneNumber.length > 10) {
      // Handle extensions
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)} ext. ${phoneNumber.slice(10)}`;
    } else if (phoneNumber.length >= 7) {
      // Handle 7-digit numbers
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      // Return as-is for shorter numbers
      return phoneNumber;
    }
  }, []);

  // Device-aware name formatting
  const formatContactName = useCallback((firstName: string, lastName: string): string => {
    if (!firstName && !lastName) return 'Unknown Contact';
    
    if (deviceType === 'mobile') {
      // Mobile: First name + last initial for space
      if (firstName && lastName) {
        return `${firstName} ${lastName.charAt(0)}.`;
      }
      return firstName || lastName || 'Unknown';
    } else if (deviceType === 'tablet') {
      // Tablet: Full names but truncated if too long
      const fullName = `${firstName || ''} ${lastName || ''}`.trim();
      return fullName.length > 20 ? `${fullName.substring(0, 18)}...` : fullName;
    } else {
      // Desktop: Full names without truncation
      return `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown Contact';
    }
  }, [deviceType]);

  // Device-aware company name formatting
  const formatCompanyName = useCallback((company: string): string => {
    if (!company) return '';
    
    if (deviceType === 'mobile') {
      // Mobile: Truncate long company names
      return company.length > 12 ? `${company.substring(0, 10)}...` : company;
    } else if (deviceType === 'tablet') {
      // Tablet: Moderate truncation
      return company.length > 20 ? `${company.substring(0, 18)}...` : company;
    } else {
      // Desktop: Full company name
      return company;
    }
  }, [deviceType]);

  // Device-aware email formatting
  const formatEmailDisplay = useCallback((email: string): string => {
    if (!email) return '';
    
    if (deviceType === 'mobile') {
      // Mobile: Show just username part for space
      const atIndex = email.indexOf('@');
      if (atIndex > 0) {
        const username = email.substring(0, atIndex);
        return username.length > 8 ? `${username.substring(0, 6)}...` : username;
      }
      return email.length > 10 ? `${email.substring(0, 8)}...` : email;
    } else if (deviceType === 'tablet') {
      // Tablet: Truncate long emails
      return email.length > 25 ? `${email.substring(0, 22)}...` : email;
    } else {
      // Desktop: Full email address
      return email;
    }
  }, [deviceType]);

  // Device-aware relative date formatting (like "2 days ago")
  const formatRelativeDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (deviceType === 'mobile') {
      // Mobile: Ultra-compact relative dates
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays === -1) return 'Tomorrow';
      if (diffDays > 0 && diffDays <= 7) return `${diffDays}d ago`;
      if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)}d`;
      return formatDisplayDate(dateString);
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced relative dates
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays === -1) return 'Tomorrow';
      if (diffDays > 0 && diffDays <= 7) return `${diffDays} days ago`;
      if (diffDays < 0 && diffDays >= -7) return `in ${Math.abs(diffDays)} days`;
      return formatDisplayDate(dateString);
    } else {
      // Desktop: Detailed relative dates
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays === -1) return 'Tomorrow';
      if (diffDays > 0 && diffDays <= 30) {
        return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
      }
      if (diffDays < 0 && diffDays >= -30) {
        const absDays = Math.abs(diffDays);
        return absDays === 1 ? 'in 1 day' : `in ${absDays} days`;
      }
      return formatDisplayDate(dateString);
    }
  }, [deviceType, formatDisplayDate]);

  // Device-aware priority indicator formatting
  const formatPriorityIndicator = useCallback((status: string, date: string): string => {
    const appointmentDate = new Date(date);
    const today = new Date();
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let priority = 'normal';
    
    // Determine priority based on status and timing
    if (status === 'pending' && diffDays <= 1) {
      priority = 'urgent';
    } else if (status === 'confirmed' && diffDays <= 0) {
      priority = 'high';
    } else if (status === 'cancelled') {
      priority = 'low';
    } else if (diffDays <= 3) {
      priority = 'high';
    }
    
    if (deviceType === 'mobile') {
      // Mobile: Simple indicators
      switch (priority) {
        case 'urgent':
          return '🔴';
        case 'high':
          return '🟡';
        case 'low':
          return '⚪';
        default:
          return '';
      }
    } else if (deviceType === 'tablet') {
      // Tablet: Icon with text
      switch (priority) {
        case 'urgent':
          return '🔴 Urgent';
        case 'high':
          return '🟡 High';
        case 'low':
          return '⚪ Low';
        default:
          return '';
      }
    } else {
      // Desktop: Full descriptive text
      switch (priority) {
        case 'urgent':
          return 'URGENT - Requires immediate attention';
        case 'high':
          return 'HIGH PRIORITY - Due soon';
        case 'low':
          return 'Low priority';
        default:
          return 'Normal priority';
      }
    }
  }, [deviceType]);

  // Device-aware duration formatting
  const formatAppointmentDuration = useCallback((startTime: string, duration: number): string => {
    if (!startTime || !duration) return '';
    
    if (deviceType === 'mobile') {
      // Mobile: Just show duration
      return `${duration}min`;
    } else if (deviceType === 'tablet') {
      // Tablet: Duration with context
      return `${duration} minutes`;
    } else {
      // Desktop: Full time range
      const startDate = new Date(`2000-01-01T${startTime}`);
      const endDate = new Date(startDate.getTime() + duration * 60000);
      
      const startFormatted = startDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      const endFormatted = endDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      return `${startFormatted} - ${endFormatted} (${duration} min)`;
    }
  }, [deviceType]);

  // Device-aware status change indicators
  const getStatusChangeIndicator = useCallback((oldStatus: string, newStatus: string): string => {
    if (oldStatus === newStatus) return '';
    
    const changeMap = {
      'pending-confirmed': deviceType === 'mobile' ? '✓' : deviceType === 'tablet' ? '✓ Confirmed' : 'Status: Pending → Confirmed',
      'pending-cancelled': deviceType === 'mobile' ? '✗' : deviceType === 'tablet' ? '✗ Cancelled' : 'Status: Pending → Cancelled',
      'confirmed-cancelled': deviceType === 'mobile' ? '✗' : deviceType === 'tablet' ? '✗ Cancelled' : 'Status: Confirmed → Cancelled',
      'confirmed-completed': deviceType === 'mobile' ? '✓' : deviceType === 'tablet' ? '✓ Completed' : 'Status: Confirmed → Completed',
      'cancelled-confirmed': deviceType === 'mobile' ? '↺' : deviceType === 'tablet' ? '↺ Reconfirmed' : 'Status: Cancelled → Confirmed'
    };
    
    const key = `${oldStatus}-${newStatus}`;
    return changeMap[key as keyof typeof changeMap] || '';
  }, [deviceType]);

  // Device-aware appointment type formatting
  const formatAppointmentType = useCallback((interest: string): string => {
    if (!interest) return '';
    
    const typeMap = {
      'operations': {
        mobile: 'Ops',
        tablet: 'Operations',
        desktop: 'Operations Consulting'
      },
      'cybersecurity': {
        mobile: 'Cyber',
        tablet: 'Cybersecurity',
        desktop: 'Cybersecurity Solutions'
      },
      'digital-transformation': {
        mobile: 'Digital',
        tablet: 'Digital Transform',
        desktop: 'Digital Transformation'
      },
      'general': {
        mobile: 'General',
        tablet: 'General',
        desktop: 'General Consultation'
      }
    };
    
    const mappedType = typeMap[interest as keyof typeof typeMap];
    if (mappedType) {
      return mappedType[deviceType];
    }
    
    // Fallback for unmapped interests
    if (deviceType === 'mobile') {
      return interest.substring(0, 6);
    } else if (deviceType === 'tablet') {
      return interest.length > 15 ? `${interest.substring(0, 12)}...` : interest;
    } else {
      return interest;
    }
  }, [deviceType]);

  // Device-aware contact method formatting
  const formatContactMethod = useCallback((email: string, phone: string): string => {
    if (!email && !phone) return 'No contact info';
    
    if (deviceType === 'mobile') {
      // Mobile: Prefer phone for touch dialing
      if (phone) return formatPhoneNumber(phone);
      if (email) return formatEmailDisplay(email);
      return '';
    } else if (deviceType === 'tablet') {
      // Tablet: Show both if available
      if (email && phone) {
        return `${formatEmailDisplay(email)} • ${formatPhoneNumber(phone)}`;
      }
      return formatEmailDisplay(email) || formatPhoneNumber(phone);
    } else {
      // Desktop: Full contact details
      if (email && phone) {
        return `${email} | ${formatPhoneNumber(phone)}`;
      }
      return email || formatPhoneNumber(phone);
    }
  }, [deviceType, formatPhoneNumber, formatEmailDisplay]);

  // Device-aware appointment urgency calculator
  const getAppointmentUrgency = useCallback((date: string, status: string): 'low' | 'medium' | 'high' | 'critical' => {
    const appointmentDate = new Date(date);
    const today = new Date();
    const diffTime = appointmentDate.getTime() - today.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    // Device-specific urgency thresholds
    const urgencyThresholds = {
      mobile: { critical: 4, high: 12, medium: 48 },      // More aggressive on mobile for notifications
      tablet: { critical: 2, high: 8, medium: 24 },       // Balanced for tablet
      desktop: { critical: 1, high: 4, medium: 12 }       // Conservative for desktop
    };
    
    const thresholds = urgencyThresholds[deviceType];
    
    if (status === 'cancelled') return 'low';
    if (status === 'completed') return 'low';
    
    if (diffHours <= thresholds.critical) return 'critical';
    if (diffHours <= thresholds.high) return 'high';
    if (diffHours <= thresholds.medium) return 'medium';
    
    return 'low';
  }, [deviceType]);

  // Device-aware notification text generator
  const getNotificationText = useCallback((appointment: any): string => {
    const urgency = getAppointmentUrgency(appointment.date, appointment.status);
    const contactName = formatContactName(appointment.firstName, appointment.lastName);
    const timeFormatted = formatDisplayTime(appointment.time);
    
    if (deviceType === 'mobile') {
      // Mobile: Short notification text
      switch (urgency) {
        case 'critical':
          return `${contactName} in 1 hour`;
        case 'high':
          return `${contactName} at ${timeFormatted}`;
        case 'medium':
          return `${contactName} tomorrow`;
        default:
          return `${contactName} scheduled`;
      }
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced notification text
      switch (urgency) {
        case 'critical':
          return `Urgent: ${contactName} appointment in 1 hour at ${timeFormatted}`;
        case 'high':
          return `Today: ${contactName} at ${timeFormatted}`;
        case 'medium':
          return `Tomorrow: ${contactName} at ${timeFormatted}`;
        default:
          return `Scheduled: ${contactName} on ${formatDisplayDate(appointment.date)}`;
      }
    } else {
      // Desktop: Detailed notification text
      const companyText = appointment.company ? ` from ${formatCompanyName(appointment.company)}` : '';
      const interestText = appointment.interest ? ` regarding ${formatAppointmentType(appointment.interest)}` : '';
      
      switch (urgency) {
        case 'critical':
          return `URGENT: ${contactName}${companyText} appointment${interestText} is scheduled for ${timeFormatted} today`;
        case 'high':
          return `HIGH PRIORITY: ${contactName}${companyText} appointment${interestText} at ${timeFormatted} today`;
        case 'medium':
          return `REMINDER: ${contactName}${companyText} appointment${interestText} at ${timeFormatted} on ${formatDisplayDate(appointment.date)}`;
        default:
          return `${contactName}${companyText} has an appointment${interestText} scheduled for ${timeFormatted} on ${formatDisplayDate(appointment.date)}`;
      }
    }
  }, [deviceType, getAppointmentUrgency, formatContactName, formatDisplayTime, formatDisplayDate, formatCompanyName, formatAppointmentType]);

  // Device-aware summary statistics formatter
  const formatSummaryStats = useCallback((appointments: any[]): string => {
    const total = appointments.length;
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
    const pending = appointments.filter(apt => apt.status === 'pending').length;
    const today = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const todayDate = new Date();
      return aptDate.toDateString() === todayDate.toDateString();
    }).length;
    
    if (deviceType === 'mobile') {
      // Mobile: Minimal stats
      return `${total} total, ${today} today`;
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced stats
      return `${total} appointments (${confirmed} confirmed, ${pending} pending, ${today} today)`;
    } else {
      // Desktop: Comprehensive stats
      return `Total appointments: ${total} | Confirmed: ${confirmed} | Pending: ${pending} | Today: ${today}`;
    }
  }, [deviceType]);

  // Device-aware export filename generator
  const generateExportFilename = useCallback((filterType?: string): string => {
    const timestamp = new Date().toISOString().split('T')[0];
    const deviceSuffix = deviceType === 'mobile' ? '_mobile' : deviceType === 'tablet' ? '_tablet' : '';
    
    if (filterType) {
      return `appointments_${filterType}_${timestamp}${deviceSuffix}.csv`;
    }
    
    return `appointments_${timestamp}${deviceSuffix}.csv`;
  }, [deviceType]);

  // Device-aware validation messages
  const getValidationMessage = useCallback((field: string, value: string): string => {
    const messages = {
      mobile: {
        required: `${field} required`,
        email: 'Invalid email',
        phone: 'Invalid phone',
        date: 'Invalid date',
        time: 'Invalid time'
      },
      tablet: {
        required: `${field} is required`,
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        date: 'Please select a valid date',
        time: 'Please select a valid time'
      },
      desktop: {
        required: `The ${field.toLowerCase()} field is required and cannot be empty`,
        email: 'Please enter a valid email address in the format user@domain.com',
        phone: 'Please enter a valid phone number in the format (XXX) XXX-XXXX',
        date: 'Please select a valid date for the appointment',
        time: 'Please select a valid time slot for the appointment'
      }
    };
    
    if (!value || value.trim() === '') {
      return messages[deviceType].required;
    }
    
    // Additional validation based on field type
    if (field.toLowerCase().includes('email')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return messages[deviceType].email;
      }
    }
    
    if (field.toLowerCase().includes('phone')) {
      const phoneRegex = /^\(?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(value.replace(/\D/g, ''))) {
        return messages[deviceType].phone;
      }
    }
    
    return '';
  }, [deviceType]);

  // Return all formatting functions
  return {
    // Core formatting functions
    formatSessionId,
    getStatusStyles,
    formatDisplayDate,
    isUpcoming,
    
    // Extended device-aware formatting functions
    formatDisplayTime,
    formatPhoneNumber,
    formatContactName,
    formatCompanyName,
    formatEmailDisplay,
    formatRelativeDate,
    formatPriorityIndicator,
    formatAppointmentDuration,
    getStatusChangeIndicator,
    formatAppointmentType,
    formatContactMethod,
    
    // Utility and helper functions
    getAppointmentUrgency,
    getNotificationText,
    formatSummaryStats,
    generateExportFilename,
    getValidationMessage,
    
    // Device information for consuming components
    deviceType,
    isTouchDevice
  };
};