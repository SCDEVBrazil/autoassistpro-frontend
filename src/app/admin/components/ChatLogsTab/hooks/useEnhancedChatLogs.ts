// Fixed Enhanced Chat Logs Hook with Pagination, View Modes, and Filtering
// src/app/admin/components/ChatLogsTab/hooks/useEnhancedChatLogs.ts

import { useState, useCallback, useMemo, useEffect } from 'react';
import { ConversationBox } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';

export type ViewMode = 'grid' | 'list' | 'table';
export type FilterOption = 'all' | 'appointments' | 'no-appointments' | 'recent';
export type SortOption = 'newest' | 'oldest' | 'most-messages' | 'alphabetical';

interface PaginationConfig {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

interface FilterConfig {
  searchTerm: string;
  filter: FilterOption;
  dateRange: { start: string; end: string } | null;
  sort: SortOption;
}

// Storage keys for persisting user preferences
const STORAGE_KEYS = {
  PAGE_SIZE_GRID: 'chatLogs_pageSize_grid',
  PAGE_SIZE_LIST: 'chatLogs_pageSize_list',
  PAGE_SIZE_TABLE: 'chatLogs_pageSize_table',
  VIEW_MODE: 'chatLogs_viewMode'
};

// Helper functions for localStorage
const getStoredPageSize = (viewMode: ViewMode, defaultSize: number): number => {
  try {
    const key = viewMode === 'grid' ? STORAGE_KEYS.PAGE_SIZE_GRID :
                viewMode === 'list' ? STORAGE_KEYS.PAGE_SIZE_LIST :
                STORAGE_KEYS.PAGE_SIZE_TABLE;
    const stored = localStorage.getItem(key);
    return stored ? parseInt(stored, 10) : defaultSize;
  } catch (error) {
    console.warn('Failed to get stored page size:', error);
    return defaultSize;
  }
};

const setStoredPageSize = (viewMode: ViewMode, pageSize: number): void => {
  try {
    const key = viewMode === 'grid' ? STORAGE_KEYS.PAGE_SIZE_GRID :
                viewMode === 'list' ? STORAGE_KEYS.PAGE_SIZE_LIST :
                STORAGE_KEYS.PAGE_SIZE_TABLE;
    localStorage.setItem(key, pageSize.toString());
  } catch (error) {
    console.warn('Failed to store page size:', error);
  }
};

const getStoredViewMode = (): ViewMode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return (stored && ['grid', 'list', 'table'].includes(stored)) ? stored as ViewMode : 'grid';
  } catch (error) {
    console.warn('Failed to get stored view mode:', error);
    return 'grid';
  }
};

const setStoredViewMode = (viewMode: ViewMode): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  } catch (error) {
    console.warn('Failed to store view mode:', error);
  }
};

export const useEnhancedChatLogs = (conversations: ConversationBox[]) => {
  const { type: deviceType } = useDeviceDetection();
  
  // Initialize view mode from localStorage
  const [viewMode, setViewMode] = useState<ViewMode>(() => getStoredViewMode());
  
  // Initialize pagination with stored page size
  const [pagination, setPagination] = useState<PaginationConfig>(() => {
    // Default page sizes based on device and view mode
    const baseSizes = {
      mobile: { grid: 4, list: 5, table: 5 },
      tablet: { grid: 6, list: 5, table: 5 },
      desktop: { grid: 6, list: 5, table: 5 }
    };
    const defaultPageSize = baseSizes[deviceType][viewMode];
    const storedPageSize = getStoredPageSize(viewMode, defaultPageSize);
    
    return {
      page: 1,
      pageSize: storedPageSize,
      totalPages: 1,
      totalItems: 0
    };
  });
  
  // Filter state
  const [filters, setFilters] = useState<FilterConfig>({
    searchTerm: '',
    filter: 'all',
    dateRange: null,
    sort: 'newest'
  });

  // Custom setViewMode that preserves stored page size for each view mode
  const setViewModeWithReset = useCallback((mode: ViewMode) => {
    console.log('View mode changing to:', mode);
    setViewMode(mode);
    
    // Store the new view mode
    setStoredViewMode(mode);
    
    // Get the stored page size for this view mode, or use default
    const baseSizes = {
      mobile: { grid: 4, list: 5, table: 5 },
      tablet: { grid: 6, list: 5, table: 5 },
      desktop: { grid: 6, list: 5, table: 5 }
    };
    const defaultPageSize = baseSizes[deviceType][mode];
    const storedPageSize = getStoredPageSize(mode, defaultPageSize);
    
    console.log('Setting pageSize to stored value:', storedPageSize, 'for mode:', mode);
    setPagination(prev => ({
      ...prev,
      pageSize: storedPageSize,
      page: 1
    }));
  }, [deviceType]);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];
    
    // Apply search filter
    if (filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.userName.toLowerCase().includes(searchTerm) ||
        conv.firstMessage.toLowerCase().includes(searchTerm) ||
        conv.sessionId.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filter
    switch (filters.filter) {
      case 'appointments':
        filtered = filtered.filter(conv => conv.hasAppointment);
        break;
      case 'no-appointments':
        filtered = filtered.filter(conv => !conv.hasAppointment);
        break;
      case 'recent':
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        filtered = filtered.filter(conv => 
          new Date(conv.lastActivity) >= oneDayAgo
        );
        break;
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filtered = filtered.filter(conv => {
        const convDate = new Date(conv.lastActivity);
        return convDate >= start && convDate <= end;
      });
    }
    
    // Apply sorting
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime());
        break;
      case 'most-messages':
        filtered.sort((a, b) => b.messageCount - a.messageCount);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.userName.localeCompare(b.userName));
        break;
    }
    
    return filtered;
  }, [conversations, filters]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    const pageSize = pagination.pageSize;
    const totalItems = filteredConversations.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (pagination.page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = filteredConversations.slice(startIndex, endIndex);
    
    return {
      items,
      totalPages,
      totalItems
    };
  }, [filteredConversations, pagination.page, pagination.pageSize]);

  // Actions
  const setSearchTerm = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const setFilter = useCallback((filter: FilterOption) => {
    setFilters(prev => ({ ...prev, filter }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const setSort = useCallback((sort: SortOption) => {
    setFilters(prev => ({ ...prev, sort }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const setDateRange = useCallback((dateRange: { start: string; end: string } | null) => {
    setFilters(prev => ({ ...prev, dateRange }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= paginatedData.totalPages) {
      setPagination(prev => ({ ...prev, page }));
    }
  }, [paginatedData.totalPages]);

  // FIXED: Store page size preference and remove pagination dependency to avoid stale closure
  const changePageSize = useCallback((pageSize: number) => {
    console.log('changePageSize called with:', pageSize, 'for viewMode:', viewMode);
    
    // Store the page size preference for current view mode
    setStoredPageSize(viewMode, pageSize);
    
    setPagination(prev => {
      console.log('Current pagination state:', prev);
      const newPagination = {
        ...prev,
        pageSize,
        page: 1 // Always reset to first page when changing page size
      };
      console.log('Setting new pagination state:', newPagination);
      return newPagination;
    });
  }, [viewMode]); // Include viewMode dependency to access current view mode

  const clearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      filter: 'all',
      dateRange: null,
      sort: 'newest'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  return {
    // View mode
    viewMode,
    setViewMode: setViewModeWithReset,
    
    // Data
    conversations: paginatedData.items,
    allConversations: conversations,
    filteredCount: filteredConversations.length,
    
    // Pagination - use calculated values instead of conflicting state updates
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: paginatedData.totalPages,
      totalItems: paginatedData.totalItems
    },
    goToPage,
    changePageSize,
    
    // Filters
    filters,
    setSearchTerm,
    setFilter,
    setSort,
    setDateRange,
    clearFilters,
    
    // Device info
    deviceType
  };
};