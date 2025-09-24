// src/app/admin/components/BlackoutDateModal.tsx - Chunk 1: Mobile Component & Base Structure

'use client';

import { Calendar, X } from 'lucide-react';
import { useState } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFormFieldHeight } from '@/utils/deviceUtils';

interface BlackoutDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (date: string, reason: string) => void;
}

export const BlackoutDateModal = ({ isOpen, onClose, onAdd }: BlackoutDateModalProps) => {
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);
  const fieldHeight = getFormFieldHeight(deviceType);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && reason) {
      onAdd(date, reason);
      setDate('');
      setReason('');
      onClose();
    }
  };

  const handleClose = () => {
    setDate('');
    setReason('');
    onClose();
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  // Mobile: Simplified form with large date picker
  const MobileBlackoutDateModal = () => (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleClose}
            className="text-red-100 hover:text-white transition-colors"
            style={{ 
              width: touchTargetSize, 
              height: touchTargetSize,
              minWidth: touchTargetSize,
              minHeight: touchTargetSize
            }}
          >
            <X className="w-6 h-6 mx-auto" />
          </button>
          <h2 className="text-xl font-semibold">Add Blackout Date</h2>
          <div style={{ width: touchTargetSize }} /> {/* Spacer */}
        </div>
        <p className="text-red-100 mt-2 text-center text-sm">Block a specific date from appointment scheduling</p>
      </div>

      {/* Mobile Form Content */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 h-full flex flex-col">
          <div className="flex-1 space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Select Date to Block</h3>
              <p className="text-gray-600">Choose the date you want to make unavailable for appointments</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={today}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 text-lg"
                  style={{ height: fieldHeight }}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Select the date you want to block from scheduling
                </p>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Reason for Blackout
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 text-lg"
                  style={{ height: fieldHeight }}
                  required
                >
                  <option value="">Select a reason...</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Personal Time Off">Personal Time Off</option>
                  <option value="Company Event">Company Event</option>
                  <option value="Office Closure">Office Closure</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Conference/Training">Conference/Training</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Other">Other</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">
                  Choose the reason why this date should be unavailable
                </p>
              </div>

              {reason === 'Other' && (
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">
                    Custom Reason
                  </label>
                  <input
                    type="text"
                    placeholder="Enter custom reason..."
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 text-lg"
                    style={{ height: fieldHeight }}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={!date || !reason}
              className={`w-full py-4 px-4 rounded-lg font-semibold transition-colors text-lg ${
                date && reason
                  ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
              style={{ minHeight: touchTargetSize }}
            >
              Add Blackout Date
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="w-full border-2 border-gray-300 text-gray-700 py-4 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg"
              style={{ minHeight: touchTargetSize }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // src/app/admin/components/BlackoutDateModal.tsx - Chunk 2: Tablet Component

  // Tablet: Medium modal with touch-friendly controls
  const TabletBlackoutDateModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Tablet Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-7 h-7" />
              <h2 className="text-xl font-semibold">Add Blackout Date</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-red-100 hover:text-white transition-colors"
              style={{ 
                width: '48px', 
                height: '48px',
                minWidth: '48px',
                minHeight: '48px'
              }}
            >
              <X className="w-6 h-6 mx-auto" />
            </button>
          </div>
          <p className="text-red-100 mt-2">Block a specific date from appointment scheduling</p>
        </div>

        {/* Tablet Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Select the date you want to block from scheduling
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Reason for Blackout
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
                required
              >
                <option value="">Select a reason...</option>
                <option value="Holiday">Holiday</option>
                <option value="Personal Time Off">Personal Time Off</option>
                <option value="Company Event">Company Event</option>
                <option value="Office Closure">Office Closure</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Conference/Training">Conference/Training</option>
                <option value="Emergency">Emergency</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Choose the reason why this date should be unavailable
              </p>
            </div>

            {reason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Custom Reason
                </label>
                <input
                  type="text"
                  placeholder="Enter custom reason..."
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50"
                  required
                />
              </div>
            )}
          </div>

          {/* Tablet Actions */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              style={{ minHeight: '48px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!date || !reason}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                date && reason
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
              style={{ minHeight: '48px' }}
            >
              Add Blackout Date
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // src/app/admin/components/BlackoutDateModal.tsx - Chunk 3: Desktop Component & Complete Export

  // Desktop: Compact modal with standard controls (original design)
  const DesktopBlackoutDateModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Original responsive modal container */}
      <div className="bg-white w-full h-full md:w-auto md:h-auto md:rounded-xl md:shadow-2xl md:max-w-md md:mx-4">
        {/* Modal Header */}
        <div className="bg-red-600 text-white p-6 md:rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Add Blackout Date</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-red-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-red-100 mt-2">Block a specific date from appointment scheduling</p>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Select the date you want to block from scheduling
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Blackout
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                required
              >
                <option value="">Select a reason...</option>
                <option value="Holiday">Holiday</option>
                <option value="Personal Time Off">Personal Time Off</option>
                <option value="Company Event">Company Event</option>
                <option value="Office Closure">Office Closure</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Conference/Training">Conference/Training</option>
                <option value="Emergency">Emergency</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choose the reason why this date should be unavailable
              </p>
            </div>

            {reason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Reason
                </label>
                <input
                  type="text"
                  placeholder="Enter custom reason..."
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  required
                />
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!date || !reason}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                date && reason
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              Add Blackout Date
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileBlackoutDateModal />}
      tablet={<TabletBlackoutDateModal />}
      desktop={<DesktopBlackoutDateModal />}
    />
  );
};