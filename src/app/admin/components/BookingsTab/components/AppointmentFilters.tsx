// src/app/admin/components/BookingsTab/components/AppointmentFilters.tsx

'use client';

import { Search, Filter, X } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFormFieldHeight } from '@/utils/deviceUtils';
import { useState } from 'react';

interface AppointmentFiltersProps {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
  startIndex: number;
  endIndex: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
}

export const AppointmentFilters = ({
  searchTerm,
  statusFilter,
  dateFilter,
  startIndex,
  endIndex,
  totalCount,
  onSearchChange,
  onFilterChange
}: AppointmentFiltersProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);
  const fieldHeight = getFormFieldHeight(deviceType);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilters = statusFilter !== 'all' || dateFilter !== 'all';

  // Mobile: Bottom sheet filter with touch-friendly controls
  const MobileAppointmentFilters = () => (
    <div className="space-y-4">
      {/* Mobile Search Bar - Full Width */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-10 pr-4 bg-slate-600/80 border border-slate-500/60 rounded-lg focus:border-blue-400 focus:outline-none text-base text-gray-100 placeholder-gray-400"
          style={{ height: fieldHeight }}
        />
      </div>

      {/* Mobile Filter Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 bg-slate-600/80 border border-slate-500/60 rounded-lg px-4 text-base text-gray-100"
          style={{ height: fieldHeight }}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {(statusFilter !== 'all' ? 1 : 0) + (dateFilter !== 'all' ? 1 : 0)}
            </span>
          )}
        </button>

        <div className="text-sm text-gray-300">
          <span className="font-medium">{startIndex + 1}-{Math.min(endIndex, totalCount)}</span>
          <span> / </span>
          <span className="font-medium">{totalCount}</span>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-slate-800 border-t border-slate-600 rounded-t-xl w-full p-4 space-y-4">
            {/* Mobile Filter Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
                style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => onFilterChange('date', e.target.value)}
                className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 focus:border-blue-400 focus:outline-none text-base text-gray-100"
                style={{ height: fieldHeight }}
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="this-week">This Week</option>
                <option value="past">Past</option>
              </select>
            </div>

            {/* Mobile Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 focus:border-blue-400 focus:outline-none text-base text-gray-100"
                style={{ height: fieldHeight }}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Mobile Filter Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  onFilterChange('status', 'all');
                  onFilterChange('date', 'all');
                }}
                className="flex-1 bg-slate-600/50 border border-slate-500/50 text-gray-200 rounded-lg font-medium"
                style={{ height: touchTargetSize }}
              >
                Clear All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 bg-blue-600 text-white rounded-lg font-medium"
                style={{ height: touchTargetSize }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Tablet: Horizontal filter bar
  const TabletAppointmentFilters = () => (
    <div className="space-y-4">
      {/* Tablet Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-10 pr-4 bg-slate-600/80 border border-slate-500/60 rounded-lg focus:border-blue-400 focus:outline-none text-sm text-gray-100 placeholder-gray-400"
          style={{ height: fieldHeight }}
        />
      </div>

      {/* Tablet Filter Row */}
      <div className="flex items-center gap-4">
        {/* Date Filter */}
        <div className="flex-1">
          <select
            value={dateFilter}
            onChange={(e) => onFilterChange('date', e.target.value)}
            className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 focus:border-blue-400 focus:outline-none text-sm text-gray-100"
            style={{ height: fieldHeight }}
          >
            <option value="all">All Dates</option>
            <option value="upcoming">Upcoming</option>
            <option value="this-week">This Week</option>
            <option value="past">Past</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex-1">
          <select
            value={statusFilter}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 focus:border-blue-400 focus:outline-none text-sm text-gray-100"
            style={{ height: fieldHeight }}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-300 whitespace-nowrap">
          <span>Showing </span>
          <span className="font-medium">{startIndex + 1}-{Math.min(endIndex, totalCount)}</span>
          <span> of </span>
          <span className="font-medium">{totalCount}</span>
        </div>
      </div>
    </div>
  );

  // Desktop: Full filter grid (original design)
  const DesktopAppointmentFilters = () => (
    <div className="space-y-4">
      {/* UPDATED: Responsive grid - stack on mobile, 2 cols on tablet, 4 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Input - Full width on mobile */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 bg-slate-600/80 border border-slate-500/60 rounded-lg focus:border-blue-400 focus:outline-none text-sm text-gray-100 placeholder-gray-400"
            />
          </div>
        </div>
        
        {/* Date Filter */}
        <div>
          <select
            value={dateFilter}
            onChange={(e) => onFilterChange('date', e.target.value)}
            className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 focus:border-blue-400 focus:outline-none text-sm text-gray-100"
          >
            <option value="all">All Dates</option>
            <option value="upcoming">Upcoming</option>
            <option value="this-week">This Week</option>
            <option value="past">Past</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full bg-slate-600/80 border border-slate-500/60 rounded-lg px-3 py-2 focus:border-blue-400 focus:outline-none text-sm text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Results Count - Full width on mobile, right aligned on larger screens */}
        <div className="sm:col-span-2 lg:col-span-1 flex items-center justify-center sm:justify-end lg:justify-center">
          <div className="text-sm text-gray-300 text-center lg:text-left">
            <span className="hidden sm:inline">Showing </span>
            <span className="font-medium">{startIndex + 1}-{Math.min(endIndex, totalCount)}</span>
            <span className="hidden sm:inline"> of </span>
            <span className="sm:hidden"> / </span>
            <span className="font-medium">{totalCount}</span>
            <span className="hidden lg:inline"> results</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Return the responsive wrapper with device-specific components
  return (
    <ResponsiveWrapper
      mobile={<MobileAppointmentFilters />}
      tablet={<TabletAppointmentFilters />}
      desktop={<DesktopAppointmentFilters />}
    />
  );
};