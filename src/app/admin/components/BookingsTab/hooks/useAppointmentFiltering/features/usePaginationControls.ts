// Enhanced Pagination Controls with Page Size Selection
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/features/usePaginationControls.ts

import { useCallback } from 'react';

export interface PaginationControlsConfig {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
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

export const usePaginationControls = (config: PaginationControlsConfig): UsePaginationControlsReturn => {
  const { currentPage, totalPages, pageSize, onPageChange, onPageSizeChange } = config;

  // Navigate to specific page with validation
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      console.log(`Navigation: Page ${currentPage} → ${page}`);
    } else {
      console.warn(`Invalid page navigation: ${page} (valid range: 1-${totalPages})`);
    }
  }, [currentPage, totalPages, onPageChange]);

  // Navigate to next page
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      onPageChange(nextPage);
      console.log(`Navigation: Next page ${currentPage} → ${nextPage}`);
    } else {
      console.warn('Cannot go to next page: already on last page');
    }
  }, [currentPage, totalPages, onPageChange]);

  // Navigate to previous page
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      onPageChange(prevPage);
      console.log(`Navigation: Previous page ${currentPage} → ${prevPage}`);
    } else {
      console.warn('Cannot go to previous page: already on first page');
    }
  }, [currentPage, onPageChange]);

  // Navigate to first page
  const goToFirstPage = useCallback(() => {
    if (currentPage !== 1) {
      onPageChange(1);
      console.log(`Navigation: First page ${currentPage} → 1`);
    } else {
      console.log('Already on first page');
    }
  }, [currentPage, onPageChange]);

  // Navigate to last page
  const goToLastPage = useCallback(() => {
    if (currentPage !== totalPages && totalPages > 0) {
      onPageChange(totalPages);
      console.log(`Navigation: Last page ${currentPage} → ${totalPages}`);
    } else {
      console.log('Already on last page or no pages available');
    }
  }, [currentPage, totalPages, onPageChange]);

  // Change page size (automatically resets to page 1)
  const changePageSize = useCallback((newPageSize: number) => {
    const validPageSizes = [5, 10, 15, 20];
    
    if (validPageSizes.includes(newPageSize)) {
      console.log(`Page size change: ${pageSize} → ${newPageSize} (reset to page 1)`);
      onPageSizeChange(newPageSize);
      // Note: The actual page reset is handled by usePaginationState
    } else {
      console.warn(`Invalid page size: ${newPageSize}. Valid options: ${validPageSizes.join(', ')}`);
    }
  }, [pageSize, onPageSizeChange]);

  // Navigation state checks
  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;
  const canGoFirst = currentPage > 1;
  const canGoLast = currentPage < totalPages && totalPages > 0;

  // Get pagination info for display
  const getPageInfo = useCallback((totalItems: number) => {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return {
      startItem,
      endItem,
      currentPage,
      totalPages,
      pageSize
    };
  }, [currentPage, pageSize, totalPages]);

  // Generate visible page numbers for pagination UI
  const getVisiblePageNumbers = useCallback((maxVisible: number = 7): (number | string)[] => {
    if (totalPages <= maxVisible) {
      // Show all pages if total is within limit
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const sidePages = Math.floor((maxVisible - 3) / 2); // Reserve space for first, last, and ellipsis

    // Always show first page
    pages.push(1);

    if (currentPage <= sidePages + 2) {
      // Current page is near the beginning
      for (let i = 2; i <= Math.min(maxVisible - 1, totalPages - 1); i++) {
        pages.push(i);
      }
      if (totalPages > maxVisible) {
        pages.push('...');
      }
    } else if (currentPage >= totalPages - sidePages - 1) {
      // Current page is near the end
      pages.push('...');
      for (let i = Math.max(2, totalPages - maxVisible + 2); i <= totalPages - 1; i++) {
        pages.push(i);
      }
    } else {
      // Current page is in the middle
      pages.push('...');
      for (let i = currentPage - sidePages; i <= currentPage + sidePages; i++) {
        pages.push(i);
      }
      pages.push('...');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  // Validate page number
  const validatePageNumber = useCallback((page: number): boolean => {
    return Number.isInteger(page) && page >= 1 && page <= totalPages;
  }, [totalPages]);

  return {
    // Navigation functions
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    changePageSize,

    // Navigation state
    canGoNext,
    canGoPrevious,
    canGoFirst,
    canGoLast,

    // Utility functions
    getPageInfo,
    getVisiblePageNumbers,
    validatePageNumber
  };
};