// src/app/admin/components/ConfirmationModal.tsx - Chunk 1: Mobile Component & Base Structure

'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-600 text-white hover:bg-red-700',
  onConfirm,
  onCancel
}: ConfirmationModalProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  if (!isOpen) return null;

  // Mobile: Full-screen confirmation with large action buttons
  const MobileConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        {/* Mobile Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed text-center text-base">{message}</p>
        </div>

        {/* Mobile Actions - Vertical Stack */}
        <div className="px-6 py-4 border-t border-gray-200 space-y-3">
          <button
            onClick={onConfirm}
            className={`w-full rounded-lg font-semibold transition-colors text-lg active:scale-95 ${confirmButtonClass}`}
            style={{ height: touchTargetSize }}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg"
            style={{ height: touchTargetSize }}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );

  // src/app/admin/components/ConfirmationModal.tsx - Chunk 2: Tablet Component

  // Tablet: Medium modal with clear actions
  const TabletConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Tablet Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              style={{ 
                width: '48px', 
                height: '48px',
                minWidth: '48px',
                minHeight: '48px'
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tablet Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed text-base">{message}</p>
        </div>

        {/* Tablet Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            style={{ minHeight: '48px' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${confirmButtonClass}`}
            style={{ minHeight: '48px' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  // src/app/admin/components/ConfirmationModal.tsx - Chunk 3: Desktop Component & Complete Export

  // Desktop: Compact modal (original design)
  const DesktopConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileConfirmationModal />}
      tablet={<TabletConfirmationModal />}
      desktop={<DesktopConfirmationModal />}
    />
  );
};