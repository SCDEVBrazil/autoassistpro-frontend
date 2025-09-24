// src/app/admin/components/BookingsTab/components/PaginationControls.tsx

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onGoToPage: (page: number) => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  onGoToPage
}: PaginationControlsProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  if (totalPages <= 1) return null;

  // Mobile: Large touch targets with minimal pagination
  const MobilePaginationControls = () => (
    <div className="px-4 py-4 border-t border-slate-600/50 space-y-3">
      {/* Mobile Page Info */}
      <div className="text-center">
        <span className="text-sm text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      
      {/* Mobile Navigation Buttons */}
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

      {/* Mobile Current Page Indicator */}
      {totalPages > 2 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <button
                onClick={() => onGoToPage(1)}
                className="w-10 h-10 flex items-center justify-center text-sm bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 text-gray-200"
                style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
              >
                1
              </button>
            )}
            
            <div className="w-10 h-10 flex items-center justify-center text-sm bg-blue-600 text-white border border-blue-600 rounded">
              {currentPage}
            </div>
            
            {currentPage < totalPages && (
              <button
                onClick={() => onGoToPage(totalPages)}
                className="w-10 h-10 flex items-center justify-center text-sm bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 text-gray-200"
                style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
              >
                {totalPages}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Tablet: Standard pagination controls
  const TabletPaginationControls = () => (
    <div className="px-6 py-4 border-t border-slate-600/50 flex items-center justify-between">
      <div className="text-sm text-gray-300">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onGoToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
          style={{ minHeight: touchTargetSize }}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        {/* Tablet Page Numbers - Simplified */}
        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 3) {
            pageNum = i + 1;
          } else if (currentPage <= 2) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 1) {
            pageNum = totalPages - 2 + i;
          } else {
            pageNum = currentPage - 1 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onGoToPage(pageNum)}
              className={`px-3 py-2 text-sm border rounded ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-600/50 border-slate-500/50 hover:bg-slate-600/70 text-gray-200'
              }`}
              style={{ minHeight: touchTargetSize }}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={() => onGoToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
          style={{ minHeight: touchTargetSize }}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Desktop: Full pagination with page numbers (original design)
  const DesktopPaginationControls = () => (
    <div className="px-6 py-4 border-t border-slate-600/50 flex items-center justify-between">
      <div className="text-sm text-gray-300">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onGoToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        
        {/* Page Numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }
          
          return (
            <button
              key={pageNum}
              onClick={() => onGoToPage(pageNum)}
              className={`px-3 py-1 text-sm border rounded ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-600/50 border-slate-500/50 hover:bg-slate-600/70 text-gray-200'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        
        <button
          onClick={() => onGoToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-slate-600/50 border border-slate-500/50 rounded hover:bg-slate-600/70 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // Return the responsive wrapper with device-specific components
  return (
    <ResponsiveWrapper
      mobile={<MobilePaginationControls />}
      tablet={<TabletPaginationControls />}
      desktop={<DesktopPaginationControls />}
    />
  );
};