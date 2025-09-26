// Enhanced Chat Logs Controls Component - COMPLETE REWRITE
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

  // Mobile layout - unchanged, keeping the working version
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

  // Desktop and Tablet - COMPLETELY REWRITTEN with proper distribution
  return (
    <div className="w-full mb-6">
      <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/40">
        <div className="flex items-center justify-between w-full">
          
          {/* LEFT SECTION: Search and Filters */}
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-80 pl-10 pr-4 py-2.5 bg-slate-600/80 border border-slate-500/60 rounded-lg focus:border-blue-400 focus:outline-none text-sm text-gray-100 placeholder-gray-400 transition-colors"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center space-x-3">
              <label className="text-sm text-gray-400 font-medium">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterOption)}
                className="bg-slate-600/80 border border-slate-500/60 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:border-blue-400 focus:outline-none min-w-[160px] transition-colors"
              >
                <option value="all">All Conversations</option>
                <option value="appointments">Has Appointments</option>
                <option value="no-appointments">No Appointments</option>
                <option value="recent">Recent (24 hours)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-3">
              <label className="text-sm text-gray-400 font-medium">Sort:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-slate-600/80 border border-slate-500/60 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:border-blue-400 focus:outline-none min-w-[140px] transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-messages">Most Messages</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* RIGHT SECTION: Count and View Controls */}
          <div className="flex items-center space-x-6">
            {/* Conversation Count */}
            <div className="text-sm text-gray-300 font-medium bg-slate-600/30 px-4 py-2 rounded-lg border border-slate-600/40">
              Showing <span className="text-white font-semibold">{filteredCount}</span> of <span className="text-white font-semibold">{totalItems}</span> conversations
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-slate-600/50 rounded-lg p-1 border border-slate-600/40">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-500/50'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-500/50'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-500/50'
                }`}
                title="Table View"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Clear Filters Button (if active) */}
        {hasActiveFilters && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={onClearFilters}
              className="bg-red-600/20 border border-red-500/60 rounded-lg px-4 py-2 text-sm text-red-300 hover:bg-red-600/30 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};