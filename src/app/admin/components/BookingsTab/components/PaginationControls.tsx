// Enhanced Pagination Controls with Page Size Selection
// src/app/admin/components/BookingsTab/components/PaginationControls.tsx

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalItems: number;
  onGoToPage: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  totalItems,
  onGoToPage,
  onPageSizeChange
}: PaginationControlsProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  if (totalPages <= 1 && totalItems <= Math.min(...pageSizeOptions)) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Mobile: Compact layout with page size selector
  const MobilePaginationControls = () => (
    <div className="px-4 py-4 border-t border-slate-600/50 space-y-3">
      {/* Mobile Page Info */}
      <div className="text-center">
        <span className="text-xs text-gray-400">
          {startItem}-{endItem} of {totalItems}
        </span>
      </div>
      
      {/* Mobile Page Size Selector */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xs text-gray-400">Show:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-gray-200"
          style={{ minHeight: touchTargetSize }}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span className="text-xs text-gray-400">items</span>
      </div>

      {/* Mobile Navigation Buttons */}
      {totalPages > 1 && (
        <div className="flex gap-3">
          <button
            onClick={() => onGoToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-base bg-slate-600/50 border border-slate-500/50 rounded-lg hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
            style={{ minHeight: touchTargetSize }}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          
          <div className="flex items-center justify-center px-4 py-3 text-sm text-gray-300 min-w-[80px]">
            {currentPage} / {totalPages}
          </div>
          
          <button
            onClick={() => onGoToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-base bg-slate-600/50 border border-slate-500/50 rounded-lg hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
            style={{ minHeight: touchTargetSize }}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );

  // Tablet: Balanced layout with full controls
  const TabletPaginationControls = () => (
    <div className="flex items-center justify-between p-4 border-t border-slate-600/50">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-400">
          Showing {startItem}-{endItem} of {totalItems}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Items per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm text-gray-200"
            style={{ minHeight: touchTargetSize }}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onGoToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
            style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-sm text-gray-300 min-w-[100px] text-center">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => onGoToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
            style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  // Desktop: Full featured pagination with page numbers
  const DesktopPaginationControls = () => {
    const generatePageNumbers = (): (number | string)[] => {
      const pages: (number | string)[] = [];
      const maxVisible = 7;
      
      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const sidePages = Math.floor((maxVisible - 3) / 2);
        
        pages.push(1);
        
        if (currentPage <= sidePages + 2) {
          for (let i = 2; i <= Math.min(maxVisible - 1, totalPages - 1); i++) {
            pages.push(i);
          }
          if (totalPages > maxVisible) pages.push('...');
        } else if (currentPage >= totalPages - sidePages - 1) {
          pages.push('...');
          for (let i = Math.max(2, totalPages - maxVisible + 2); i <= totalPages - 1; i++) {
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

    const pageNumbers = generatePageNumbers();

    return (
      <div className="flex items-center justify-between p-4 border-t border-slate-600/50">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Showing {startItem}-{endItem} of {totalItems} appointments
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Items per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onGoToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pageNumbers.map((pageNum, index) => (
              <div key={index}>
                {pageNum === '...' ? (
                  <span className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <button
                    onClick={() => onGoToPage(pageNum as number)}
                    className={`px-3 py-2 text-sm rounded transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-600/50 text-gray-200 hover:bg-slate-600/70'
                    }`}
                  >
                    {pageNum}
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() => onGoToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <ResponsiveWrapper
      mobile={<MobilePaginationControls />}
      tablet={<TabletPaginationControls />}
      desktop={<DesktopPaginationControls />}
    />
  );
};