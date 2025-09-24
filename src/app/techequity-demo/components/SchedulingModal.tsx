// src/app/techequity-demo/components/SchedulingModal.tsx - CHUNK 1

'use client';

import { Calendar, X, ChevronLeft, ChevronRight, User, Mail, Building2, Clock } from 'lucide-react';
import { FormData, AvailableSlots } from '../types';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFormFieldHeight, getModalSize } from '@/utils/deviceUtils';
import { useState } from 'react';

interface SchedulingModalProps {
  showSchedulingModal: boolean;
  formData: FormData;
  selectedDate: number;
  selectedTime: number;
  availableSlots: AvailableSlots;
  isLoadingSlots: boolean;
  isBooking: boolean;
  handleInputChange: (field: keyof FormData, value: string) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedDate: (index: number) => void;
  setSelectedTime: (index: number) => void;
  closeSchedulingModal: () => void;
  onBookingConfirmation: () => void;
}

// Define interface for component props
interface SchedulingComponentProps extends SchedulingModalProps {
  touchTargetSize: string;
  fieldHeight: string;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

// CRITICAL FIX: Move component definitions OUTSIDE the main component function
// This prevents React from creating new component instances on every render

// Mobile: Multi-step wizard with progress indicators
const MobileSchedulingModal = ({
  showSchedulingModal,
  formData,
  selectedDate,
  selectedTime,
  availableSlots,
  isLoadingSlots,
  isBooking,
  handleInputChange,
  handlePhoneChange,
  setSelectedDate,
  setSelectedTime,
  closeSchedulingModal,
  onBookingConfirmation,
  touchTargetSize,
  fieldHeight,
  currentStep,
  setCurrentStep
}: SchedulingComponentProps) => {
  const totalSteps = 3;

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

  const canProceedStep1 = formData.firstName && formData.lastName && formData.email;
  const canProceedStep2 = availableSlots.length > 0;

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
      {/* Mobile Header with Progress */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={currentStep === 1 ? closeSchedulingModal : prevStep}
            className="text-blue-100 hover:text-white transition-colors"
            style={{ 
              width: touchTargetSize, 
              height: touchTargetSize,
              minWidth: touchTargetSize,
              minHeight: touchTargetSize
            }}
          >
            {currentStep === 1 ? <X className="w-6 h-6 mx-auto" /> : <ChevronLeft className="w-6 h-6 mx-auto" />}
          </button>
          <h2 className="text-xl font-semibold">Schedule Call</h2>
          <div style={{ width: touchTargetSize }}></div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-colors ${
                index + 1 <= currentStep ? 'bg-white' : 'bg-blue-400'
              }`}
            />
          ))}
        </div>
        <p className="text-blue-100 text-sm mt-2">Step {currentStep} of {totalSteps}</p>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Information</h3>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:border-blue-500"
                    style={{ minHeight: fieldHeight }}
                    placeholder="John"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:border-blue-500"
                    style={{ minHeight: fieldHeight }}
                    placeholder="Smith"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:border-blue-500"
                  style={{ minHeight: fieldHeight }}
                  placeholder="john@company.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:border-blue-500"
                  style={{ minHeight: fieldHeight }}
                  placeholder="(555) 123-4567"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    console.log('onChange fired with:', e.target.value);
                    handleInputChange('company', e.target.value);
                  }}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const target = e.target as HTMLInputElement;
                    console.log('onInput fired with:', target.value);
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    console.log('onKeyDown:', e.key, 'Current value:', e.currentTarget.value);
                    if (e.key === ' ') {
                      console.log('SPACE KEY DETECTED in onKeyDown');
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:border-blue-500"
                  placeholder="Your Company"
                  autoComplete="organization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Interest</label>
                <select
                  value={formData.interest}
                  onChange={(e) => handleInputChange('interest', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:border-blue-500"
                  style={{ minHeight: fieldHeight }}
                >
                  <option value="">Select your main focus</option>
                  <option value="operations">Operations Consulting</option>
                  <option value="cybersecurity">Cybersecurity Solutions</option>
                  <option value="erp">ERP Implementation</option>
                  <option value="crm">CRM Setup</option>
                  <option value="general">General Discussion</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date and Time Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Select a Time</h3>
              <p className="text-gray-600">Choose your preferred date and time</p>
            </div>

            {isLoadingSlots ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading available times...</span>
              </div>
            ) : (
              <>
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Date</label>
                  <div className="space-y-2">
                    {availableSlots.map((dateSlot, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedDate(index)}
                        className={`w-full p-4 text-left border rounded-lg transition-colors ${
                          selectedDate === index
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                        style={{ minHeight: touchTargetSize }}
                      >
                        {dateSlot.dayName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Selection */}
                {availableSlots[selectedDate] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Available Times</label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots[selectedDate].slots.map((timeSlot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedTime(index)}
                          className={`p-3 text-base border rounded-lg transition-colors ${
                            selectedTime === index
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                          }`}
                          style={{ minHeight: touchTargetSize }}
                        >
                          {timeSlot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirm Booking</h3>
              <p className="text-gray-600">Review your information</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Contact Information</h4>
                <p className="text-gray-600">{formData.firstName} {formData.lastName}</p>
                <p className="text-gray-600">{formData.email}</p>
                {formData.phone && <p className="text-gray-600">{formData.phone}</p>}
                {formData.company && <p className="text-gray-600">{formData.company}</p>}
              </div>
              
              {availableSlots[selectedDate] && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Appointment Details</h4>
                  <p className="text-gray-600">{availableSlots[selectedDate].dayName}</p>
                  <p className="text-gray-600">{availableSlots[selectedDate].slots[selectedTime]?.time}</p>
                  {formData.interest && <p className="text-gray-600">Focus: {formData.interest}</p>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Footer */}
      <div className="p-6 border-t border-gray-200 bg-white">
        {currentStep < totalSteps ? (
          <button
            onClick={nextStep}
            disabled={
              (currentStep === 1 && !canProceedStep1) ||
              (currentStep === 2 && !canProceedStep2)
            }
            className={`w-full py-4 px-4 rounded-lg font-medium transition-colors text-lg ${
              ((currentStep === 1 && canProceedStep1) || (currentStep === 2 && canProceedStep2))
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
            style={{ minHeight: touchTargetSize }}
          >
            Continue
          </button>
        ) : (
          <button
            onClick={onBookingConfirmation}
            disabled={isBooking}
            className={`w-full py-4 px-4 rounded-lg font-medium transition-colors text-lg ${
              isBooking
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
            style={{ minHeight: touchTargetSize }}
          >
            {isBooking ? 'Booking...' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  );
};

// src/app/techequity-demo/components/SchedulingModal.tsx - CHUNK 2

// Tablet: Condensed single-form with optimized field layout
const TabletSchedulingModal = ({
  showSchedulingModal,
  formData,
  selectedDate,
  selectedTime,
  availableSlots,
  isLoadingSlots,
  isBooking,
  handleInputChange,
  handlePhoneChange,
  setSelectedDate,
  setSelectedTime,
  closeSchedulingModal,
  onBookingConfirmation,
  touchTargetSize,
  fieldHeight
}: SchedulingComponentProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-6">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      {/* Tablet Header */}
      <div className="bg-blue-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-7 h-7" />
            <div>
              <h2 className="text-2xl font-semibold">Schedule Discovery Call</h2>
              <p className="text-blue-100 mt-1">Find the perfect time to discuss your needs</p>
            </div>
          </div>
          <button
            onClick={closeSchedulingModal}
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
        </div>
      </div>

      {/* Tablet Content */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information Column */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Information
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    style={{ minHeight: fieldHeight }}
                    placeholder="John"
                    autoComplete="given-name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    style={{ minHeight: fieldHeight }}
                    placeholder="Smith"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  style={{ minHeight: fieldHeight }}
                  placeholder="john@company.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  style={{ minHeight: fieldHeight }}
                  placeholder="(555) 123-4567"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    console.log('onChange fired with:', e.target.value);
                    handleInputChange('company', e.target.value);
                  }}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    const target = e.target as HTMLInputElement;
                    console.log('onInput fired with:', target.value);
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    console.log('onKeyDown:', e.key, 'Current value:', e.currentTarget.value);
                    if (e.key === ' ') {
                      console.log('SPACE KEY DETECTED in onKeyDown');
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:border-blue-500"
                  placeholder="Your Company"
                  autoComplete="organization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Interest</label>
                <select
                  value={formData.interest}
                  onChange={(e) => handleInputChange('interest', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  style={{ minHeight: fieldHeight }}
                >
                  <option value="">Select your main focus</option>
                  <option value="operations">Operations Consulting</option>
                  <option value="cybersecurity">Cybersecurity Solutions</option>
                  <option value="erp">ERP Implementation</option>
                  <option value="crm">CRM Setup</option>
                  <option value="general">General Discussion</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date and Time Selection Column */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Select a Time
            </h3>

            {isLoadingSlots ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading available times...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <div className="space-y-2">
                    {availableSlots.map((dateSlot, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedDate(index)}
                        className={`w-full p-3 text-left border rounded-lg transition-colors text-sm ${
                          selectedDate === index
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {dateSlot.dayName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slot Selection */}
                {availableSlots[selectedDate] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots[selectedDate].slots.map((timeSlot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedTime(index)}
                          className={`p-2 text-sm border rounded-lg transition-colors ${
                            selectedTime === index
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {timeSlot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tablet Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={closeSchedulingModal}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            style={{ minHeight: touchTargetSize }}
          >
            Cancel
          </button>
          <button
            onClick={onBookingConfirmation}
            disabled={!formData.firstName || !formData.lastName || !formData.email || availableSlots.length === 0 || isBooking}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              !formData.firstName || !formData.lastName || !formData.email || availableSlots.length === 0 || isBooking
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            style={{ minHeight: touchTargetSize }}
          >
            {isBooking ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// src/app/techequity-demo/components/SchedulingModal.tsx - CHUNK 3

// Desktop: Traditional modal with original width (FIXED WIDTH)
const DesktopSchedulingModal = ({
  showSchedulingModal,
  formData,
  selectedDate,
  selectedTime,
  availableSlots,
  isLoadingSlots,
  isBooking,
  handleInputChange,
  handlePhoneChange,
  setSelectedDate,
  setSelectedTime,
  closeSchedulingModal,
  onBookingConfirmation
}: SchedulingComponentProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      {/* Desktop Header */}
      <div className="bg-blue-600 text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Schedule Discovery Call</h2>
          </div>
          <button
            onClick={closeSchedulingModal}
            className="text-blue-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-blue-100 mt-2">Let's find the perfect time to discuss your needs</p>
      </div>

      {/* Desktop Content - ORIGINAL STACKED LAYOUT */}
      <div className="p-6">
        {/* Contact Information Section */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="John"
                autoComplete="given-name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                placeholder="Smith"
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="john@company.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="(555) 123-4567"
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log('onChange fired with:', e.target.value);
                handleInputChange('company', e.target.value);
              }}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                const target = e.target as HTMLInputElement;
                console.log('onInput fired with:', target.value);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                console.log('onKeyDown:', e.key, 'Current value:', e.currentTarget.value);
                if (e.key === ' ') {
                  console.log('SPACE KEY DETECTED in onKeyDown');
                }
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base focus:outline-none focus:border-blue-500"
              placeholder="Your Company"
              autoComplete="organization"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Interest</label>
            <select
              value={formData.interest}
              onChange={(e) => handleInputChange('interest', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">Select your main focus</option>
              <option value="operations">Operations Consulting</option>
              <option value="cybersecurity">Cybersecurity Solutions</option>
              <option value="erp">ERP Implementation</option>
              <option value="crm">CRM Setup</option>
              <option value="general">General Discussion</option>
            </select>
          </div>
        </div>

        {/* Date and Time Selection Section - BELOW PERSONAL INFO */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Select a Time</h3>

          {isLoadingSlots ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 text-sm">Loading times...</span>
            </div>
          ) : (
            <>
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <div className="space-y-2">
                  {availableSlots.map((dateSlot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedDate(index)}
                      className={`w-full p-2 text-left border rounded-lg transition-colors text-sm ${
                        selectedDate === index
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {dateSlot.dayName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              {availableSlots[selectedDate] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Times</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots[selectedDate].slots.map((timeSlot, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedTime(index)}
                        className={`p-2 text-sm border rounded-lg transition-colors ${
                          selectedTime === index
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {timeSlot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Desktop Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={closeSchedulingModal}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onBookingConfirmation}
            disabled={!formData.firstName || !formData.lastName || !formData.email || availableSlots.length === 0 || isBooking}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors text-sm ${
              !formData.firstName || !formData.lastName || !formData.email || availableSlots.length === 0 || isBooking
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isBooking ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Main SchedulingModal component
export const SchedulingModal = ({
  showSchedulingModal,
  formData,
  selectedDate,
  selectedTime,
  availableSlots,
  isLoadingSlots,
  isBooking,
  handleInputChange,
  handlePhoneChange,
  setSelectedDate,
  setSelectedTime,
  closeSchedulingModal,
  onBookingConfirmation
}: SchedulingModalProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);
  const fieldHeight = getFormFieldHeight(deviceType);

  // Mobile wizard state
  const [currentStep, setCurrentStep] = useState(1);

  if (!showSchedulingModal) return null;

  // Pass all props to the static components with proper typing
  const componentProps: SchedulingComponentProps = {
    showSchedulingModal,
    formData,
    selectedDate,
    selectedTime,
    availableSlots,
    isLoadingSlots,
    isBooking,
    handleInputChange,
    handlePhoneChange,
    setSelectedDate,
    setSelectedTime,
    closeSchedulingModal,
    onBookingConfirmation,
    touchTargetSize,
    fieldHeight,
    currentStep,
    setCurrentStep
  };

  return (
    <ResponsiveWrapper
      mobile={<MobileSchedulingModal {...componentProps} />}
      tablet={<TabletSchedulingModal {...componentProps} />}
      desktop={<DesktopSchedulingModal {...componentProps} />}
    />
  );
};