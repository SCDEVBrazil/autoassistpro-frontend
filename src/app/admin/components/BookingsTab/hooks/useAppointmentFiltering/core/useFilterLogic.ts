// Main Filtering and Sorting Logic
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/core/useFilterLogic.ts

import { useMemo, useCallback } from 'react';
import { Appointment } from '../../../../../types';

interface FilterCriteria {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
}

interface FilterLogicDependencies {
  searchFiltering: {
    filterBySearch: (appointments: Appointment[], searchTerm: string) => Appointment[];
  };
  statusFiltering: {
    filterByStatus: (appointments: Appointment[], status: string) => Appointment[];
  };
  dateFiltering: {
    filterByDate: (appointments: Appointment[], dateFilter: string) => Appointment[];
  };
  appointmentSorting: {
    sortAppointments: (appointments: Appointment[], dateFilter: string) => Appointment[];
  };
}

export interface UseFilterLogicReturn {
  applyAllFilters: (appointments: Appointment[], criteria: FilterCriteria) => Appointment[];
  applyQuickFilter: (filterType: string, value: string) => void;
  getFilterStats: (appointments: Appointment[]) => {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    completed: number;
    upcoming: number;
    past: number;
  };
  validateFilters: (criteria: FilterCriteria) => { 
    isValid: boolean; 
    message?: string; 
  };
}

export const useFilterLogic = (dependencies: FilterLogicDependencies): UseFilterLogicReturn => {
  const { searchFiltering, statusFiltering, dateFiltering, appointmentSorting } = dependencies;

  // Main filtering pipeline
  const applyAllFilters = useCallback((appointments: Appointment[], criteria: FilterCriteria): Appointment[] => {
    let filtered = [...appointments];

    // Step 1: Apply search filter
    if (criteria.searchTerm && criteria.searchTerm.trim().length > 0) {
      filtered = searchFiltering.filterBySearch(filtered, criteria.searchTerm);
    }

    // Step 2: Apply status filter
    if (criteria.statusFilter && criteria.statusFilter !== 'all') {
      filtered = statusFiltering.filterByStatus(filtered, criteria.statusFilter);
    }

    // Step 3: Apply date filter
    if (criteria.dateFilter && criteria.dateFilter !== 'all') {
      filtered = dateFiltering.filterByDate(filtered, criteria.dateFilter);
    }

    // Step 4: Apply sorting
    filtered = appointmentSorting.sortAppointments(filtered, criteria.dateFilter);

    console.log(`Filtering complete: ${appointments.length} → ${filtered.length} appointments`);
    return filtered;
  }, [searchFiltering, statusFiltering, dateFiltering, appointmentSorting]);

  // Quick filter application (for preset filters)
  const applyQuickFilter = useCallback((filterType: string, value: string) => {
    console.log(`Quick filter applied: ${filterType} = ${value}`);
    // This would be implemented to work with the main orchestrator
    // to quickly apply common filter combinations
  }, []);

  // Calculate filter statistics
  const getFilterStats = useCallback((appointments: Appointment[]) => {
    const stats = appointments.reduce(
      (acc, appointment) => {
        acc.total++;
        
        // Status counts
        switch (appointment.status) {
          case 'confirmed':
            acc.confirmed++;
            break;
          case 'pending':
            acc.pending++;
            break;
          case 'cancelled':
            acc.cancelled++;
            break;
          case 'completed':
            acc.completed++;
            break;
        }

        // Date-based counts
        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (appointmentDate >= today) {
          acc.upcoming++;
        } else {
          acc.past++;
        }

        return acc;
      },
      {
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        completed: 0,
        upcoming: 0,
        past: 0
      }
    );

    return stats;
  }, []);

  // Validate filter criteria
  const validateFilters = useCallback((criteria: FilterCriteria): { isValid: boolean; message?: string } => {
    // Check search term length
    if (criteria.searchTerm && criteria.searchTerm.length === 1) {
      return {
        isValid: false,
        message: 'Search term must be at least 2 characters long'
      };
    }

    // Check for potentially expensive search terms
    if (criteria.searchTerm && criteria.searchTerm.length > 100) {
      return {
        isValid: false,
        message: 'Search term is too long (max 100 characters)'
      };
    }

    // Validate status filter
    const validStatuses = ['all', 'confirmed', 'pending', 'cancelled', 'completed'];
    if (criteria.statusFilter && !validStatuses.includes(criteria.statusFilter)) {
      return {
        isValid: false,
        message: `Invalid status filter: ${criteria.statusFilter}`
      };
    }

    // Validate date filter
    const validDateFilters = ['all', 'upcoming', 'past', 'today', 'this-week', 'this-month'];
    if (criteria.dateFilter && !validDateFilters.includes(criteria.dateFilter)) {
      return {
        isValid: false,
        message: `Invalid date filter: ${criteria.dateFilter}`
      };
    }

    return { isValid: true };
  }, []);

  return {
    applyAllFilters,
    applyQuickFilter,
    getFilterStats,
    validateFilters
  };
};