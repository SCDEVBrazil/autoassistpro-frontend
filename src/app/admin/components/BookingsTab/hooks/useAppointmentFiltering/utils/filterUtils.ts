// Filter Validation and Helper Utilities
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/utils/filterUtils.ts

import { Appointment } from '../../../../../types';

export interface FilterValidationResult {
  isValid: boolean;
  message?: string;
  warnings?: string[];
  suggestions?: string[];
}

export interface FilterPerformanceMetrics {
  inputCount: number;
  outputCount: number;
  processingTimeMs: number;
  filterEfficiency: number;
  recommendedOptimizations?: string[];
}

export interface FilterCombination {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
}

// Validate complete filter combination
export const validateFilterCombination = (
  filters: FilterCombination,
  appointmentCount: number,
  deviceType: 'mobile' | 'tablet' | 'desktop'
): FilterValidationResult => {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Search term validation
  if (filters.searchTerm) {
    const searchTerm = filters.searchTerm.trim();
    
    // Length validation
    if (searchTerm.length === 1) {
      return {
        isValid: false,
        message: deviceType === 'mobile' 
          ? 'Need 2+ characters' 
          : 'Search term must be at least 2 characters long'
      };
    }

    if (searchTerm.length > 100) {
      return {
        isValid: false,
        message: 'Search term too long (maximum 100 characters)'
      };
    }

    // Performance warnings based on device and dataset size
    if (searchTerm.length === 2 && appointmentCount > 50) {
      warnings.push(
        deviceType === 'mobile'
          ? 'Short search may be slow'
          : 'Very short search terms may return many results'
      );
    }

    // Special character validation
    if (searchTerm.includes('*') || searchTerm.includes('%') || searchTerm.includes('?')) {
      return {
        isValid: false,
        message: 'Wildcard characters (* % ?) are not supported'
      };
    }

    // SQL injection prevention
    if (searchTerm.includes("'") || searchTerm.includes('"') || searchTerm.includes(';')) {
      warnings.push('Special characters in search may not work as expected');
    }
  }

  // Status filter validation
  const validStatuses = ['all', 'confirmed', 'pending', 'cancelled', 'completed'];
  if (filters.statusFilter && !validStatuses.includes(filters.statusFilter)) {
    return {
      isValid: false,
      message: `Invalid status filter: ${filters.statusFilter}`
    };
  }

  // Date filter validation
  const validDateFilters = ['all', 'upcoming', 'past', 'today', 'this-week', 'this-month'];
  if (filters.dateFilter && !validDateFilters.includes(filters.dateFilter)) {
    return {
      isValid: false,
      message: `Invalid date filter: ${filters.dateFilter}`
    };
  }

  // Performance optimization suggestions
  if (appointmentCount > 1000) {
    if (deviceType === 'mobile') {
      suggestions.push('Consider using more specific filters on mobile for better performance');
    }
    
    if (!filters.dateFilter || filters.dateFilter === 'all') {
      suggestions.push('Add date filter to improve search performance');
    }
  }

  // Filter combination efficiency warnings
  if (filters.searchTerm && filters.statusFilter !== 'all' && filters.dateFilter !== 'all') {
    // Very specific filter combination - might return no results
    if (appointmentCount < 100) {
      warnings.push('Multiple filters applied - results may be very limited');
    }
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
};

// Calculate filter performance metrics
export const calculateFilterPerformance = (
  inputCount: number,
  outputCount: number,
  startTime: number,
  endTime: number,
  deviceType: 'mobile' | 'tablet' | 'desktop'
): FilterPerformanceMetrics => {
  const processingTimeMs = endTime - startTime;
  const filterEfficiency = inputCount > 0 ? (outputCount / inputCount) : 0;
  const recommendedOptimizations: string[] = [];

  // Performance analysis
  if (processingTimeMs > 100) {
    recommendedOptimizations.push('Filtering is taking longer than expected');
    
    if (deviceType === 'mobile' && processingTimeMs > 50) {
      recommendedOptimizations.push('Consider simplifying filters for mobile performance');
    }
  }

  // Efficiency analysis
  if (filterEfficiency < 0.1 && inputCount > 50) {
    recommendedOptimizations.push('Filters are very selective - consider broader criteria');
  }

  if (filterEfficiency > 0.9 && inputCount > 20) {
    recommendedOptimizations.push('Filters are not very selective - consider more specific criteria');
  }

  return {
    inputCount,
    outputCount,
    processingTimeMs,
    filterEfficiency,
    recommendedOptimizations: recommendedOptimizations.length > 0 ? recommendedOptimizations : undefined
  };
};

// Sanitize search input to prevent issues
export const sanitizeSearchInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[*%?]/g, '') // Remove wildcard characters
    .replace(/['"`;]/g, '') // Remove potentially problematic characters
    .substring(0, 100); // Limit length
};

// Generate search suggestions based on existing appointments
export const generateSearchSuggestions = (
  appointments: Appointment[],
  partialInput: string,
  maxSuggestions: number = 5
): string[] => {
  if (!partialInput || partialInput.length < 2) {
    return [];
  }

  const suggestions = new Set<string>();
  const searchLower = partialInput.toLowerCase();

  // Collect suggestions from various fields
  appointments.forEach((appointment) => {
    if (suggestions.size >= maxSuggestions) return;

    // Name suggestions
    const fullName = `${appointment.firstName} ${appointment.lastName}`;
    if (fullName.toLowerCase().startsWith(searchLower)) {
      suggestions.add(fullName);
    }

    // Email suggestions (domain parts)
    if (appointment.email.toLowerCase().includes(searchLower)) {
      if (searchLower.length >= 3) {
        suggestions.add(appointment.email);
      }
    }

    // Company suggestions
    if (appointment.company && appointment.company.toLowerCase().startsWith(searchLower)) {
      suggestions.add(appointment.company);
    }
  });

  return Array.from(suggestions).slice(0, maxSuggestions);
};

// Check if filter combination will likely return results
export const predictFilterResults = (
  appointments: Appointment[],
  filters: FilterCombination
): { likelyResultCount: number; confidence: 'high' | 'medium' | 'low' } => {
  let estimatedCount = appointments.length;
  let confidence: 'high' | 'medium' | 'low' = 'high';

  // Estimate search filter impact
  if (filters.searchTerm && filters.searchTerm.length >= 2) {
    const searchLower = filters.searchTerm.toLowerCase();
    const matchingCount = appointments.filter(apt => 
      `${apt.firstName} ${apt.lastName} ${apt.email} ${apt.company || ''}`.toLowerCase().includes(searchLower)
    ).length;
    
    estimatedCount = Math.min(estimatedCount, matchingCount);
    
    if (filters.searchTerm.length === 2) {
      confidence = 'medium';
    }
  }

  // Estimate status filter impact
  if (filters.statusFilter && filters.statusFilter !== 'all') {
    const statusCount = appointments.filter(apt => apt.status === filters.statusFilter).length;
    estimatedCount = Math.min(estimatedCount, statusCount);
  }

  // Estimate date filter impact
  if (filters.dateFilter && filters.dateFilter !== 'all') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dateFilteredCount = 0;
    
    switch (filters.dateFilter) {
      case 'upcoming':
        dateFilteredCount = appointments.filter(apt => new Date(apt.date) >= today).length;
        break;
      case 'past':
        dateFilteredCount = appointments.filter(apt => new Date(apt.date) < today).length;
        break;
      case 'today':
        dateFilteredCount = appointments.filter(apt => 
          new Date(apt.date).toDateString() === today.toDateString()
        ).length;
        break;
      default:
        dateFilteredCount = Math.floor(appointments.length * 0.3); // Rough estimate
        confidence = 'low';
    }
    
    estimatedCount = Math.min(estimatedCount, dateFilteredCount);
  }

  // Adjust confidence based on filter complexity
  if (Object.values(filters).filter(f => f && f !== 'all').length > 2) {
    confidence = confidence === 'high' ? 'medium' : 'low';
  }

  return {
    likelyResultCount: Math.max(0, estimatedCount),
    confidence
  };
};

// Get filter summary for display
export const getFilterSummary = (filters: FilterCombination): string => {
  const activeParts: string[] = [];

  if (filters.searchTerm) {
    activeParts.push(`"${filters.searchTerm}"`);
  }

  if (filters.statusFilter && filters.statusFilter !== 'all') {
    activeParts.push(`status: ${filters.statusFilter}`);
  }

  if (filters.dateFilter && filters.dateFilter !== 'all') {
    activeParts.push(`date: ${filters.dateFilter.replace('-', ' ')}`);
  }

  if (activeParts.length === 0) {
    return 'No filters applied';
  }

  return `Filtered by: ${activeParts.join(', ')}`;
};