// Enhanced Chat Logs Controls Component
// src/app/admin/components/ChatLogsTab/components/EnhancedChatControls.tsx

import React from 'react';
import { Search, Filter, Grid, List, Table, ChevronDown, X } from 'lucide-react';
import { ViewMode, FilterOption, SortOption } from '../hooks/useEnhancedChatLogs';

interface EnhancedChatControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: FilterOption;
  setFilter: (filter: FilterOption) => void;
  sort: SortOption;
  setSort: (sort: SortOption) => void;
  totalItems: number;
  filteredCount: number;
  onClearFilters: () => void;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export const EnhancedChatControls: React.FC<EnhancedChatControlsProps> = ({
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  sort,
  setSort,
  totalItems,
  filteredCount,
  onClearFilters,
  deviceType
}) => {
  const hasActiveFilters = searchTerm.trim() !== '' || filter !== 'all' || sort !== 'newest';

  if (deviceType === 'mobile') {
    return (
      <div className="space-y-3 mb-4">
        {/* Mobile Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-slate-600/80 border border-slate-500/60 rounded-lg focus:border-blue-400 focus:outline-none text-sm text-gray-100 placeholder-gray-400"
          />
        </div>

        {/* Mobile View Toggle */}
        <div className="flex justify-between items-center">
          <div className="flex bg-slate-700/60 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-sm text-gray-300">
            {filteredCount} of {totalItems}
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterOption)}
            className="bg-slate-600/80 border border-slate-500/60 rounded px-3 py-1 text-sm text-gray-100 min-w-0 flex-shrink-0"
          >
            <option value="all">All</option>
            <option value="appointments">Has Appointments</option>
            <option value="no-appointments">No Appointments</option>
            <option value="recent">Recent (24h)</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-slate-600/80 border border-slate-500/60 rounded px-3 py-1 text-sm text-gray-100 min-w-0 flex-shrink-0"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most-messages">Most Messages</option>
            <option value="alphabetical">A-Z</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="bg-red-600/20 border border-red-500/60 rounded px-3 py-1 text-sm text-red-300 hover:bg-red-600/30 flex items-center gap-1 flex-shrink-0"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>
    );
  }

  // Tablet and Desktop
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Top Row: Search and View Toggle */}
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-slate-600/80 border border-slate-500/60 rounded-lg focus:border-blue-400 focus:outline-none text-sm text-gray-100 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">
            Showing {filteredCount} of {totalItems} conversations
          </div>
          
          <div className="flex bg-slate-700/60 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">Filters:</span>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
          className="bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-blue-400 focus:outline-none"
        >
          <option value="all">All Conversations</option>
          <option value="appointments">Has Appointments</option>
          <option value="no-appointments">No Appointments</option>
          <option value="recent">Recent (24 hours)</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 text-sm text-gray-100 focus:border-blue-400 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="most-messages">Most Messages</option>
          <option value="alphabetical">Alphabetical</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="bg-red-600/20 border border-red-500/60 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-600/30 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};