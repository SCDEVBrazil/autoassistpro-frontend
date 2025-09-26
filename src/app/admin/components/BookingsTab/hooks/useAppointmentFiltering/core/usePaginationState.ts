// Pagination State Management with Page Size Selection
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/core/usePaginationState.ts

import { useState, useCallback, useEffect } from 'react';
import { PAGINATION_DEFAULTS } from '../constants/filterConstants';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
}

export interface UsePaginationStateReturn {
  // State values
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  
  // Actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetToFirstPage: () => void;
  
  // Utilities
  canGoNext: (totalPages: number) => boolean;
  canGoPrevious: () => boolean;
  getPageInfo: (totalItems: number) => {
    startItem: number;
    endItem: number;
    totalPages: number;
  };
}

export const usePaginationState = (deviceType: 'mobile' | 'tablet' | 'desktop'): UsePaginationStateReturn => {
  // Get device-specific default page size
  const getDefaultPageSize = (device: string): number => {
    switch (device) {
      case 'mobile':
        return PAGINATION_DEFAULTS.defaultPageSizes.mobile;
      case 'tablet':
        return PAGINATION_DEFAULTS.defaultPageSizes.tablet;
      case 'desktop':
        return PAGINATION_DEFAULTS.defaultPageSizes.desktop;
      default:
        return PAGINATION_DEFAULTS.defaultPageSizes.desktop;
    }
  };

  // Load saved page size from localStorage or use device default
  const getInitialPageSize = (): number => {
    try {
      const saved = localStorage.getItem(`bookings_pageSize_${deviceType}`);
      if (saved) {
        const parsedSize = parseInt(saved, 10);
        if (PAGINATION_DEFAULTS.pageSizeOptions.includes(parsedSize as 5 | 10 | 15 | 20)) {
          return parsedSize;
        }
      }
    } catch (error) {
      console.warn('Failed to load saved page size:', error);
    }
    return getDefaultPageSize(deviceType);
  };

  // Pagination state
  const [currentPage, setCurrentPageState] = useState<number>(PAGINATION_DEFAULTS.initialPage);
  const [pageSize, setPageSizeState] = useState<number>(getInitialPageSize());

  // Save page size preference when it changes
  useEffect(() => {
    try {
      localStorage.setItem(`bookings_pageSize_${deviceType}`, pageSize.toString());
      console.log(`Page size preference saved: ${pageSize} for ${deviceType}`);
    } catch (error) {
      console.warn('Failed to save page size preference:', error);
    }
  }, [pageSize, deviceType]);

  // Enhanced setters with validation
  const setCurrentPage = useCallback((page: number) => {
    if (page >= 1) {
      setCurrentPageState(page);
      console.log(`Page changed to: ${page}`);
    } else {
      console.warn(`Invalid page number: ${page}`);
    }
  }, []);

    const setPageSize = useCallback((size: number) => {
    if (PAGINATION_DEFAULTS.pageSizeOptions.includes(size as 5 | 10 | 15 | 20)) {
        setPageSizeState(size);
        setCurrentPageState(1); // Reset to first page when changing page size
        console.log(`Page size changed to: ${size}, reset to page 1`);
    } else {
        console.warn(`Invalid page size: ${size}. Valid options: ${PAGINATION_DEFAULTS.pageSizeOptions.join(', ')}`);
    }
    }, []);

  // Reset to first page (useful when filters change)
  const resetToFirstPage = useCallback(() => {
    setCurrentPageState(1);
    console.log('Reset to first page');
  }, []);

  // Navigation utilities
  const canGoNext = useCallback((totalPages: number): boolean => {
    return currentPage < totalPages;
  }, [currentPage]);

  const canGoPrevious = useCallback((): boolean => {
    return currentPage > 1;
  }, [currentPage]);

  // Calculate pagination info
  const getPageInfo = useCallback((totalItems: number) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return {
      startItem,
      endItem,
      totalPages
    };
  }, [currentPage, pageSize]);

    return {
    // State values
    currentPage,
    pageSize,
    pageSizeOptions: [...PAGINATION_DEFAULTS.pageSizeOptions], // Convert readonly tuple to mutable array
    
    // Actions
    setCurrentPage,
    setPageSize,
    resetToFirstPage,
    
    // Utilities
    canGoNext,
    canGoPrevious,
    getPageInfo
    };
};