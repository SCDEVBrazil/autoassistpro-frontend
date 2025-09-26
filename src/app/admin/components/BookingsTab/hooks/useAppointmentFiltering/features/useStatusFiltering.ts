// Status-Based Filtering Logic
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/features/useStatusFiltering.ts

import { useCallback } from 'react';
import { Appointment } from '../../../../../types';

export interface StatusFilterStats {
  all: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  completed: number;
}

export interface UseStatusFilteringReturn {
  filterByStatus: (appointments: Appointment[], status: string) => Appointment[];
  getStatusStats: (appointments: Appointment[]) => StatusFilterStats;
  getStatusOptions: () => { value: string; label: string; count?: number }[];
  validateStatus: (status: string) => boolean;
  getStatusPriority: (status: string) => number;
}

export const useStatusFiltering = (): UseStatusFilteringReturn => {
  
  // Valid status values
  const VALID_STATUSES = ['all', 'confirmed', 'pending', 'cancelled', 'completed'];
  
  // Status priority for sorting (lower number = higher priority)
  const STATUS_PRIORITY = {
    'pending': 0,    // Highest priority - needs attention
    'confirmed': 1,  // High priority - upcoming
    'completed': 2,  // Medium priority - historical success
    'cancelled': 3   // Lowest priority - cancelled
  };

  // Main status filtering function
  const filterByStatus = useCallback((appointments: Appointment[], status: string): Appointment[] => {
    if (!status || status === 'all') {
      console.log(`Status filter: showing all ${appointments.length} appointments`);
      return appointments;
    }

    if (!VALID_STATUSES.includes(status)) {
      console.warn(`Invalid status filter: ${status}`);
      return appointments;
    }

    const filtered = appointments.filter((appointment: Appointment) => 
      appointment.status === status
    );

    console.log(`Status filter (${status}): ${appointments.length} → ${filtered.length} appointments`);
    return filtered;
  }, []);

  // Calculate status statistics
  const getStatusStats = useCallback((appointments: Appointment[]): StatusFilterStats => {
    const stats = appointments.reduce(
      (acc, appointment) => {
        acc.all++;
        
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
          default:
            console.warn(`Unknown status: ${appointment.status}`);
        }
        
        return acc;
      },
      {
        all: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        completed: 0
      }
    );

    return stats;
  }, []);

  // Get status options with labels and optional counts
  const getStatusOptions = useCallback(() => {
    return [
      { value: 'all', label: 'All Status' },
      { value: 'pending', label: 'Pending' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ];
  }, []);

  // Validate status value
  const validateStatus = useCallback((status: string): boolean => {
    return VALID_STATUSES.includes(status);
  }, []);

  // Get status priority for sorting
  const getStatusPriority = useCallback((status: string): number => {
    return STATUS_PRIORITY[status as keyof typeof STATUS_PRIORITY] ?? 999;
  }, []);

  return {
    filterByStatus,
    getStatusStats,
    getStatusOptions,
    validateStatus,
    getStatusPriority
  };
};