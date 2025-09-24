// src/app/admin/components/ChatLogsTab/hooks/useConversationFiltering.ts

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ConversationBox } from '../types';

// Define filter types for better type safety
type FilterType = 'all' | 'hasAppointment' | 'noAppointment' | 'recent' | 'today';
type SortType = 'lastActivity' | 'userName' | 'messageCount' | 'duration';
type SortOrder = 'asc' | 'desc';

interface FilterState {
  searchTerm: string;
  filterType: FilterType;
  sortType: SortType;
  sortOrder: SortOrder;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

export const useConversationFiltering = (conversations: ConversationBox[]) => {
  const { type: deviceType, isTouchDevice } = useDeviceDetection();
  
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    filterType: 'all',
    sortType: 'lastActivity',
    sortOrder: 'desc',
    dateRange: {
      start: null,
      end: null
    }
  });

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Device-aware search term handling with different input processing
  const handleSearchTermChange = useCallback((term: string) => {
    let processedTerm = term;
    
    if (deviceType === 'mobile') {
      // Mobile: More lenient search processing
      processedTerm = term.toLowerCase().trim();
      // Mobile: Limit search term length for performance
      if (processedTerm.length > 50) {
        processedTerm = processedTerm.substring(0, 50);
      }
    } else if (deviceType === 'tablet') {
      // Tablet: Balanced processing
      processedTerm = term.trim();
      if (processedTerm.length > 100) {
        processedTerm = processedTerm.substring(0, 100);
      }
    } else {
      // Desktop: Minimal processing, preserve exact input
      processedTerm = term;
      if (processedTerm.length > 200) {
        processedTerm = processedTerm.substring(0, 200);
      }
    }
    
    setFilterState(prev => ({ ...prev, searchTerm: processedTerm }));
  }, [deviceType]);

  // Device-aware search suggestions generation
  const generateSearchSuggestions = useCallback(() => {
    if (!filterState.searchTerm || filterState.searchTerm.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    
    const searchLower = filterState.searchTerm.toLowerCase();
    const suggestions = new Set<string>();
    
    // Extract unique terms from conversations
    conversations.forEach(conv => {
      // User names
      if (conv.userName.toLowerCase().includes(searchLower)) {
        suggestions.add(conv.userName);
      }
      
      // First message keywords
      const firstMessageWords = conv.firstMessage.toLowerCase().split(/\s+/);
      firstMessageWords.forEach(word => {
        if (word.length > 3 && word.includes(searchLower)) {
          suggestions.add(word);
        }
      });
      
      // Session ID partial matches
      if (conv.sessionId.toLowerCase().includes(searchLower)) {
        suggestions.add(conv.sessionId);
      }
    });
    
    let suggestionArray = Array.from(suggestions);
    
    // Device-specific suggestion limits
    const maxSuggestions = {
      mobile: 3,    // Fewer suggestions on mobile for simpler UI
      tablet: 5,    // Moderate number for tablet
      desktop: 8    // More suggestions on desktop
    };
    
    suggestionArray = suggestionArray
      .slice(0, maxSuggestions[deviceType])
      .sort((a, b) => a.localeCompare(b));
    
    setSearchSuggestions(suggestionArray);
  }, [filterState.searchTerm, conversations, deviceType]);

  // Update suggestions when search term changes
  useEffect(() => {
    if (deviceType !== 'mobile') {
      // Skip suggestions on mobile for simpler UX
      generateSearchSuggestions();
    }
  }, [generateSearchSuggestions, deviceType]);

  // Device-aware search history management
  const addToSearchHistory = useCallback((term: string) => {
    if (!term.trim() || term.length < 2) return;
    
    const historyLimits = {
      mobile: 5,     // Fewer history items on mobile
      tablet: 10,    // Moderate history on tablet  
      desktop: 20    // More history on desktop
    };
    
    setSearchHistory(prev => {
      const newHistory = [term, ...prev.filter(item => item !== term)]
        .slice(0, historyLimits[deviceType]);
      
      // Store in localStorage for persistence (device-specific keys)
      try {
        localStorage.setItem(
          `chatLogs-searchHistory-${deviceType}`, 
          JSON.stringify(newHistory)
        );
      } catch (error) {
        console.log('Could not save search history:', error);
      }
      
      return newHistory;
    });
  }, [deviceType]);

  // Load search history on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(`chatLogs-searchHistory-${deviceType}`);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed);
        }
      }
    } catch (error) {
      console.log('Could not load search history:', error);
    }
  }, [deviceType]);

  // Device-aware main filtering logic with performance optimization
  const filteredConversations = useMemo(() => {
    let filtered = [...conversations];
    
    // Apply search term filter with device-specific matching
    if (filterState.searchTerm.trim()) {
      const searchLower = filterState.searchTerm.toLowerCase();
      
      filtered = filtered.filter(conv => {
        if (deviceType === 'mobile') {
          // Mobile: Simple, fast matching
          return conv.userName.toLowerCase().includes(searchLower) ||
                 conv.firstMessage.toLowerCase().includes(searchLower);
        } else if (deviceType === 'tablet') {
          // Tablet: Balanced matching with session ID
          return conv.userName.toLowerCase().includes(searchLower) ||
                 conv.firstMessage.toLowerCase().includes(searchLower) ||
                 conv.sessionId.toLowerCase().includes(searchLower);
        } else {
          // Desktop: Comprehensive matching including message content
          const hasUserNameMatch = conv.userName.toLowerCase().includes(searchLower);
          const hasFirstMessageMatch = conv.firstMessage.toLowerCase().includes(searchLower);
          const hasSessionMatch = conv.sessionId.toLowerCase().includes(searchLower);
          
          // Desktop: Also search within individual messages for thorough results
          const hasMessageContentMatch = conv.messages?.some(msg => 
            msg.content.toLowerCase().includes(searchLower)
          ) || false;
          
          return hasUserNameMatch || hasFirstMessageMatch || hasSessionMatch || hasMessageContentMatch;
        }
      });
    }
    
    // Apply filter type
    switch (filterState.filterType) {
      case 'hasAppointment':
        filtered = filtered.filter(conv => conv.hasAppointment);
        break;
      case 'noAppointment':
        filtered = filtered.filter(conv => !conv.hasAppointment);
        break;
      case 'recent':
        // Recent: last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filtered = filtered.filter(conv => new Date(conv.lastActivity) >= sevenDaysAgo);
        break;
      case 'today':
        // Today only
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filtered = filtered.filter(conv => {
          const convDate = new Date(conv.lastActivity);
          return convDate >= today && convDate < tomorrow;
        });
        break;
      default:
        // 'all' - no additional filtering
        break;
    }
    
    // Apply date range filter if set
    if (filterState.dateRange.start && filterState.dateRange.end) {
      const startDate = new Date(filterState.dateRange.start);
      const endDate = new Date(filterState.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include entire end day
      
      filtered = filtered.filter(conv => {
        const convDate = new Date(conv.lastActivity);
        return convDate >= startDate && convDate <= endDate;
      });
    }
    
    return filtered;
  }, [conversations, filterState, deviceType]);

  // Device-aware sorting with performance optimization
  const sortedConversations = useMemo(() => {
    const sorted = [...filteredConversations];
    
    // Device-specific sorting strategies
    if (deviceType === 'mobile') {
      // Mobile: Simplified sorting for better performance
      switch (filterState.sortType) {
        case 'lastActivity':
          sorted.sort((a, b) => {
            const dateA = new Date(a.lastActivity).getTime();
            const dateB = new Date(b.lastActivity).getTime();
            return filterState.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
          });
          break;
        case 'userName':
          sorted.sort((a, b) => {
            const comparison = a.userName.localeCompare(b.userName);
            return filterState.sortOrder === 'desc' ? -comparison : comparison;
          });
          break;
        default:
          // Mobile: Default to lastActivity for simplicity
          sorted.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
      }
    } else {
      // Tablet/Desktop: Full sorting capabilities
      switch (filterState.sortType) {
        case 'lastActivity':
          sorted.sort((a, b) => {
            const dateA = new Date(a.lastActivity).getTime();
            const dateB = new Date(b.lastActivity).getTime();
            return filterState.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
          });
          break;
        case 'userName':
          sorted.sort((a, b) => {
            const comparison = a.userName.localeCompare(b.userName);
            return filterState.sortOrder === 'desc' ? -comparison : comparison;
          });
          break;
        case 'messageCount':
          sorted.sort((a, b) => {
            const diff = a.messageCount - b.messageCount;
            return filterState.sortOrder === 'desc' ? -diff : diff;
          });
          break;
        case 'duration':
          sorted.sort((a, b) => {
            // Convert duration strings like "5m" to numbers for comparison
            const getDurationMinutes = (duration: string): number => {
              const match = duration.match(/(\d+)m/);
              return match ? parseInt(match[1], 10) : 0;
            };
            
            const durationA = getDurationMinutes(a.duration);
            const durationB = getDurationMinutes(b.duration);
            const diff = durationA - durationB;
            return filterState.sortOrder === 'desc' ? -diff : diff;
          });
          break;
        default:
          sorted.sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
      }
    }
    
    return sorted;
  }, [filteredConversations, filterState.sortType, filterState.sortOrder, deviceType]);

  // Device-aware filter actions
  const setSearchTerm = useCallback((term: string) => {
    handleSearchTermChange(term);
    
    // Add to search history when search is performed (not just typed)
    if (term.trim() && term !== filterState.searchTerm) {
      addToSearchHistory(term.trim());
    }
  }, [handleSearchTermChange, filterState.searchTerm, addToSearchHistory]);

  const clearSearch = useCallback(() => {
    setFilterState(prev => ({ ...prev, searchTerm: '' }));
    setSearchSuggestions([]);
    setIsSearchFocused(false);
  }, []);

  const setFilterType = useCallback((type: FilterType) => {
    setFilterState(prev => ({ ...prev, filterType: type }));
  }, []);

  const setSortType = useCallback((type: SortType) => {
    setFilterState(prev => ({ ...prev, sortType: type }));
  }, []);

  const setSortOrder = useCallback((order: SortOrder) => {
    setFilterState(prev => ({ ...prev, sortOrder: order }));
  }, []);

  const setDateRange = useCallback((start: string | null, end: string | null) => {
    setFilterState(prev => ({ 
      ...prev, 
      dateRange: { start, end } 
    }));
  }, []);

  // Device-aware quick filter actions
  const applyQuickFilter = useCallback((type: 'today' | 'recent' | 'withAppointments' | 'clear') => {
    switch (type) {
      case 'today':
        setFilterState(prev => ({ 
          ...prev, 
          filterType: 'today',
          dateRange: { start: null, end: null }
        }));
        break;
      case 'recent':
        setFilterState(prev => ({ 
          ...prev, 
          filterType: 'recent',
          dateRange: { start: null, end: null }
        }));
        break;
      case 'withAppointments':
        setFilterState(prev => ({ 
          ...prev, 
          filterType: 'hasAppointment'
        }));
        break;
      case 'clear':
        setFilterState({
          searchTerm: '',
          filterType: 'all',
          sortType: 'lastActivity',
          sortOrder: 'desc',
          dateRange: { start: null, end: null }
        });
        setSearchSuggestions([]);
        break;
    }
  }, []);

  // Device-aware search input handlers
  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
    if (deviceType === 'desktop' && filterState.searchTerm) {
      generateSearchSuggestions();
    }
  }, [deviceType, filterState.searchTerm, generateSearchSuggestions]);

  const handleSearchBlur = useCallback(() => {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setIsSearchFocused(false);
      if (deviceType === 'mobile') {
        setSearchSuggestions([]); // Clear immediately on mobile
      }
    }, deviceType === 'desktop' ? 200 : 100);
  }, [deviceType]);

  const selectSuggestion = useCallback((suggestion: string) => {
    setSearchTerm(suggestion);
    setSearchSuggestions([]);
    setIsSearchFocused(false);
    addToSearchHistory(suggestion);
  }, [setSearchTerm, addToSearchHistory]);

  // Device-aware filter statistics
  const getFilterStats = useCallback(() => {
    const stats = {
      total: conversations.length,
      filtered: sortedConversations.length,
      hasAppointment: conversations.filter(c => c.hasAppointment).length,
      today: conversations.filter(c => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const convDate = new Date(c.lastActivity);
        return convDate >= today && convDate < tomorrow;
      }).length,
      recent: conversations.filter(c => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(c.lastActivity) >= sevenDaysAgo;
      }).length
    };

    // Device-specific stat formatting
    if (deviceType === 'mobile') {
      return {
        ...stats,
        displayText: `${stats.filtered}/${stats.total}`
      };
    } else if (deviceType === 'tablet') {
      return {
        ...stats,
        displayText: `Showing ${stats.filtered} of ${stats.total} conversations`
      };
    } else {
      return {
        ...stats,
        displayText: `Displaying ${stats.filtered} of ${stats.total} conversations (${stats.hasAppointment} with appointments, ${stats.today} today, ${stats.recent} recent)`
      };
    }
  }, [conversations, sortedConversations, deviceType]);

  // Device-aware export functionality
  const exportFilteredData = useCallback((format: 'csv' | 'json' = 'csv') => {
    const data = sortedConversations.map(conv => ({
      sessionId: conv.sessionId,
      userName: conv.userName,
      messageCount: conv.messageCount,
      firstMessage: conv.firstMessage,
      lastActivity: conv.lastActivity,
      duration: conv.duration,
      hasAppointment: conv.hasAppointment ? 'Yes' : 'No'
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            `"${String(row[header as keyof typeof row]).replace(/"/g, '""')}"`
          ).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `conversations_${deviceType}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `conversations_${deviceType}_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [sortedConversations, deviceType]);

  // Device-aware keyboard shortcuts for desktop
  const handleKeyboardShortcuts = useCallback((event: KeyboardEvent) => {
    if (deviceType !== 'desktop') return;

    // Only handle shortcuts when not typing in input fields
    const activeElement = document.activeElement as HTMLElement | null;
    const isInputActive = activeElement?.tagName === 'INPUT' || 
                         activeElement?.tagName === 'TEXTAREA' ||
                         (activeElement?.contentEditable === 'true');

    if (isInputActive) return;

    switch (event.key) {
      case 'f':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          // Focus search input (implementation would depend on component structure)
          console.log('Desktop: Focus search shortcut triggered');
        }
        break;
      case 'c':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          applyQuickFilter('clear');
        }
        break;
      case 't':
        if (event.altKey) {
          event.preventDefault();
          applyQuickFilter('today');
        }
        break;
      case 'r':
        if (event.altKey) {
          event.preventDefault();
          applyQuickFilter('recent');
        }
        break;
      case 'a':
        if (event.altKey) {
          event.preventDefault();
          applyQuickFilter('withAppointments');
        }
        break;
    }
  }, [deviceType, applyQuickFilter]);

  // Register keyboard shortcuts on desktop
  useEffect(() => {
    // Only register keyboard shortcuts when in admin panel
    const isAdminPage = window.location.pathname.startsWith('/admin');
    
    if (deviceType === 'desktop' && isAdminPage) {
      document.addEventListener('keydown', handleKeyboardShortcuts);
      return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
    }
  }, [deviceType, handleKeyboardShortcuts]);

  // Device-aware filter persistence
  const saveFilterPreferences = useCallback(() => {
    const preferences = {
      filterType: filterState.filterType,
      sortType: filterState.sortType,
      sortOrder: filterState.sortOrder,
      deviceType: deviceType
    };

    try {
      localStorage.setItem(
        `chatLogs-filterPrefs-${deviceType}`, 
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.log('Could not save filter preferences:', error);
    }
  }, [filterState.filterType, filterState.sortType, filterState.sortOrder, deviceType]);

  const loadFilterPreferences = useCallback(() => {
    try {
      const savedPrefs = localStorage.getItem(`chatLogs-filterPrefs-${deviceType}`);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        if (parsed.deviceType === deviceType) {
          setFilterState(prev => ({
            ...prev,
            filterType: parsed.filterType || 'all',
            sortType: parsed.sortType || 'lastActivity',
            sortOrder: parsed.sortOrder || 'desc'
          }));
        }
      }
    } catch (error) {
      console.log('Could not load filter preferences:', error);
    }
  }, [deviceType]);

  // Load preferences on mount and save when they change
  useEffect(() => {
    loadFilterPreferences();
  }, [loadFilterPreferences]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveFilterPreferences();
    }, 1000); // Debounce saving

    return () => clearTimeout(timer);
  }, [saveFilterPreferences]);

  // Device-aware advanced search features
  const performAdvancedSearch = useCallback((options: {
    userName?: string;
    messageContent?: string;
    sessionId?: string;
    dateFrom?: string;
    dateTo?: string;
    hasAppointment?: boolean;
    minMessageCount?: number;
    maxMessageCount?: number;
  }) => {
    let filtered = [...conversations];

    // Apply advanced search filters
    if (options.userName) {
      const userNameLower = options.userName.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.userName.toLowerCase().includes(userNameLower)
      );
    }

    if (options.messageContent) {
      const contentLower = options.messageContent.toLowerCase();
      filtered = filtered.filter(conv => {
        if (deviceType === 'mobile') {
          // Mobile: Search only first message for performance
          return conv.firstMessage.toLowerCase().includes(contentLower);
        } else {
          // Tablet/Desktop: Search all messages
          return conv.firstMessage.toLowerCase().includes(contentLower) ||
                 conv.messages?.some(msg => 
                   msg.content.toLowerCase().includes(contentLower)
                 ) || false;
        }
      });
    }

    if (options.sessionId) {
      const sessionIdLower = options.sessionId.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.sessionId.toLowerCase().includes(sessionIdLower)
      );
    }

    if (options.dateFrom) {
      const fromDate = new Date(options.dateFrom);
      filtered = filtered.filter(conv => 
        new Date(conv.lastActivity) >= fromDate
      );
    }

    if (options.dateTo) {
      const toDate = new Date(options.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(conv => 
        new Date(conv.lastActivity) <= toDate
      );
    }

    if (typeof options.hasAppointment === 'boolean') {
      filtered = filtered.filter(conv => 
        conv.hasAppointment === options.hasAppointment
      );
    }

    if (typeof options.minMessageCount === 'number') {
      filtered = filtered.filter(conv => 
        conv.messageCount >= options.minMessageCount!
      );
    }

    if (typeof options.maxMessageCount === 'number') {
      filtered = filtered.filter(conv => 
        conv.messageCount <= options.maxMessageCount!
      );
    }

    return filtered;
  }, [conversations, deviceType]);

  // Device-aware filter validation
  const validateFilters = useCallback(() => {
    const errors: string[] = [];

    if (filterState.dateRange.start && filterState.dateRange.end) {
      const startDate = new Date(filterState.dateRange.start);
      const endDate = new Date(filterState.dateRange.end);
      
      if (startDate > endDate) {
        errors.push('Start date must be before end date');
      }

      const now = new Date();
      if (startDate > now) {
        errors.push('Start date cannot be in the future');
      }
    }

    if (filterState.searchTerm.length > 200) {
      errors.push('Search term is too long');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }, [filterState.dateRange, filterState.searchTerm]);

  // Device-aware performance metrics
  const getPerformanceMetrics = useCallback(() => {
    const totalConversations = conversations.length;
    const filteredCount = sortedConversations.length;
    const filterRatio = totalConversations > 0 ? filteredCount / totalConversations : 0;
    
    // Device-specific performance thresholds
    const performanceThresholds = {
      mobile: { slow: 100, warning: 50 },
      tablet: { slow: 200, warning: 100 },
      desktop: { slow: 500, warning: 250 }
    };

    const threshold = performanceThresholds[deviceType];
    
    return {
      totalConversations,
      filteredCount,
      filterRatio,
      performanceStatus: totalConversations > threshold.slow ? 'slow' :
                        totalConversations > threshold.warning ? 'warning' : 'good',
      shouldVirtualize: totalConversations > threshold.warning,
      deviceOptimized: true
    };
  }, [conversations.length, sortedConversations.length, deviceType]);

  // Device-aware filter reset with confirmation
  const resetAllFilters = useCallback((skipConfirmation: boolean = false) => {
    const performReset = () => {
      setFilterState({
        searchTerm: '',
        filterType: 'all',
        sortType: 'lastActivity',
        sortOrder: 'desc',
        dateRange: { start: null, end: null }
      });
      setSearchSuggestions([]);
      setIsSearchFocused(false);
      
      // Clear saved preferences
      try {
        localStorage.removeItem(`chatLogs-filterPrefs-${deviceType}`);
      } catch (error) {
        console.log('Could not clear filter preferences:', error);
      }
    };

    if (skipConfirmation || deviceType === 'mobile') {
      // Mobile: No confirmation for simpler UX
      performReset();
    } else {
      // Tablet/Desktop: Show confirmation
      const hasActiveFilters = filterState.searchTerm || 
                              filterState.filterType !== 'all' ||
                              filterState.sortType !== 'lastActivity' ||
                              filterState.sortOrder !== 'desc' ||
                              filterState.dateRange.start ||
                              filterState.dateRange.end;

      if (hasActiveFilters) {
        if (confirm('Reset all filters and search criteria?')) {
          performReset();
        }
      } else {
        performReset();
      }
    }
  }, [filterState, deviceType]);

  // Device-aware accessibility helpers
  const getFilterAccessibilityProps = useCallback(() => {
    const stats = getFilterStats();
    
    return {
      'aria-label': `Conversation filters. ${stats.displayText}`,
      role: 'region',
      'aria-live': deviceType === 'desktop' ? 'polite' : 'off', // Reduce announcements on mobile
      'aria-atomic': 'true'
    };
  }, [getFilterStats, deviceType]);

  const getSearchAccessibilityProps = useCallback(() => {
    return {
      'aria-label': 'Search conversations',
      'aria-describedby': 'search-help-text',
      'aria-expanded': isSearchFocused && searchSuggestions.length > 0,
      'aria-autocomplete': deviceType === 'desktop' ? 'list' : 'none',
      role: 'searchbox'
    };
  }, [isSearchFocused, searchSuggestions.length, deviceType]);

  // Return all filtering functionality with device information
  return {
    // Core state
    searchTerm: filterState.searchTerm,
    filteredConversations: sortedConversations,
    filterType: filterState.filterType,
    sortType: filterState.sortType,
    sortOrder: filterState.sortOrder,
    dateRange: filterState.dateRange,
    
    // Search state
    searchHistory,
    isSearchFocused,
    searchSuggestions,
    
    // Device information
    deviceType,
    isTouchDevice,
    
    // Core actions
    setSearchTerm,
    clearSearch,
    setFilterType,
    setSortType,
    setSortOrder,
    setDateRange,
    
    // Quick actions
    applyQuickFilter,
    resetAllFilters,
    
    // Search handlers
    handleSearchFocus,
    handleSearchBlur,
    selectSuggestion,
    
    // Advanced features
    performAdvancedSearch,
    exportFilteredData,
    
    // Utility functions
    getFilterStats,
    validateFilters,
    getPerformanceMetrics,
    
    // Accessibility helpers
    getFilterAccessibilityProps,
    getSearchAccessibilityProps,
    
    // Persistence
    saveFilterPreferences,
    loadFilterPreferences
  };
};