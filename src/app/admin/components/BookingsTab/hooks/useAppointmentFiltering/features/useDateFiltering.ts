// Device-Aware Date Filtering Logic
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/features/useDateFiltering.ts

import { useCallback } from 'react';
import { Appointment } from '../../../../../types';

export interface DateFilterStats {
  all: number;
  upcoming: number;
  past: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  overdue: number;
}

export interface UseeDateFilteringReturn {
  filterByDate: (appointments: Appointment[], dateFilter: string) => Appointment[];
  getDateStats: (appointments: Appointment[]) => DateFilterStats;
  getDateOptions: () => { value: string; label: string }[];
  validateDateFilter: (filter: string) => boolean;
  isUpcoming: (appointment: Appointment) => boolean;
  isPast: (appointment: Appointment) => boolean;
  isToday: (appointment: Appointment) => boolean;
}

export const useDateFiltering = (deviceType: 'mobile' | 'tablet' | 'desktop'): UseeDateFilteringReturn => {
  
  // Valid date filter values
  const VALID_DATE_FILTERS = ['all', 'upcoming', 'past', 'today', 'this-week', 'this-month'];

  // Helper functions for date calculations
  const getToday = (): Date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getTomorrow = (): Date => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  const getStartOfWeek = (): Date => {
    const today = getToday();
    const day = today.getDay();
    const diff = today.getDate() - day; // Sunday = 0
    const startOfWeek = new Date(today.setDate(diff));
    return startOfWeek;
  };

  const getEndOfWeek = (): Date => {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  };

  const getStartOfMonth = (): Date => {
    const today = getToday();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const getEndOfMonth = (): Date => {
    const today = getToday();
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    return endOfMonth;
  };

  // Check if appointment is today
  const isToday = useCallback((appointment: Appointment): boolean => {
    const appointmentDate = new Date(appointment.date);
    const today = getToday();
    return appointmentDate.toDateString() === today.toDateString();
  }, []);

  // Check if appointment is upcoming
  const isUpcoming = useCallback((appointment: Appointment): boolean => {
    const appointmentDate = new Date(appointment.date);
    const today = getToday();
    return appointmentDate >= today;
  }, []);

  // Check if appointment is past
  const isPast = useCallback((appointment: Appointment): boolean => {
    const appointmentDate = new Date(appointment.date);
    const today = getToday();
    return appointmentDate < today;
  }, []);

  // Main date filtering function with device-specific optimizations
  const filterByDate = useCallback((appointments: Appointment[], dateFilter: string): Appointment[] => {
    if (!dateFilter || dateFilter === 'all') {
      console.log(`Date filter: showing all ${appointments.length} appointments`);
      return appointments;
    }

    if (!VALID_DATE_FILTERS.includes(dateFilter)) {
      console.warn(`Invalid date filter: ${dateFilter}`);
      return appointments;
    }

    const today = getToday();
    let filtered: Appointment[] = [];

    switch (dateFilter) {
      case 'upcoming':
        filtered = appointments.filter(appointment => isUpcoming(appointment));
        break;

      case 'past':
        if (deviceType === 'mobile') {
          // Mobile: Limit past appointments to last 30 days for performance
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          
          filtered = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate < today && appointmentDate >= thirtyDaysAgo;
          });
          console.log(`Mobile optimization: Limited past appointments to last 30 days`);
        } else if (deviceType === 'tablet') {
          // Tablet: Limit to last 90 days
          const ninetyDaysAgo = new Date(today);
          ninetyDaysAgo.setDate(today.getDate() - 90);
          
          filtered = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate < today && appointmentDate >= ninetyDaysAgo;
          });
          console.log(`Tablet optimization: Limited past appointments to last 90 days`);
        } else {
          // Desktop: Show all past appointments
          filtered = appointments.filter(appointment => isPast(appointment));
        }
        break;

      case 'today':
        filtered = appointments.filter(appointment => isToday(appointment));
        break;

      case 'this-week':
        const startOfWeek = getStartOfWeek();
        const endOfWeek = getEndOfWeek();
        filtered = appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        });
        break;

      case 'this-month':
        const startOfMonth = getStartOfMonth();
        const endOfMonth = getEndOfMonth();
        filtered = appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= startOfMonth && appointmentDate <= endOfMonth;
        });
        break;

      default:
        console.warn(`Unhandled date filter: ${dateFilter}`);
        filtered = appointments;
    }

    console.log(`Date filter (${dateFilter}): ${appointments.length} → ${filtered.length} appointments`);
    return filtered;
  }, [deviceType, isUpcoming, isPast, isToday]);

  // Calculate date-based statistics
  const getDateStats = useCallback((appointments: Appointment[]): DateFilterStats => {
    const today = getToday();
    const startOfWeek = getStartOfWeek();
    const endOfWeek = getEndOfWeek();
    const startOfMonth = getStartOfMonth();
    const endOfMonth = getEndOfMonth();

    const stats = appointments.reduce(
      (acc, appointment) => {
        acc.all++;
        
        const appointmentDate = new Date(appointment.date);
        
        // Basic categories
        if (appointmentDate >= today) {
          acc.upcoming++;
        } else {
          acc.past++;
          
          // Check if past appointment was overdue (missed)
          if (appointment.status === 'pending' || appointment.status === 'confirmed') {
            acc.overdue++;
          }
        }
        
        // Today
        if (isToday(appointment)) {
          acc.today++;
        }
        
        // This week
        if (appointmentDate >= startOfWeek && appointmentDate <= endOfWeek) {
          acc.thisWeek++;
        }
        
        // This month
        if (appointmentDate >= startOfMonth && appointmentDate <= endOfMonth) {
          acc.thisMonth++;
        }
        
        return acc;
      },
      {
        all: 0,
        upcoming: 0,
        past: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        overdue: 0
      }
    );

    return stats;
  }, [isToday]);

  // Get date filter options
  const getDateOptions = useCallback(() => {
    return [
      { value: 'all', label: 'All Dates' },
      { value: 'upcoming', label: 'Upcoming' },
      { value: 'today', label: 'Today' },
      { value: 'this-week', label: 'This Week' },
      { value: 'this-month', label: 'This Month' },
      { value: 'past', label: 'Past' }
    ];
  }, []);

  // Validate date filter value
  const validateDateFilter = useCallback((filter: string): boolean => {
    return VALID_DATE_FILTERS.includes(filter);
  }, []);

  return {
    filterByDate,
    getDateStats,
    getDateOptions,
    validateDateFilter,
    isUpcoming,
    isPast,
    isToday
  };
};