// Device-Aware Appointment Sorting Logic
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/features/useAppointmentSorting.ts

import { useCallback } from 'react';
import { Appointment } from '../../../../../types';

export type SortOption = 'date-asc' | 'date-desc' | 'status-priority' | 'name-asc' | 'name-desc' | 'company-asc';

export interface UseAppointmentSortingReturn {
  sortAppointments: (appointments: Appointment[], dateFilter: string) => Appointment[];
  sortByOption: (appointments: Appointment[], sortOption: SortOption) => Appointment[];
  getSortOptions: () => { value: SortOption; label: string }[];
  getStatusPriority: (status: string) => number;
  compareByDateTime: (a: Appointment, b: Appointment) => number;
  compareByName: (a: Appointment, b: Appointment) => number;
}

export const useAppointmentSorting = (deviceType: 'mobile' | 'tablet' | 'desktop'): UseAppointmentSortingReturn => {
  
  // Status priority for intelligent sorting (lower number = higher priority)
  const STATUS_PRIORITY = {
    'pending': 0,    // Highest priority - needs attention
    'confirmed': 1,  // High priority - upcoming
    'completed': 2,  // Medium priority - historical success
    'cancelled': 3   // Lowest priority - cancelled
  };

  // Get status priority for sorting
  const getStatusPriority = useCallback((status: string): number => {
    return STATUS_PRIORITY[status as keyof typeof STATUS_PRIORITY] ?? 999;
  }, []);

  // Compare appointments by date and time
  const compareByDateTime = useCallback((a: Appointment, b: Appointment): number => {
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeA.getTime() - dateTimeB.getTime();
  }, []);

  // Compare appointments by name (last name, then first name)
  const compareByName = useCallback((a: Appointment, b: Appointment): number => {
    const lastNameComparison = a.lastName.localeCompare(b.lastName);
    if (lastNameComparison !== 0) {
      return lastNameComparison;
    }
    return a.firstName.localeCompare(b.firstName);
  }, []);

  // Compare appointments by company name
  const compareByCompany = useCallback((a: Appointment, b: Appointment): number => {
    const companyA = a.company || '';
    const companyB = b.company || '';
    
    // Put appointments without company at the end
    if (!companyA && companyB) return 1;
    if (companyA && !companyB) return -1;
    if (!companyA && !companyB) return compareByName(a, b);
    
    return companyA.localeCompare(companyB);
  }, [compareByName]);

  // Smart sorting based on date filter context
  const sortAppointments = useCallback((appointments: Appointment[], dateFilter: string): Appointment[] => {
    if (appointments.length === 0) {
      return appointments;
    }

    // Create a copy to avoid mutating the original array
    const sorted = [...appointments];
    
    console.log(`Sorting ${sorted.length} appointments for dateFilter: ${dateFilter} on ${deviceType}`);

    // Device-specific sorting optimizations
    if (deviceType === 'mobile' && sorted.length > 100) {
      // Mobile: For large datasets, use simpler sorting for performance
      console.log('Mobile: Using simplified sorting for performance');
      sorted.sort(compareByDateTime);
      return sorted;
    }

    // Intelligent sorting based on date filter context
    switch (dateFilter) {
      case 'upcoming':
        // For upcoming appointments: sort by date ASC, then by status priority
        sorted.sort((a, b) => {
          const dateComparison = compareByDateTime(a, b);
          if (dateComparison !== 0) {
            return dateComparison;
          }
          // Secondary sort by status priority
          return getStatusPriority(a.status) - getStatusPriority(b.status);
        });
        break;

      case 'past':
        // For past appointments: sort by date DESC (newest first), then by status
        sorted.sort((a, b) => {
          const dateComparison = compareByDateTime(b, a); // Reverse order
          if (dateComparison !== 0) {
            return dateComparison;
          }
          // Secondary sort by status priority
          return getStatusPriority(a.status) - getStatusPriority(b.status);
        });
        break;

      case 'today':
        // For today's appointments: sort by time, then by status priority
        sorted.sort((a, b) => {
          const timeA = a.time;
          const timeB = b.time;
          const timeComparison = timeA.localeCompare(timeB);
          if (timeComparison !== 0) {
            return timeComparison;
          }
          return getStatusPriority(a.status) - getStatusPriority(b.status);
        });
        break;

      case 'this-week':
      case 'this-month':
        // For week/month views: sort by date ASC, then by status
        sorted.sort((a, b) => {
          const dateComparison = compareByDateTime(a, b);
          if (dateComparison !== 0) {
            return dateComparison;
          }
          return getStatusPriority(a.status) - getStatusPriority(b.status);
        });
        break;

      default:
        // Default sorting: status priority first, then by date
        sorted.sort((a, b) => {
          const statusComparison = getStatusPriority(a.status) - getStatusPriority(b.status);
          if (statusComparison !== 0) {
            return statusComparison;
          }
          return compareByDateTime(a, b);
        });
        break;
    }

    console.log(`Sorting completed for ${dateFilter} filter`);
    return sorted;
  }, [deviceType, compareByDateTime, getStatusPriority]);

  // Sort by specific option (for manual user selection)
  const sortByOption = useCallback((appointments: Appointment[], sortOption: SortOption): Appointment[] => {
    if (appointments.length === 0) {
      return appointments;
    }

    const sorted = [...appointments];
    console.log(`Manual sort by: ${sortOption}`);

    switch (sortOption) {
      case 'date-asc':
        sorted.sort(compareByDateTime);
        break;

      case 'date-desc':
        sorted.sort((a, b) => compareByDateTime(b, a));
        break;

      case 'status-priority':
        sorted.sort((a, b) => {
          const statusComparison = getStatusPriority(a.status) - getStatusPriority(b.status);
          if (statusComparison !== 0) {
            return statusComparison;
          }
          return compareByDateTime(a, b);
        });
        break;

      case 'name-asc':
        sorted.sort(compareByName);
        break;

      case 'name-desc':
        sorted.sort((a, b) => compareByName(b, a));
        break;

      case 'company-asc':
        sorted.sort(compareByCompany);
        break;

      default:
        console.warn(`Unknown sort option: ${sortOption}`);
        sorted.sort(compareByDateTime);
        break;
    }

    return sorted;
  }, [compareByDateTime, compareByName, compareByCompany, getStatusPriority]);

  // Get available sort options (device-aware)
  const getSortOptions = useCallback(() => {
    const baseOptions = [
      { value: 'date-asc' as SortOption, label: 'Date (Earliest First)' },
      { value: 'date-desc' as SortOption, label: 'Date (Latest First)' },
      { value: 'status-priority' as SortOption, label: 'Status Priority' },
      { value: 'name-asc' as SortOption, label: 'Name (A-Z)' }
    ];

    // Add more options for tablet and desktop
    if (deviceType !== 'mobile') {
      baseOptions.push(
        { value: 'name-desc' as SortOption, label: 'Name (Z-A)' },
        { value: 'company-asc' as SortOption, label: 'Company (A-Z)' }
      );
    }

    return baseOptions;
  }, [deviceType]);

  return {
    sortAppointments,
    sortByOption,
    getSortOptions,
    getStatusPriority,
    compareByDateTime,
    compareByName
  };
};