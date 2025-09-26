// Filter and Pagination Preference Management
// src/app/admin/components/BookingsTab/hooks/useAppointmentFiltering/utils/preferenceUtils.ts

export interface FilterPreferences {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
  pageSize: number;
  sortOption?: string;
  viewMode?: string;
}

export interface PreferenceMetadata {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  savedAt: string;
  version: string;
  sessionCount: number;
}

export interface StoredPreferences {
  preferences: FilterPreferences;
  metadata: PreferenceMetadata;
}

export interface UseFilterPreferencesReturn {
  savePreferences: (preferences: FilterPreferences) => void;
  loadPreferences: () => FilterPreferences | null;
  resetPreferences: () => void;
  getPreferenceHistory: () => StoredPreferences[];
  syncPreferencesAcrossDevices: () => Promise<void>;
  exportPreferences: () => string;
  importPreferences: (data: string) => boolean;
  clearPreferenceHistory: () => void;
  getPreferenceStats: () => {
    totalSaves: number;
    lastUsed: string;
    favoritePageSize: number;
    mostUsedFilters: string[];
  };
}

export const useFilterPreferences = (deviceType: 'mobile' | 'tablet' | 'desktop'): UseFilterPreferencesReturn => {
  
  // Storage keys
  const STORAGE_KEYS = {
    CURRENT: `bookings_preferences_${deviceType}`,
    HISTORY: `bookings_preferences_history_${deviceType}`,
    STATS: `bookings_preferences_stats_${deviceType}`,
    SYNC: 'bookings_preferences_sync'
  };

  // Preference version for backward compatibility
  const PREFERENCE_VERSION = '1.0.0';

  // Default preferences based on device type
  const getDefaultPreferences = (): FilterPreferences => {
    const baseDefaults = {
      searchTerm: '',
      statusFilter: 'all',
      dateFilter: 'upcoming',
      sortOption: 'date-asc'
    };

    switch (deviceType) {
      case 'mobile':
        return {
          ...baseDefaults,
          pageSize: 5,
          viewMode: 'compact'
        };
      case 'tablet':
        return {
          ...baseDefaults,
          pageSize: 10,
          viewMode: 'standard'
        };
      case 'desktop':
        return {
          ...baseDefaults,
          pageSize: 15,
          viewMode: 'detailed'
        };
      default:
        return {
          ...baseDefaults,
          pageSize: 10
        };
    }
  };

  // Validate preferences data
  const validatePreferences = (preferences: any): preferences is FilterPreferences => {
    if (!preferences || typeof preferences !== 'object') {
      return false;
    }

    // Required fields
    const requiredFields = ['searchTerm', 'statusFilter', 'dateFilter', 'pageSize'];
    for (const field of requiredFields) {
      if (!(field in preferences)) {
        return false;
      }
    }

    // Validate specific values
    const validStatuses = ['all', 'confirmed', 'pending', 'cancelled', 'completed'];
    if (!validStatuses.includes(preferences.statusFilter)) {
      return false;
    }

    const validDateFilters = ['all', 'upcoming', 'past', 'today', 'this-week', 'this-month'];
    if (!validDateFilters.includes(preferences.dateFilter)) {
      return false;
    }

    const validPageSizes = [5, 10, 15, 20];
    if (!validPageSizes.includes(preferences.pageSize)) {
      return false;
    }

    return true;
  };

  // Save preferences to localStorage
  const savePreferences = (preferences: FilterPreferences): void => {
    try {
      const metadata: PreferenceMetadata = {
        deviceType,
        savedAt: new Date().toISOString(),
        version: PREFERENCE_VERSION,
        sessionCount: getSessionCount() + 1
      };

      const storedData: StoredPreferences = {
        preferences,
        metadata
      };

      // Save current preferences
      localStorage.setItem(STORAGE_KEYS.CURRENT, JSON.stringify(storedData));

      // Update preference history
      updatePreferenceHistory(storedData);

      // Update usage statistics
      updatePreferenceStats(preferences);

      console.log(`Preferences saved for ${deviceType}:`, preferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  // Load preferences from localStorage
  const loadPreferences = (): FilterPreferences | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT);
      if (!stored) {
        console.log(`No saved preferences found for ${deviceType}`);
        return null;
      }

      const parsedData: StoredPreferences = JSON.parse(stored);
      
      // Validate version compatibility
      if (parsedData.metadata.version !== PREFERENCE_VERSION) {
        console.warn(`Preference version mismatch. Expected ${PREFERENCE_VERSION}, got ${parsedData.metadata.version}`);
        // Could implement migration logic here
      }

      // Validate preferences data
      if (!validatePreferences(parsedData.preferences)) {
        console.warn('Invalid preference data found, using defaults');
        return null;
      }

      console.log(`Preferences loaded for ${deviceType}:`, parsedData.preferences);
      return parsedData.preferences;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return null;
    }
  };

  // Reset preferences to defaults
  const resetPreferences = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT);
      console.log(`Preferences reset for ${deviceType}`);
    } catch (error) {
      console.error('Failed to reset preferences:', error);
    }
  };

  // Update preference history
  const updatePreferenceHistory = (newData: StoredPreferences): void => {
    try {
      const historyKey = STORAGE_KEYS.HISTORY;
      const existing = localStorage.getItem(historyKey);
      const history: StoredPreferences[] = existing ? JSON.parse(existing) : [];

      // Add new entry
      history.unshift(newData);

      // Keep only last 10 entries to prevent storage bloat
      const maxHistory = deviceType === 'mobile' ? 5 : 10;
      if (history.length > maxHistory) {
        history.splice(maxHistory);
      }

      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to update preference history:', error);
    }
  };

  // Get preference history
  const getPreferenceHistory = (): StoredPreferences[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get preference history:', error);
      return [];
    }
  };

  // Update usage statistics
  const updatePreferenceStats = (preferences: FilterPreferences): void => {
    try {
      const statsKey = STORAGE_KEYS.STATS;
      const existing = localStorage.getItem(statsKey);
      const stats = existing ? JSON.parse(existing) : {
        totalSaves: 0,
        pageSizeUsage: {},
        filterUsage: {},
        lastUsed: null
      };

      // Update statistics
      stats.totalSaves++;
      stats.lastUsed = new Date().toISOString();

      // Track page size usage
      stats.pageSizeUsage[preferences.pageSize] = (stats.pageSizeUsage[preferences.pageSize] || 0) + 1;

      // Track filter usage
      if (preferences.statusFilter !== 'all') {
        stats.filterUsage[preferences.statusFilter] = (stats.filterUsage[preferences.statusFilter] || 0) + 1;
      }
      if (preferences.dateFilter !== 'all') {
        stats.filterUsage[preferences.dateFilter] = (stats.filterUsage[preferences.dateFilter] || 0) + 1;
      }

      localStorage.setItem(statsKey, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to update preference statistics:', error);
    }
  };

  // Get session count
  const getSessionCount = (): number => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT);
      if (stored) {
        const data: StoredPreferences = JSON.parse(stored);
        return data.metadata.sessionCount || 0;
      }
    } catch (error) {
      console.error('Failed to get session count:', error);
    }
    return 0;
  };

  // Get preference statistics
  const getPreferenceStats = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS);
      const stats = stored ? JSON.parse(stored) : {
        totalSaves: 0,
        pageSizeUsage: {},
        filterUsage: {},
        lastUsed: null
      };

    // Calculate favorite page size
    const pageSizes = Object.entries(stats.pageSizeUsage) as [string, number][];
    const favoritePageSize = pageSizes.length > 0 
    ? parseInt(pageSizes.reduce((a, b) => a[1] > b[1] ? a : b)[0])
    : getDefaultPreferences().pageSize;

      // Get most used filters
      const filterEntries = Object.entries(stats.filterUsage);
      const mostUsedFilters = filterEntries
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 3)
        .map(([filter]) => filter);

      return {
        totalSaves: stats.totalSaves,
        lastUsed: stats.lastUsed || 'Never',
        favoritePageSize,
        mostUsedFilters
      };
    } catch (error) {
      console.error('Failed to get preference statistics:', error);
      return {
        totalSaves: 0,
        lastUsed: 'Never',
        favoritePageSize: getDefaultPreferences().pageSize,
        mostUsedFilters: []
      };
    }
  };

  // Sync preferences across devices (placeholder for future cloud sync)
  const syncPreferencesAcrossDevices = async (): Promise<void> => {
    try {
      // This would implement cloud sync in a real application
      console.log('Cross-device sync not implemented yet');
      
      // For now, just log the sync attempt
      const preferences = loadPreferences();
      if (preferences) {
        localStorage.setItem(STORAGE_KEYS.SYNC, JSON.stringify({
          preferences,
          deviceType,
          syncedAt: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Failed to sync preferences:', error);
    }
  };

  // Export preferences as JSON string
  const exportPreferences = (): string => {
    try {
      const current = loadPreferences();
      const history = getPreferenceHistory();
      const stats = getPreferenceStats();

      const exportData = {
        version: PREFERENCE_VERSION,
        deviceType,
        exportedAt: new Date().toISOString(),
        currentPreferences: current,
        history,
        statistics: stats
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export preferences:', error);
      return '{}';
    }
  };

  // Import preferences from JSON string
  const importPreferences = (data: string): boolean => {
    try {
      const importData = JSON.parse(data);
      
      if (!importData.currentPreferences) {
        console.error('No current preferences found in import data');
        return false;
      }

      if (!validatePreferences(importData.currentPreferences)) {
        console.error('Invalid preferences in import data');
        return false;
      }

      // Save imported preferences
      savePreferences(importData.currentPreferences);
      
      console.log('Preferences imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  };

  // Clear preference history
  const clearPreferenceHistory = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.STATS);
      console.log(`Preference history cleared for ${deviceType}`);
    } catch (error) {
      console.error('Failed to clear preference history:', error);
    }
  };

  return {
    savePreferences,
    loadPreferences,
    resetPreferences,
    getPreferenceHistory,
    syncPreferencesAcrossDevices,
    exportPreferences,
    importPreferences,
    clearPreferenceHistory,
    getPreferenceStats
  };
};