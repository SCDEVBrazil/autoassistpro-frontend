// src/app/admin/components/ChatLogsTab/components/DeleteConfirmationModal.tsx

'use client';

import { Trash2 } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel
}: DeleteConfirmationModalProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  if (!isOpen) return null;

  // Mobile: Full-screen confirmation with large buttons
  const MobileDeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Mobile Header - Full width */}
      <div className="bg-red-600 text-white p-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Delete Conversation</h1>
        </div>
      </div>

      {/* Mobile Content - Flexible middle area */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Trash2 className="w-10 h-10 text-red-600" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Are you sure you want to delete this conversation?
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg px-4">
              This action cannot be undone and will permanently remove all messages in this chat session.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Actions - Fixed bottom area with large buttons */}
      <div className="p-6 space-y-4 flex-shrink-0">
        <button
          onClick={onConfirm}
          className="w-full bg-red-600 text-white rounded-xl font-semibold text-lg transition-colors hover:bg-red-700 active:bg-red-800"
          style={{ minHeight: touchTargetSize, height: '56px' }}
        >
          Delete Conversation
        </button>
        <button
          onClick={onCancel}
          className="w-full border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg transition-colors hover:bg-gray-50 active:bg-gray-100"
          style={{ minHeight: touchTargetSize, height: '56px' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  // Tablet: Medium modal
  const TabletDeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Tablet Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Delete Conversation</h2>
          </div>
        </div>

        {/* Tablet Modal Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed text-base">
            Are you sure you want to delete this conversation? This action cannot be undone and will permanently remove all messages in this chat session.
          </p>
        </div>

        {/* Tablet Modal Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-base"
            style={{ minHeight: '48px' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-base"
            style={{ minHeight: '48px' }}
          >
            Delete Conversation
          </button>
        </div>
      </div>
    </div>
  );

  // Desktop: Small centered modal
  const DesktopDeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        {/* Desktop Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Delete Conversation</h2>
            </div>
          </div>
        </div>

        {/* Desktop Modal Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">
            Are you sure you want to delete this conversation? This action cannot be undone and will permanently remove all messages in this chat session.
          </p>
        </div>

        {/* Desktop Modal Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Delete Conversation
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileDeleteConfirmationModal />}
      tablet={<TabletDeleteConfirmationModal />}
      desktop={<DesktopDeleteConfirmationModal />}
    />
  );
};