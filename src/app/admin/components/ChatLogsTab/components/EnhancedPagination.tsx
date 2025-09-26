// Enhanced Pagination Component - FIXED
// src/app/admin/components/ChatLogsTab/components/EnhancedPagination.tsx

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { ViewMode } from '../hooks/useEnhancedChatLogs';

interface EnhancedPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  viewMode: ViewMode;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

export const EnhancedPagination: React.FC<EnhancedPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  viewMode,
  deviceType
}) => {
  
  // Get appropriate page size options based on view mode
  const getPageSizeOptions = (): number[] => {
    switch (viewMode) {
      case 'grid':
        return [6, 9, 12, 15, 18];
      case 'list':
      case 'table':
        return [5, 10, 15, 20, 25];
      default:
        return [6, 9, 12, 15, 18];
    }
  };

  const pageSizeOptions = getPageSizeOptions();

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = deviceType === 'mobile' ? 3 : deviceType === 'tablet' ? 5 : 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const sidePages = Math.floor((maxVisiblePages - 3) / 2);
      
      pages.push(1);
      
      if (currentPage <= sidePages + 2) {
        for (let i = 2; i <= Math.min(maxVisiblePages - 1, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > maxVisiblePages) pages.push('...');
      } else if (currentPage >= totalPages - sidePages - 1) {
        pages.push('...');
        for (let i = Math.max(2, totalPages - maxVisiblePages + 2); i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = currentPage - sidePages; i <= currentPage + sidePages; i++) {
          pages.push(i);
        }
        pages.push('...');
      }
      
      if (totalPages > 1) pages.push(totalPages);
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Don't render pagination if there are no items
  if (totalItems === 0) return null;

  if (deviceType === 'mobile') {
    return (
      <div className="flex flex-col items-center gap-3 mt-6">
        <div className="text-xs text-gray-400">
          {startItem}-{endItem} of {totalItems}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded bg-slate-700/60 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm min-w-[2rem] text-center">
              {currentPage}
            </span>
            <span className="text-gray-400 text-sm">of {totalPages}</span>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded bg-slate-700/60 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/60 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-gray-400">
        Showing {startItem}-{endItem} of {totalItems} conversations
      </div>
      
      <div className="flex items-center gap-2">
        {/* Show dropdown for tablet and desktop, and always show it if there are items */}
        {(deviceType === 'tablet' || deviceType === 'desktop') && onPageSizeChange && totalItems > 0 && (
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm text-gray-400">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const newPageSize = parseInt(e.target.value);
                console.log('Dropdown changed to:', newPageSize);
                console.log('Current pageSize prop:', pageSize);
                if (onPageSizeChange) {
                  console.log('Calling onPageSizeChange with:', newPageSize);
                  onPageSizeChange(newPageSize);
                }
              }}
              className="bg-slate-600/80 border border-slate-500/60 rounded px-2 py-1 text-sm text-gray-100"
            >
              {pageSizeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {totalPages > 1 && (
          <>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded bg-slate-700/60 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex gap-1">
              {generatePageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-2 py-1 text-gray-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page as number)}
                      className={`px-3 py-1 text-sm border rounded transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-600/50 text-gray-300 border-slate-500/60 hover:bg-slate-500/60'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded bg-slate-700/60 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600/60 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};