// Device-Aware Search Filtering Logic
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/features/useSearchFiltering.ts

import { useCallback } from 'react';
import { Appointment } from '../../../../../types';

export interface UseSearchFilteringReturn {
  filterBySearch: (appointments: Appointment[], searchTerm: string) => Appointment[];
  getSearchSuggestions: (appointments: Appointment[], partialTerm: string) => string[];
  validateSearchTerm: (term: string) => { isValid: boolean; message?: string };
}

export const useSearchFiltering = (deviceType: 'mobile' | 'tablet' | 'desktop'): UseSearchFilteringReturn => {
  
  // Main search filtering function with device-specific optimizations
  const filterBySearch = useCallback((appointments: Appointment[], searchTerm: string): Appointment[] => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return appointments;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    console.log(`Searching ${appointments.length} appointments for: "${searchTerm}" on ${deviceType}`);

    const filtered = appointments.filter((appointment: Appointment) => {
      // Define searchable fields
      const searchFields = [
        `${appointment.firstName} ${appointment.lastName}`.toLowerCase(),
        appointment.email.toLowerCase(),
        appointment.company?.toLowerCase() || '',
        appointment.phone?.replace(/\D/g, '') || '', // Remove non-digits for phone search
        appointment.interest?.toLowerCase() || ''
      ];

      // Device-specific search strategies
      if (deviceType === 'mobile') {
        // Mobile: Simple, fast partial matching for performance
        return searchFields.some((field: string) => field.includes(searchLower));
      } else if (deviceType === 'tablet') {
        // Tablet: Balanced search with word matching
        return searchFields.some((field: string) => {
          // Direct match
          if (field.includes(searchLower)) return true;
          
          // Word-based search for better results
          const words = field.split(' ');
          return words.some((word: string) => word.startsWith(searchLower));
        });
      } else {
        // Desktop: Advanced search with multiple strategies
        return searchFields.some((field: string) => {
          // Direct substring match
          if (field.includes(searchLower)) return true;
          
          // Word-based search
          const words = field.split(' ');
          if (words.some((word: string) => word.startsWith(searchLower))) return true;
          
          // Partial word matching for longer search terms
          if (searchLower.length > 2) {
            if (words.some((word: string) => word.length > 3 && word.includes(searchLower))) {
              return true;
            }
          }
          
          // Fuzzy matching for email domains (e.g., searching "gmail" finds "@gmail.com")
          if (searchLower.length > 3 && field.includes('@')) {
            const emailParts = field.split('@');
            if (emailParts[1] && emailParts[1].includes(searchLower)) {
              return true;
            }
          }
          
          return false;
        });
      }
    });

    console.log(`Search completed: ${appointments.length} → ${filtered.length} results`);
    return filtered;
  }, [deviceType]);

  // Generate search suggestions based on existing data
  const getSearchSuggestions = useCallback((appointments: Appointment[], partialTerm: string): string[] => {
    if (!partialTerm || partialTerm.length < 2) {
      return [];
    }

    const suggestions = new Set<string>();
    const searchLower = partialTerm.toLowerCase();
    const maxSuggestions = deviceType === 'mobile' ? 3 : deviceType === 'tablet' ? 5 : 8;

    appointments.forEach((appointment) => {
      // Collect potential suggestions
      const candidates = [
        `${appointment.firstName} ${appointment.lastName}`,
        appointment.email,
        appointment.company || '',
        appointment.interest || ''
      ];

      candidates.forEach((candidate) => {
        if (candidate && candidate.toLowerCase().startsWith(searchLower)) {
          suggestions.add(candidate);
        }
      });

      // Stop early if we have enough suggestions
      if (suggestions.size >= maxSuggestions) {
        return;
      }
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }, [deviceType]);

  // Validate search terms
  const validateSearchTerm = useCallback((term: string): { isValid: boolean; message?: string } => {
    // Empty term is valid (means no search)
    if (!term || term.trim().length === 0) {
      return { isValid: true };
    }

    const trimmedTerm = term.trim();

    // Minimum length check
    if (trimmedTerm.length === 1) {
      return {
        isValid: false,
        message: deviceType === 'mobile' 
          ? 'Need 2+ chars' 
          : 'Search term must be at least 2 characters'
      };
    }

    // Maximum length check
    if (trimmedTerm.length > 100) {
      return {
        isValid: false,
        message: deviceType === 'mobile'
          ? 'Too long (max 100)'
          : 'Search term too long (maximum 100 characters)'
      };
    }

    // Check for potentially expensive patterns
    if (trimmedTerm.includes('*') || trimmedTerm.includes('%')) {
      return {
        isValid: false,
        message: 'Wildcard characters are not supported'
      };
    }

    // Performance warning for very short terms on large datasets
    if (trimmedTerm.length === 2 && deviceType === 'mobile') {
      return {
        isValid: true,
        message: 'Short search may be slow on mobile'
      };
    }

    return { isValid: true };
  }, [deviceType]);

  return {
    filterBySearch,
    getSearchSuggestions,
    validateSearchTerm
  };
};