// src/app/admin/components/EditAppointmentModal.tsx - Chunk 1: Mobile Component & Base Structure

'use client';

import { Edit, X } from 'lucide-react';
import { Appointment, EditAppointmentForm } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFormFieldHeight } from '@/utils/deviceUtils';
import { useState } from 'react';

interface EditAppointmentModalProps {
  editingAppointment: Appointment | null;
  editForm: EditAppointmentForm;
  isLoading: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (field: keyof EditAppointmentForm, value: string) => void;
}

export const EditAppointmentModal = ({ 
  editingAppointment, 
  editForm, 
  isLoading, 
  onClose, 
  onSave, 
  onFormChange 
}: EditAppointmentModalProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);
  const fieldHeight = getFormFieldHeight(deviceType);

  // Mobile wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  if (!editingAppointment) return null;

  // Mobile: Multi-step form wizard with progress indicator
  const MobileEditAppointmentModal = () => {
    const nextStep = () => {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    };

    const prevStep = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };

    const canProceedStep1 = editForm.firstName && editForm.lastName && editForm.email;
    const canProceedStep2 = editForm.date && editForm.time;

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Mobile Header with Progress */}
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={currentStep === 1 ? onClose : prevStep}
              className="text-blue-100 hover:text-white transition-colors"
              style={{ 
                width: touchTargetSize, 
                height: touchTargetSize,
                minWidth: touchTargetSize,
                minHeight: touchTargetSize
              }}
            >
              <X className="w-6 h-6 mx-auto" />
            </button>
            <h2 className="text-xl font-semibold">Edit Appointment</h2>
            <div style={{ width: touchTargetSize }} /> {/* Spacer */}
          </div>

          {/* Mobile Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step === currentStep ? 'bg-white' : 
                  step < currentStep ? 'bg-blue-300' : 'bg-blue-800'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-blue-100 text-sm">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Mobile Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h3>
                <p className="text-gray-600">Update the client&apos;s contact details</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => onFormChange('firstName', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-blue-500 text-lg"
                    style={{ height: fieldHeight }}
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => onFormChange('lastName', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-blue-500 text-lg"
                    style={{ height: fieldHeight }}
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => onFormChange('email', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-blue-500 text-lg"
                    style={{ height: fieldHeight }}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => onFormChange('phone', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-blue-500 text-lg"
                    style={{ height: fieldHeight }}
                    maxLength={14}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => onFormChange('company', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-blue-500 text-lg"
                    style={{ height: fieldHeight }}
                    placeholder="Enter company name"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Appointment Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Appointment Details</h3>
                <p className="text-gray-600">Update the appointment scheduling information</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Primary Interest</label>
                  <select 
                    value={editForm.interest}
                    onChange={(e) => onFormChange('interest', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-blue-500 text-lg"
                    style={{ height: fieldHeight }}
                  >
                    <option value="general">General Consultation</option>
                    <option value="operations">Operations Consulting</option>
                    <option value="cybersecurity">Cybersecurity Solutions</option>
                    <option value="digital-transformation">Digital Transformation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => onFormChange('date', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-blue-500 text-lg"
                    style={{ height: fieldHeight }}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="text"
                    value={editForm.time}
                    onChange={(e) => onFormChange('time', e.target.value)}
                    placeholder="e.g., 2:00 PM"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-blue-500 text-lg"
                    style={{ height: fieldHeight }}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    value={editForm.status}
                    onChange={(e) => onFormChange('status', e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 text-gray-900 focus:outline-none focus:border-blue-500 text-lg"
                    style={{ height: fieldHeight }}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Edit className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Review Changes</h3>
                <p className="text-gray-600">Please review all changes before saving</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Contact Information</h4>
                  <p className="text-gray-600">{editForm.firstName} {editForm.lastName}</p>
                  <p className="text-gray-600">{editForm.email}</p>
                  {editForm.phone && <p className="text-gray-600">{editForm.phone}</p>}
                  {editForm.company && <p className="text-gray-600">{editForm.company}</p>}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Appointment Details</h4>
                  <p className="text-gray-600">Interest: {editForm.interest}</p>
                  <p className="text-gray-600">Date: {editForm.date}</p>
                  <p className="text-gray-600">Time: {editForm.time}</p>
                  <p className="text-gray-600">Status: {editForm.status}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Footer Navigation */}
        <div className="p-6 border-t border-gray-200 bg-white">
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !canProceedStep1) ||
                (currentStep === 2 && !canProceedStep2)
              }
              className={`w-full py-4 px-4 rounded-lg font-semibold transition-colors text-lg ${
                ((currentStep === 1 && canProceedStep1) || (currentStep === 2 && canProceedStep2))
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
              style={{ minHeight: touchTargetSize }}
            >
              Continue
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={onSave}
                disabled={isLoading}
                className={`w-full py-4 px-4 rounded-lg font-semibold transition-colors text-lg ${
                  isLoading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                style={{ minHeight: touchTargetSize }}
              >
                {isLoading ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button
                onClick={onClose}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg"
                style={{ minHeight: touchTargetSize }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // src/app/admin/components/EditAppointmentModal.tsx - Chunk 2: Tablet Component

  // Tablet: Single form with optimized field layout
  const TabletEditAppointmentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Tablet Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Edit className="w-7 h-7" />
              <h2 className="text-2xl font-semibold">Edit Appointment</h2>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors"
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
        </div>

        {/* Tablet Form Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Tablet Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => onFormChange('firstName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => onFormChange('lastName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => onFormChange('email', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => onFormChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500"
                      maxLength={14}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => onFormChange('company', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tablet Appointment Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Interest</label>
                  <select 
                    value={editForm.interest}
                    onChange={(e) => onFormChange('interest', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500"
                  >
                    <option value="general">General Consultation</option>
                    <option value="operations">Operations Consulting</option>
                    <option value="cybersecurity">Cybersecurity Solutions</option>
                    <option value="digital-transformation">Digital Transformation</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => onFormChange('date', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="text"
                      value={editForm.time}
                      onChange={(e) => onFormChange('time', e.target.value)}
                      placeholder="e.g., 2:00 PM"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select 
                    value={editForm.status}
                    onChange={(e) => onFormChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-500"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors text-base"
              style={{ minHeight: '48px' }}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isLoading}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors text-base ${
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              style={{ minHeight: '48px' }}
            >
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // src/app/admin/components/EditAppointmentModal.tsx - Chunk 3: Desktop Component & Complete Export

  // Desktop: Full form with all fields visible (original design)
  const DesktopEditAppointmentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Edit className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Edit Appointment</h2>
            </div>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => onFormChange('firstName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => onFormChange('lastName', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => onFormChange('email', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => onFormChange('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                maxLength={14}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={editForm.company}
                onChange={(e) => onFormChange('company', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Interest</label>
              <select 
                value={editForm.interest}
                onChange={(e) => onFormChange('interest', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="general">General Consultation</option>
                <option value="operations">Operations Consulting</option>
                <option value="cybersecurity">Cybersecurity Solutions</option>
                <option value="digital-transformation">Digital Transformation</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => onFormChange('date', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="text"
                  value={editForm.time}
                  onChange={(e) => onFormChange('time', e.target.value)}
                  placeholder="e.g., 2:00 PM"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                value={editForm.status}
                onChange={(e) => onFormChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileEditAppointmentModal />}
      tablet={<TabletEditAppointmentModal />}
      desktop={<DesktopEditAppointmentModal />}
    />
  );
};