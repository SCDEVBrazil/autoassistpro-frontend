// TypeScript Interfaces and Types for Filtering System
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/types/filterTypes.ts

import { Appointment } from '../../../../../types';

// Core filter types
export type StatusFilter = 'all' | 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type DateFilter = 'all' | 'upcoming' | 'past' | 'today' | 'this-week' | 'this-month';
export type SortOption = 'date-asc' | 'date-desc' | 'status-priority' | 'name-asc' | 'name-desc' | 'company-asc';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type ExportFormat = 'csv' | 'json' | 'excel';
export type ExportScope = 'current-page' | 'filtered-results' | 'all-data';

// Filter state interfaces
export interface FilterState {
  searchTerm: string;
  statusFilter: StatusFilter;
  dateFilter: DateFilter;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface SortState {
  option: SortOption;
  direction: 'asc' | 'desc';
}

// Filter criteria for processing
export interface FilterCriteria {
  searchTerm: string;
  statusFilter: StatusFilter;
  dateFilter: DateFilter;
  sortOption?: SortOption;
}

// Pagination configuration
export interface PaginationConfig {
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
}

// Search configuration
export interface SearchConfig {
  minLength: number;
  maxLength: number;
  debounceMs: number;
  caseSensitive: boolean;
  searchFields: (keyof Appointment)[];
}

// Filter validation result
export interface FilterValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
  suggestions?: string[];
}

// Filter performance metrics
export interface FilterPerformanceMetrics {
  inputCount: number;
  outputCount: number;
  processingTimeMs: number;
  filterEfficiency: number;
  bottlenecks?: string[];
  recommendations?: string[];
}

// Filter statistics
export interface FilterStatistics {
  total: number;
  filtered: number;
  byStatus: Record<StatusFilter, number>;
  byDate: {
    upcoming: number;
    past: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  performance: {
    averageFilterTime: number;
    slowestFilter: string;
    fastestFilter: string;
  };
}

// Export configuration
export interface ExportConfig {
  format: ExportFormat;
  scope: ExportScope;
  filename?: string;
  includeHeaders: boolean;
  includeChatSessionId: boolean;
  dateFormat: 'iso' | 'us' | 'eu';
  maxRecords: number;
  maxFileSizeMB: number;
}

// Export result
export interface ExportResult {
  success: boolean;
  filename: string;
  recordCount: number;
  fileSize?: number;
  downloadUrl?: string;
  error?: string;
}

// Preference interfaces
export interface FilterPreferences {
  searchTerm: string;
  statusFilter: StatusFilter;
  dateFilter: DateFilter;
  pageSize: number;
  sortOption: SortOption;
  viewMode?: 'compact' | 'standard' | 'detailed';
  autoSave: boolean;
}

export interface PreferenceMetadata {
  deviceType: DeviceType;
  savedAt: string;
  version: string;
  sessionCount: number;
  userId?: string;
}

// Filter hook interfaces
export interface UseFilterStateReturn {
  searchTerm: string;
  statusFilter: StatusFilter;
  dateFilter: DateFilter;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: StatusFilter) => void;
  setDateFilter: (date: DateFilter) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getFilterCount: () => number;
}

export interface UsePaginationStateReturn {
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetToFirstPage: () => void;
  canGoNext: (totalPages: number) => boolean;
  canGoPrevious: () => boolean;
  getPageInfo: (totalItems: number) => {
    startItem: number;
    endItem: number;
    totalPages: number;
  };
}

export interface UseSearchFilteringReturn {
  filterBySearch: (appointments: Appointment[], searchTerm: string) => Appointment[];
  getSearchSuggestions: (appointments: Appointment[], partialTerm: string) => string[];
  validateSearchTerm: (term: string) => FilterValidationResult;
}

export interface UseStatusFilteringReturn {
  filterByStatus: (appointments: Appointment[], status: StatusFilter) => Appointment[];
  getStatusStats: (appointments: Appointment[]) => Record<StatusFilter, number>;
  getStatusOptions: () => { value: StatusFilter; label: string }[];
  validateStatus: (status: string) => boolean;
  getStatusPriority: (status: StatusFilter) => number;
}

export interface UseDateFilteringReturn {
  filterByDate: (appointments: Appointment[], dateFilter: DateFilter) => Appointment[];
  getDateStats: (appointments: Appointment[]) => {
    upcoming: number;
    past: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  getDateOptions: () => { value: DateFilter; label: string }[];
  validateDateFilter: (filter: string) => boolean;
  isUpcoming: (appointment: Appointment) => boolean;
  isPast: (appointment: Appointment) => boolean;
  isToday: (appointment: Appointment) => boolean;
}

export interface UseAppointmentSortingReturn {
  sortAppointments: (appointments: Appointment[], dateFilter: DateFilter) => Appointment[];
  sortByOption: (appointments: Appointment[], sortOption: SortOption) => Appointment[];
  getSortOptions: () => { value: SortOption; label: string }[];
  getStatusPriority: (status: StatusFilter) => number;
  compareByDateTime: (a: Appointment, b: Appointment) => number;
  compareByName: (a: Appointment, b: Appointment) => number;
}

export interface UsePaginationControlsReturn {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  changePageSize: (pageSize: number) => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  canGoFirst: boolean;
  canGoLast: boolean;
  getPageInfo: (totalItems: number) => {
    startItem: number;
    endItem: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
  getVisiblePageNumbers: (maxVisible?: number) => (number | string)[];
  validatePageNumber: (page: number) => boolean;
}

// Main filtering hook return type
export interface UseAppointmentFilteringReturn {
  // Core state
  searchTerm: string;
  statusFilter: StatusFilter;
  dateFilter: DateFilter;
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalPages: number;
  
  // Data
  filteredAndSortedAppointments: Appointment[];
  currentAppointments: Appointment[];
  
  // Pagination info
  startIndex: number;
  endIndex: number;
  
  // Core actions
  handleSearchChange: (value: string) => void;
  handleFilterChange: (type: 'status' | 'date', value: string) => void;
  clearAllFilters: () => void;
  
  // Pagination actions
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  
  // Advanced features
  deviceType: DeviceType;
  isTouchDevice: boolean;
  
  // Filter management
  getFilterState: () => FilterCriteria;
  setFilterState: (state: Partial<FilterCriteria & PaginationConfig>) => void;
  
  // Preferences
  saveFilterPreferences: () => void;
  loadFilterPreferences: () => void;
  
  // Export
  exportFilteredResults: (config: Partial<ExportConfig>) => Promise<ExportResult>;
  
  // Statistics and utilities
  getFilterStats: () => FilterStatistics;
  validateFilters: () => FilterValidationResult;
  getPerformanceMetrics: () => FilterPerformanceMetrics;
  
  // Quick actions
  applyQuickFilter: (type: 'pending-today' | 'overdue' | 'recent-completed') => void;
  selectAllFiltered: () => number[];
}

// Utility function types
export type FilterFunction<T = Appointment> = (items: T[], criteria: FilterCriteria) => T[];
export type SortFunction<T = Appointment> = (items: T[], option: SortOption) => T[];
export type ValidationFunction = (criteria: FilterCriteria) => FilterValidationResult;

// Event handler types
export type SearchChangeHandler = (searchTerm: string) => void;
export type FilterChangeHandler = (type: 'status' | 'date', value: string) => void;
export type PageChangeHandler = (page: number) => void;
export type PageSizeChangeHandler = (size: number) => void;
export type SortChangeHandler = (option: SortOption) => void;

// Component prop types
export interface FilterComponentProps {
  searchTerm: string;
  statusFilter: StatusFilter;
  dateFilter: DateFilter;
  onSearchChange: SearchChangeHandler;
  onFilterChange: FilterChangeHandler;
  onClearFilters: () => void;
  isLoading?: boolean;
  deviceType: DeviceType;
}

export interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalItems: number;
  onPageChange: PageChangeHandler;
  onPageSizeChange: PageSizeChangeHandler;
  deviceType: DeviceType;
  showPageSizeSelector?: boolean;
  showPageInfo?: boolean;
}

export interface SortComponentProps {
  currentSort: SortOption;
  options: { value: SortOption; label: string }[];
  onSortChange: SortChangeHandler;
  deviceType: DeviceType;
}

// Error types
export interface FilterError extends Error {
  type: 'validation' | 'performance' | 'export' | 'storage';
  code: string;
  context?: Record<string, any>;
  suggestions?: string[];
}

// Configuration defaults
export interface FilteringDefaults {
  search: {
    minLength: number;
    maxLength: number;
    debounceMs: Record<DeviceType, number>;
  };
  pagination: {
    defaultPageSize: Record<DeviceType, number>;
    pageSizeOptions: number[];
    maxPageSize: Record<DeviceType, number>;
  };
  filters: {
    defaultStatus: StatusFilter;
    defaultDate: DateFilter;
    defaultSort: SortOption;
  };
  performance: {
    maxResults: Record<DeviceType, number>;
    slowThresholdMs: Record<DeviceType, number>;
  };
}

// Analytics and tracking types
export interface FilterUsageAnalytics {
  mostUsedFilters: Record<string, number>;
  averageResultCount: number;
  performanceMetrics: {
    averageFilterTime: number;
    slowestOperations: string[];
  };
  userBehavior: {
    avgPagesToView: number;
    preferredPageSize: number;
    commonSearchTerms: string[];
  };
}

// Advanced filter types for future enhancements
export interface AdvancedFilterConfig {
  customFields?: (keyof Appointment)[];
  dateRanges?: { start: string; end: string };
  numericFilters?: Record<string, { min?: number; max?: number }>;
  regexPatterns?: Record<string, string>;
  excludeFilters?: Partial<FilterCriteria>;
}

// Bulk operations types
export interface BulkOperationConfig {
  operation: 'delete' | 'export' | 'update-status';
  appointmentIds: number[];
  batchSize: number;
  confirmationRequired: boolean;
}

export interface BulkOperationResult {
  success: boolean;
  processedCount: number;
  errorCount: number;
  errors?: string[];
  duration: number;
}