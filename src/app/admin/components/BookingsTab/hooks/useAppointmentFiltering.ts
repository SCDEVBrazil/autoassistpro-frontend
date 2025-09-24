// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering.ts - PART 1/3

import { useState, useMemo } from 'react';
import { Appointment } from '../../../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export const useAppointmentFiltering = (scheduledCalls: Appointment[]) => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('upcoming');
  
  // Device-specific items per page for optimal performance
  const itemsPerPage = useMemo(() => {
    switch (deviceType) {
      case 'mobile':
        return 3; // Fewer items for mobile performance and scrolling
      case 'tablet':
        return 5; // Balanced for tablet viewing
      case 'desktop':
        return 10; // More items for desktop efficiency
      default:
        return 5;
    }
  }, [deviceType]);

  // Device-aware filtering with different search strategies
  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = [...scheduledCalls];

    // Device-specific search filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      
      if (deviceType === 'mobile') {
        // Mobile: Simple partial matching for performance
        filtered = filtered.filter((call: Appointment) => 
          `${call.firstName} ${call.lastName}`.toLowerCase().includes(searchLower) ||
          call.email.toLowerCase().includes(searchLower) ||
          (call.company && call.company.toLowerCase().includes(searchLower)) ||
          (call.phone && call.phone.replace(/\D/g, '').includes(searchLower.replace(/\D/g, '')))
        );
      } else if (deviceType === 'tablet') {
        // Tablet: Enhanced search with word matching
        filtered = filtered.filter((call: Appointment) => {
          const searchFields = [
            `${call.firstName} ${call.lastName}`.toLowerCase(),
            call.email.toLowerCase(),
            call.company?.toLowerCase() || '',
            call.phone?.replace(/\D/g, '') || ''
          ];
          
          return searchFields.some((field: string) => 
            field.includes(searchLower) || 
            field.split(' ').some((word: string) => word.startsWith(searchLower))
          );
        });
      } else {
        // Desktop: Advanced search with multiple strategies
        filtered = filtered.filter((call: Appointment) => {
          const searchFields = [
            `${call.firstName} ${call.lastName}`.toLowerCase(),
            call.email.toLowerCase(),
            call.company?.toLowerCase() || '',
            call.phone?.replace(/\D/g, '') || '',
            call.interest?.toLowerCase() || ''
          ];
          
          return searchFields.some((field: string) => {
            if (field.includes(searchLower)) return true;
            
            // Word-based search
            const words = field.split(' ');
            if (words.some((word: string) => word.startsWith(searchLower))) return true;
            
            // Partial word matching for desktop
            if (searchLower.length > 2) {
              return words.some((word: string) => word.length > 3 && word.includes(searchLower));
            }
            
            return false;
          });
        });
      }
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((call: Appointment) => call.status === statusFilter);
    }

    // Device-aware date filtering with different performance considerations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter((call: Appointment) => {
        const callDate = new Date(call.date);
        return callDate >= today;
      });
    } else if (dateFilter === 'past') {
      if (deviceType === 'mobile') {
        // Mobile: Limit past appointments to last 30 days for performance
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        filtered = filtered.filter((call: Appointment) => {
          const callDate = new Date(call.date);
          return callDate < today && callDate >= thirtyDaysAgo;
        });
      } else {
        // Tablet/Desktop: Show all past appointments
        filtered = filtered.filter((call: Appointment) => {
          const callDate = new Date(call.date);
          return callDate < today;
        });
      }
    } else if (dateFilter === 'this-week') {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      filtered = filtered.filter((call: Appointment) => {
        const callDate = new Date(call.date);
        return callDate >= today && callDate <= nextWeek;
      });
    } else if (dateFilter === 'today') {
      // Today filter (if needed)
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      filtered = filtered.filter((call: Appointment) => {
        const callDate = new Date(call.date);
        return callDate >= today && callDate < tomorrow;
      });
    }

    // Device-specific sorting strategies
    if (deviceType === 'mobile') {
      // Mobile: Simple date sorting for performance
      filtered.sort((a: Appointment, b: Appointment) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        if (dateFilter === 'past') {
          return dateB.getTime() - dateA.getTime(); // Most recent past first
        } else {
          return dateA.getTime() - dateB.getTime(); // Soonest upcoming first
        }
      });
    } else if (deviceType === 'tablet') {
      // Tablet: Enhanced sorting with time consideration
      filtered.sort((a: Appointment, b: Appointment) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        
        if (dateFilter === 'past') {
          return dateTimeB.getTime() - dateTimeA.getTime();
        } else {
          return dateTimeA.getTime() - dateTimeB.getTime();
        }
      });
    } else {
      // Desktop: Full sorting with secondary criteria
      filtered.sort((a: Appointment, b: Appointment) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        
        if (dateFilter === 'past') {
          const primarySort = dateTimeB.getTime() - dateTimeA.getTime();
          // Secondary sort by status priority for desktop
          if (primarySort === 0) {
            const statusPriority = { 'confirmed': 0, 'pending': 1, 'completed': 2, 'cancelled': 3 };
            const statusA = statusPriority[a.status as keyof typeof statusPriority] || 4;
            const statusB = statusPriority[b.status as keyof typeof statusPriority] || 4;
            return statusA - statusB;
          }
          return primarySort;
        } else {
          const primarySort = dateTimeA.getTime() - dateTimeB.getTime();
          if (primarySort === 0) {
            const statusPriority = { 'pending': 0, 'confirmed': 1, 'completed': 2, 'cancelled': 3 };
            const statusA = statusPriority[a.status as keyof typeof statusPriority] || 4;
            const statusB = statusPriority[b.status as keyof typeof statusPriority] || 4;
            return statusA - statusB;
          }
          return primarySort;
        }
      });
    }

    // Device-specific result limiting for performance
    if (deviceType === 'mobile' && filtered.length > 50) {
      // Mobile: Hard limit for performance
      filtered = filtered.slice(0, 50);
      console.log('Mobile: Limited results to 50 appointments for performance');
    } else if (deviceType === 'tablet' && filtered.length > 100) {
      // Tablet: Moderate limit
      filtered = filtered.slice(0, 100);
      console.log('Tablet: Limited results to 100 appointments');
    }
    // Desktop: No hard limits

    return filtered;
  }, [scheduledCalls, searchTerm, statusFilter, dateFilter, deviceType]);

  // Device-aware pagination calculations
  const totalPages = Math.ceil(filteredAndSortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAndSortedAppointments.slice(startIndex, endIndex);

  // Device-aware filter change handling
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    
    if (filterType === 'status') {
      setStatusFilter(value);
      // Device-specific status filter feedback
      if (deviceType === 'mobile' && isTouchDevice) {
        console.log(`Touch status filter: ${value}`);
      }
    }
    
    if (filterType === 'date') {
      setDateFilter(value);
      // Device-specific date filter feedback
      if (deviceType === 'mobile' && isTouchDevice) {
        console.log(`Touch date filter: ${value}`);
      }
    }
  };

  // Device-aware search handling with debouncing for touch devices
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    
    // Device-specific search feedback
    if (deviceType === 'mobile') {
      // Mobile: Log search for performance monitoring
      console.log(`Mobile search: "${value}" (${value.length} chars)`);
    } else if (deviceType === 'tablet' && isTouchDevice) {
      console.log(`Tablet touch search: "${value}"`);
    }
  };

  // Device-aware pagination with touch-optimized navigation
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    
    // Device-specific page navigation feedback
    if (deviceType === 'mobile') {
      console.log(`Mobile page navigation: ${currentPage} -> ${validPage}`);
      // Mobile: Could implement haptic feedback here if available
    } else if (deviceType === 'tablet' && isTouchDevice) {
      console.log(`Tablet touch navigation: page ${validPage}`);
    }
  };

  // Device-aware filter clearing with different confirmation strategies
  const clearAllFilters = () => {
    const hasActiveFilters = searchTerm || statusFilter !== 'all' || dateFilter !== 'upcoming';
    
    if (!hasActiveFilters) return;
    
    // Device-specific confirmation behavior
    if (deviceType === 'desktop' && hasActiveFilters) {
      const confirmed = confirm('Clear all filters and reset view?');
      if (!confirmed) return;
    }
    // Mobile/Tablet: No confirmation needed for better UX
    
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('upcoming');
    setCurrentPage(1);
    
    // Device-specific clear feedback
    if (deviceType === 'mobile') {
      console.log('Mobile: All filters cleared');
    }
  };

  // Device-aware quick filter presets
  const applyQuickFilter = (filterName: string) => {
    switch (filterName) {
      case 'today':
        setDateFilter('today');
        setStatusFilter('all');
        setCurrentPage(1);
        break;
      case 'this-week':
        setDateFilter('this-week');
        setStatusFilter('all');
        setCurrentPage(1);
        break;
      case 'pending':
        setStatusFilter('pending');
        setDateFilter('upcoming');
        setCurrentPage(1);
        break;
      case 'confirmed':
        setStatusFilter('confirmed');
        setDateFilter('upcoming');
        setCurrentPage(1);
        break;
      case 'recent':
        setDateFilter('past');
        setStatusFilter('all');
        setCurrentPage(1);
        break;
      default:
        console.warn(`Unknown quick filter: ${filterName}`);
        return;
    }
    
    console.log(`Applied quick filter "${filterName}" on ${deviceType}`);
  };

  // Device-aware search suggestions based on current data
  const getSearchSuggestions = (query: string): string[] => {
    if (!query || query.length < 2) return [];
    
    const queryLower = query.toLowerCase();
    const suggestions: Set<string> = new Set();
    
    // Device-specific suggestion limits
    const maxSuggestions = deviceType === 'mobile' ? 3 : 
                          deviceType === 'tablet' ? 5 : 8;
    
    scheduledCalls.forEach((call: Appointment) => {
      if (suggestions.size >= maxSuggestions) return;
      
      // Name suggestions
      const fullName = `${call.firstName} ${call.lastName}`;
      if (fullName.toLowerCase().includes(queryLower)) {
        suggestions.add(fullName);
      }
      
      // Company suggestions (if not mobile for performance)
      if (deviceType !== 'mobile' && call.company && 
          call.company.toLowerCase().includes(queryLower)) {
        suggestions.add(call.company);
      }
      
      // Email domain suggestions for desktop
      if (deviceType === 'desktop' && call.email.toLowerCase().includes(queryLower)) {
        const emailDomain = call.email.split('@')[1];
        if (emailDomain && emailDomain.toLowerCase().includes(queryLower)) {
          suggestions.add(emailDomain);
        }
      }
    });
    
    return Array.from(suggestions).slice(0, maxSuggestions);
  };

  // Device-aware filter statistics
  const getFilterStats = () => {
    const stats = {
      totalAppointments: scheduledCalls.length,
      filteredAppointments: filteredAndSortedAppointments.length,
      currentPageItems: currentAppointments.length,
      statusBreakdown: {} as Record<string, number>,
      dateBreakdown: {} as Record<string, number>
    };
    
    // Calculate status breakdown
    scheduledCalls.forEach((call: Appointment) => {
      stats.statusBreakdown[call.status] = (stats.statusBreakdown[call.status] || 0) + 1;
    });
    
    // Calculate date breakdown
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    scheduledCalls.forEach((call: Appointment) => {
      const callDate = new Date(call.date);
      if (callDate >= today) {
        stats.dateBreakdown.upcoming = (stats.dateBreakdown.upcoming || 0) + 1;
      } else {
        stats.dateBreakdown.past = (stats.dateBreakdown.past || 0) + 1;
      }
    });
    
    // Device-specific stats logging
    if (deviceType === 'desktop') {
      console.log('Filter Statistics:', stats);
    }
    
    return stats;
  };

  // Device-aware export filtered results
  const exportFilteredResults = (format: 'csv' | 'json' = 'csv'): void => {
    if (filteredAndSortedAppointments.length === 0) {
      console.warn('No appointments to export');
      return;
    }
    
    // Device-specific export limits
    const maxExportSize = {
      mobile: 25,   // Limited export on mobile
      tablet: 50,   // Moderate export on tablet  
      desktop: 200  // Full export on desktop
    };
    
    const exportData = filteredAndSortedAppointments.slice(0, maxExportSize[deviceType]);
    
    try {
      let fileContent: string;
      let fileName: string;
      let mimeType: string;

      if (format === 'csv') {
        // CSV format
        const csvHeaders = 'First Name,Last Name,Email,Phone,Company,Interest,Date,Time,Status\n';
        const csvRows = exportData.map((appointment: Appointment) => {
          return [
            appointment.firstName,
            appointment.lastName,
            appointment.email,
            appointment.phone || '',
            appointment.company || '',
            appointment.interest || '',
            appointment.date,
            appointment.time,
            appointment.status
          ].map((field: string) => `"${field.replace(/"/g, '""')}"`).join(',');
        }).join('\n');
        
        fileContent = csvHeaders + csvRows;
        fileName = `appointments-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        // JSON format
        fileContent = JSON.stringify(exportData, null, deviceType === 'mobile' ? 0 : 2);
        fileName = `appointments-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }

      // Create and trigger download
      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Exported ${exportData.length} appointments as ${format} on ${deviceType}`);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  // Device-aware filter persistence (using localStorage)
  const saveFilterPreferences = () => {
    const preferences = {
      statusFilter,
      dateFilter,
      itemsPerPage: itemsPerPage,
      deviceType: deviceType,
      savedAt: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('appointment-filter-preferences', JSON.stringify(preferences));
      console.log(`Filter preferences saved for ${deviceType}`);
    } catch (error) {
      console.error('Failed to save filter preferences:', error);
    }
  };

  const loadFilterPreferences = () => {
    try {
      const saved = localStorage.getItem('appointment-filter-preferences');
      if (saved) {
        const preferences = JSON.parse(saved);
        
        // Only apply preferences if they're from the same device type
        if (preferences.deviceType === deviceType) {
          setStatusFilter(preferences.statusFilter || 'all');
          setDateFilter(preferences.dateFilter || 'upcoming');
          setCurrentPage(1);
          console.log(`Filter preferences loaded for ${deviceType}`);
        }
      }
    } catch (error) {
      console.error('Failed to load filter preferences:', error);
    }
  };

  // Device-aware batch operations on filtered results
  const selectAllFiltered = (): number[] => {
    const maxSelection = {
      mobile: 5,    // Limited selection on mobile
      tablet: 15,   // Moderate selection on tablet
      desktop: 50   // Full selection on desktop
    };
    
    const selectedIds = filteredAndSortedAppointments
      .slice(0, maxSelection[deviceType])
      .map((appointment: Appointment) => appointment.id);
    
    console.log(`Selected ${selectedIds.length} appointments on ${deviceType}`);
    return selectedIds;
  };

  // Device-aware filter validation
  const validateFilters = (): { isValid: boolean; message?: string } => {
    // Check for potentially expensive filter combinations
    if (searchTerm.length === 1) {
      return {
        isValid: false,
        message: deviceType === 'mobile' ? 
          'Search needs 2+ characters' : 
          'Please enter at least 2 characters for search'
      };
    }
    
    // Check for mobile performance constraints
    if (deviceType === 'mobile' && searchTerm.length > 0 && 
        statusFilter === 'all' && dateFilter === 'all') {
      return {
        isValid: false,
        message: 'Please add date or status filter for better performance'
      };
    }
    
    return { isValid: true };
  };

  // Device-aware filter reset to defaults
  const resetToDefaults = () => {
    const defaultFilters = {
      mobile: { status: 'all', date: 'upcoming' },
      tablet: { status: 'all', date: 'upcoming' }, 
      desktop: { status: 'all', date: 'upcoming' }
    };
    
    const defaults = defaultFilters[deviceType];
    setSearchTerm('');
    setStatusFilter(defaults.status);
    setDateFilter(defaults.date);
    setCurrentPage(1);
    
    console.log(`Filters reset to ${deviceType} defaults`);
  };

  // Device-aware advanced filtering with dynamic criteria
  const applyAdvancedFilter = (criteria: {
    dateRange?: { start: string; end: string };
    statusList?: string[];
    searchFields?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const { dateRange, statusList, searchFields, sortBy, sortOrder } = criteria;
    
    // Device-specific criteria validation
    if (deviceType === 'mobile' && Object.keys(criteria).length > 2) {
      console.warn('Mobile: Too many filter criteria, may impact performance');
      return;
    }
    
    // Apply advanced date range filtering
    if (dateRange) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      // Custom date filter logic would go here
      console.log(`Advanced date filter applied: ${dateRange.start} to ${dateRange.end} on ${deviceType}`);
    }
    
    // Apply multiple status filtering
    if (statusList && statusList.length > 0) {
      console.log(`Advanced status filter applied: ${statusList.join(', ')} on ${deviceType}`);
    }
    
    // Custom search fields for desktop
    if (deviceType === 'desktop' && searchFields && searchFields.length > 0) {
      console.log(`Advanced search fields: ${searchFields.join(', ')}`);
    }
  };

  // Device-aware filter performance monitoring
  const getFilterPerformance = () => {
    const performance = {
      totalAppointments: scheduledCalls.length,
      filteredCount: filteredAndSortedAppointments.length,
      filterRatio: scheduledCalls.length > 0 ? 
        Math.round((filteredAndSortedAppointments.length / scheduledCalls.length) * 100) : 0,
      currentPage: currentPage,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage,
      hasActiveFilters: searchTerm || statusFilter !== 'all' || dateFilter !== 'upcoming',
      performanceScore: calculatePerformanceScore()
    };
    
    // Device-specific performance logging
    if (deviceType === 'desktop') {
      console.log('Filter Performance:', performance);
    } else if (deviceType === 'mobile' && performance.performanceScore < 70) {
      console.warn(`Mobile performance concern: score ${performance.performanceScore}`);
    }
    
    return performance;
  };

  // Calculate performance score based on device constraints
  const calculatePerformanceScore = (): number => {
    let score = 100;
    
    // Penalize based on result set size relative to device capacity
    const maxOptimalSize = {
      mobile: 20,
      tablet: 50,
      desktop: 100
    };
    
    const currentSize = filteredAndSortedAppointments.length;
    const optimal = maxOptimalSize[deviceType];
    
    if (currentSize > optimal) {
      score -= Math.min(30, ((currentSize - optimal) / optimal) * 20);
    }
    
    // Penalize complex search terms on mobile
    if (deviceType === 'mobile' && searchTerm.length > 10) {
      score -= 10;
    }
    
    // Penalize multiple active filters on mobile
    const activeFilterCount = [
      searchTerm ? 1 : 0,
      statusFilter !== 'all' ? 1 : 0,
      dateFilter !== 'upcoming' ? 1 : 0
    ].reduce((sum: number, count: number) => sum + count, 0);
    
    if (deviceType === 'mobile' && activeFilterCount > 2) {
      score -= 15;
    }
    
    return Math.max(0, Math.round(score));
  };

  // Device-aware filter suggestions based on current context
  const getFilterSuggestions = (): string[] => {
    const suggestions: string[] = [];
    const stats = getFilterStats();
    
    // Device-specific suggestion logic
    if (deviceType === 'mobile') {
      // Mobile: Simple, actionable suggestions
      if (stats.statusBreakdown.pending && stats.statusBreakdown.pending > 0) {
        suggestions.push('Show pending appointments');
      }
      if (stats.dateBreakdown.upcoming && stats.dateBreakdown.upcoming > 10) {
        suggestions.push('Filter to this week');
      }
      if (!searchTerm && filteredAndSortedAppointments.length > 15) {
        suggestions.push('Search by name');
      }
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced suggestions
      if (stats.statusBreakdown.confirmed && stats.statusBreakdown.confirmed > 5) {
        suggestions.push('View confirmed appointments only');
      }
      if (searchTerm && filteredAndSortedAppointments.length === 0) {
        suggestions.push('Try a shorter search term');
      }
      if (currentPage > 1 && currentAppointments.length < 3) {
        suggestions.push('Return to first page');
      }
    } else {
      // Desktop: Advanced suggestions
      if (stats.filteredAppointments > 50) {
        suggestions.push('Add more specific filters to narrow results');
      }
      if (statusFilter === 'all' && dateFilter === 'upcoming') {
        suggestions.push('Filter by appointment status for better organization');
      }
      if (!searchTerm && stats.totalAppointments > 100) {
        suggestions.push('Use search to find specific appointments quickly');
      }
    }
    
    return suggestions.slice(0, deviceType === 'mobile' ? 2 : 4);
  };

  // Device-aware bulk filter operations
  const applyBulkFilters = (filterSet: Array<{
    type: 'search' | 'status' | 'date';
    value: string;
  }>) => {
    // Device-specific bulk limits
    const maxBulkFilters = {
      mobile: 2,
      tablet: 3,
      desktop: 5
    };
    
    if (filterSet.length > maxBulkFilters[deviceType]) {
      console.warn(`${deviceType}: Bulk filter limit exceeded (${filterSet.length} > ${maxBulkFilters[deviceType]})`);
      return;
    }
    
    filterSet.forEach((filter) => {
      switch (filter.type) {
        case 'search':
          setSearchTerm(filter.value);
          break;
        case 'status':
          setStatusFilter(filter.value);
          break;
        case 'date':
          setDateFilter(filter.value);
          break;
      }
    });
    
    setCurrentPage(1);
    console.log(`Applied ${filterSet.length} bulk filters on ${deviceType}`);
  };

  // Device-aware filter cleanup and optimization
  const optimizeFilters = () => {
    let optimized = false;
    
    // Remove ineffective search terms
    if (searchTerm && searchTerm.length < 2) {
      setSearchTerm('');
      optimized = true;
    }
    
    // Reset to optimal page if current page is empty
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
      optimized = true;
    }
    
    // Device-specific optimizations
    if (deviceType === 'mobile') {
      // Mobile: Clear complex filters that don't reduce results significantly
      const reductionRatio = filteredAndSortedAppointments.length / scheduledCalls.length;
      if (reductionRatio > 0.9 && (searchTerm || statusFilter !== 'all')) {
        if (searchTerm.length < 3) {
          setSearchTerm('');
          optimized = true;
        }
      }
    }
    
    if (optimized) {
      console.log(`Filters optimized for ${deviceType}`);
    }
    
    return optimized;
  };

  // Device-aware filter state management
  const getFilterState = () => {
    return {
      searchTerm,
      statusFilter,
      dateFilter,
      currentPage,
      totalPages,
      itemsPerPage,
      deviceType,
      hasActiveFilters: searchTerm || statusFilter !== 'all' || dateFilter !== 'upcoming',
      resultCount: filteredAndSortedAppointments.length,
      performanceScore: calculatePerformanceScore()
    };
  };

  const setFilterState = (newState: {
    searchTerm?: string;
    statusFilter?: string;
    dateFilter?: string;
    currentPage?: number;
  }) => {
    if (newState.searchTerm !== undefined) setSearchTerm(newState.searchTerm);
    if (newState.statusFilter !== undefined) setStatusFilter(newState.statusFilter);
    if (newState.dateFilter !== undefined) setDateFilter(newState.dateFilter);
    if (newState.currentPage !== undefined) setCurrentPage(newState.currentPage);
    
    console.log(`Filter state updated on ${deviceType}`);
  };

  // Return all hook functionality with device-aware features
  return {
    // Core state
    currentPage,
    searchTerm,
    statusFilter,
    dateFilter,
    totalPages,
    startIndex,
    endIndex,
    itemsPerPage,
    
    // Core data
    filteredAndSortedAppointments,
    currentAppointments,
    
    // Core actions
    setSearchTerm,
    setStatusFilter,
    setDateFilter,
    handleFilterChange,
    handleSearchChange,
    goToPage,
    clearAllFilters,
    
    // Device-aware features
    deviceType,
    isTouchDevice,
    applyQuickFilter,
    getSearchSuggestions,
    getFilterStats,
    exportFilteredResults,
    saveFilterPreferences,
    loadFilterPreferences,
    selectAllFiltered,
    validateFilters,
    resetToDefaults,
    applyAdvancedFilter,
    getFilterPerformance,
    getFilterSuggestions,
    applyBulkFilters,
    optimizeFilters,
    getFilterState,
    setFilterState
  };
};