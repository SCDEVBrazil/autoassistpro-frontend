// Core Filter State Management
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/core/useFilterState.ts

import { useState, useCallback } from 'react';
import { FILTER_DEFAULTS } from '../constants/filterConstants';
import { StatusFilter, DateFilter } from '../types/filterTypes';

export interface FilterState {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
}

export interface UseFilterStateReturn {
  // State values
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
  
  // Actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  setDateFilter: (date: string) => void;
  resetFilters: () => void;
  
  // Utilities
  hasActiveFilters: boolean;
  getFilterCount: () => number;
}

export const useFilterState = (): UseFilterStateReturn => {
  // Core filter state
  const [searchTerm, setSearchTermState] = useState<string>(FILTER_DEFAULTS.searchTerm);
  const [statusFilter, setStatusFilterState] = useState<string>(FILTER_DEFAULTS.statusFilter);
  const [dateFilter, setDateFilterState] = useState<string>(FILTER_DEFAULTS.dateFilter);

  // Enhanced setters with validation and logging
  const setSearchTerm = useCallback((term: string) => {
    const cleanTerm = term.trim();
    setSearchTermState(cleanTerm);
    
    // Log search activity for analytics
    if (cleanTerm.length > 0) {
      console.log(`Search initiated: "${cleanTerm}"`);
    }
  }, []);

    const setStatusFilter = useCallback((status: string) => {
    if (FILTER_DEFAULTS.statusOptions.includes(status as StatusFilter)) {
        setStatusFilterState(status as StatusFilter);
        console.log(`Status filter applied: ${status}`);
    } else {
        console.warn(`Invalid status filter: ${status}`);
    }
    }, []);

    const setDateFilter = useCallback((date: string) => {
    if (FILTER_DEFAULTS.dateOptions.includes(date as DateFilter)) {
        setDateFilterState(date as DateFilter);
        console.log(`Date filter applied: ${date}`);
    } else {
        console.warn(`Invalid date filter: ${date}`);
    }
    }, []);

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    setSearchTermState(FILTER_DEFAULTS.searchTerm);
    setStatusFilterState(FILTER_DEFAULTS.statusFilter);
    setDateFilterState(FILTER_DEFAULTS.dateFilter);
    console.log('All filters reset to defaults');
  }, []);

  // Computed properties
  const hasActiveFilters = 
    searchTerm !== FILTER_DEFAULTS.searchTerm ||
    statusFilter !== FILTER_DEFAULTS.statusFilter ||
    dateFilter !== FILTER_DEFAULTS.dateFilter;

  const getFilterCount = useCallback((): number => {
    let count = 0;
    if (searchTerm !== FILTER_DEFAULTS.searchTerm) count++;
    if (statusFilter !== FILTER_DEFAULTS.statusFilter) count++;
    if (dateFilter !== FILTER_DEFAULTS.dateFilter) count++;
    return count;
  }, [searchTerm, statusFilter, dateFilter]);

  return {
    // State values
    searchTerm,
    statusFilter,
    dateFilter,
    
    // Actions
    setSearchTerm,
    setStatusFilter,
    setDateFilter,
    resetFilters,
    
    // Utilities
    hasActiveFilters,
    getFilterCount
  };
};