// src/app/admin/components/NotificationModal.tsx - Chunk 1: Mobile Component & Base Structure

'use client';

import { Notification } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
}

export const NotificationModal = ({ notification, onClose }: NotificationModalProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  if (!notification) return null;

  // Mobile: Full-width notification with large dismiss button
  const MobileNotificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        {/* Mobile Content */}
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {notification.type === 'success' ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          
          <h3 className={`text-xl font-semibold mb-4 ${
            notification.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {notification.type === 'success' ? 'Success!' : 'Error'}
          </h3>
          
          <p className="text-gray-600 mb-8 text-base leading-relaxed">{notification.message}</p>
        </div>

        {/* Mobile Action Button */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className={`w-full rounded-lg font-semibold transition-colors text-lg ${
              notification.type === 'success'
                ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
            }`}
            style={{ height: touchTargetSize }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  // src/app/admin/components/NotificationModal.tsx - Chunk 2: Tablet Component

  // Tablet: Medium-sized notification
  const TabletNotificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {notification.type === 'success' ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <h3 className={`text-xl font-semibold ${
              notification.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {notification.type === 'success' ? 'Success!' : 'Error'}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-8 text-base leading-relaxed">{notification.message}</p>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-lg font-medium transition-colors text-base ${
                notification.type === 'success'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
              style={{ minHeight: '48px' }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // src/app/admin/components/NotificationModal.tsx - Chunk 3: Desktop Component & Complete Export

  // Desktop: Compact notification (original design)
  const DesktopNotificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
          }`}>
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <h3 className={`text-lg font-semibold ${
            notification.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {notification.type === 'success' ? 'Success!' : 'Error'}
          </h3>
        </div>
        <p className="text-gray-600 mb-6">{notification.message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              notification.type === 'success'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileNotificationModal />}
      tablet={<TabletNotificationModal />}
      desktop={<DesktopNotificationModal />}
    />
  );
};