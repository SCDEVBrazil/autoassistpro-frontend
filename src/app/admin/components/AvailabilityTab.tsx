// src/app/admin/components/AvailabilityTab.tsx

'use client';

import { Eye, EyeOff, Save, Plus, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { WeeklySchedule, BlackoutDate } from '../types';
import { BlackoutDateModal } from './BlackoutDateModal';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface AvailabilityTabProps {
  weeklySchedule: WeeklySchedule;
  blackoutDates: BlackoutDate[];
  isLoading: boolean;
  onUpdateDaySchedule: (day: keyof WeeklySchedule, field: string, value: string | boolean) => void;
  onSaveSchedule: () => void;
  onAddBlackout: (date: string, reason: string) => void;
  onRemoveBlackout: (id: number) => void;
}

export const AvailabilityTab = ({
  weeklySchedule,
  blackoutDates,
  isLoading,
  onUpdateDaySchedule,
  onSaveSchedule,
  onAddBlackout,
  onRemoveBlackout
}: AvailabilityTabProps) => {
  const [showBlackoutModal, setShowBlackoutModal] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  const handleAddBlackout = (date: string, reason: string) => {
    onAddBlackout(date, reason);
    setShowBlackoutModal(false);
  };

  const toggleDay = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  // Mobile: Accordion-style day selector with large time pickers
  const MobileAvailabilityTab = () => (
    <div className="space-y-6">
      {/* Mobile Weekly Schedule */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="p-4 border-b border-slate-600/50">
          <h2 className="text-lg font-semibold text-white">Weekly Availability</h2>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading schedule...</div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {Object.entries(weeklySchedule).map(([day, schedule]) => (
              <div key={day} className="border border-slate-600/60 rounded-lg overflow-hidden">
                {/* Mobile Day Header */}
                <button
                  onClick={() => toggleDay(day)}
                  className="w-full p-4 bg-slate-700/60 hover:bg-slate-600/60 transition-colors flex items-center justify-between"
                  style={{ minHeight: touchTargetSize }}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateDaySchedule(day as keyof WeeklySchedule, 'enabled', !schedule.enabled);
                      }}
                      className={`p-2 rounded transition-colors ${
                        schedule.enabled ? 'text-green-400' : 'text-gray-500'
                      }`}
                    >
                      {schedule.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <span className="font-medium text-gray-100 capitalize text-lg">{day}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">
                      {schedule.enabled ? `${schedule.start} - ${schedule.end}` : 'Unavailable'}
                    </span>
                    {expandedDay === day ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Mobile Time Settings - Accordion Content */}
                {expandedDay === day && schedule.enabled && (
                  <div className="p-4 bg-slate-800/40 border-t border-slate-600/60">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => onUpdateDaySchedule(day as keyof WeeklySchedule, 'start', e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => onUpdateDaySchedule(day as keyof WeeklySchedule, 'end', e.target.value)}
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Mobile Save Button */}
        <div className="p-4 border-t border-slate-600/50">
          <button
            onClick={onSaveSchedule}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white active:scale-95'
            }`}
            style={{ minHeight: touchTargetSize }}
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      </div>

      {/* Mobile Blackout Dates */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="flex items-center justify-between p-4 border-b border-slate-600/50">
          <h2 className="text-lg font-semibold text-white">Blackout Dates</h2>
          <button
            onClick={() => setShowBlackoutModal(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-300 active:scale-95 flex items-center gap-2"
            style={{ minHeight: touchTargetSize }}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {blackoutDates.length > 0 && (
          <div className="p-4">
            <div className="space-y-3">
              {blackoutDates.map((blackout) => (
                <div key={blackout.id} className="p-4 bg-red-900/20 border border-red-800/40 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-red-300 text-lg">{blackout.date}</div>
                      <div className="text-red-400 text-sm mt-1">{blackout.reason}</div>
                    </div>
                    <button
                      onClick={() => onRemoveBlackout(blackout.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2"
                      style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BlackoutDateModal
        isOpen={showBlackoutModal}
        onClose={() => setShowBlackoutModal(false)}
        onAdd={handleAddBlackout}
      />
    </div>
  );

  // Tablet: Simplified grid with touch-friendly controls
  const TabletAvailabilityTab = () => (
    <div className="space-y-6">
      {/* Tablet Weekly Schedule */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-slate-600/50">
        <h2 className="text-xl font-semibold text-white mb-6">Weekly Availability</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading schedule...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(weeklySchedule).map(([day, schedule]) => (
              <div key={day} className="p-4 bg-slate-700/60 border border-slate-600/60 rounded-lg hover:bg-slate-600/60 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateDaySchedule(day as keyof WeeklySchedule, 'enabled', !schedule.enabled)}
                      className={`p-2 rounded transition-colors ${
                        schedule.enabled ? 'text-green-400' : 'text-gray-500'
                      }`}
                      style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
                    >
                      {schedule.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <span className="font-medium text-gray-100 capitalize text-lg">{day}</span>
                  </div>
                  <span className="text-sm text-gray-300">
                    {schedule.enabled ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                {schedule.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Start</label>
                      <input
                        type="time"
                        value={schedule.start}
                        onChange={(e) => onUpdateDaySchedule(day as keyof WeeklySchedule, 'start', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        style={{ minHeight: touchTargetSize }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">End</label>
                      <input
                        type="time"
                        value={schedule.end}
                        onChange={(e) => onUpdateDaySchedule(day as keyof WeeklySchedule, 'end', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        style={{ minHeight: touchTargetSize }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={onSaveSchedule}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              isLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-105 transform'
            }`}
            style={{ minHeight: touchTargetSize }}
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      </div>

      {/* Tablet Blackout Dates */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-white">Blackout Dates</h2>
          <button
            onClick={() => setShowBlackoutModal(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 transform flex items-center gap-2"
            style={{ minHeight: touchTargetSize }}
          >
            <Plus className="w-4 h-4" />
            Add Blackout
          </button>
        </div>

        {blackoutDates.length > 0 && (
          <div className="px-6 pb-6">
            <div className="grid gap-3">
              {blackoutDates.map((blackout) => (
                <div key={blackout.id} className="flex items-center justify-between p-4 bg-red-900/20 border border-red-800/40 rounded-lg hover:bg-red-900/30 transition-colors">
                  <div>
                    <span className="font-medium text-red-300 text-lg">{blackout.date}</span>
                    <span className="text-red-400 ml-3">{blackout.reason}</span>
                  </div>
                  <button
                    onClick={() => onRemoveBlackout(blackout.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                    style={{ minWidth: touchTargetSize, minHeight: touchTargetSize }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BlackoutDateModal
        isOpen={showBlackoutModal}
        onClose={() => setShowBlackoutModal(false)}
        onAdd={handleAddBlackout}
      />
    </div>
  );

  // Desktop: Full weekly grid with time inputs (original design)
  const DesktopAvailabilityTab = () => (
    <div className="space-y-8">
      {/* Desktop Weekly Schedule */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-slate-600/50">
        <h2 className="text-xl font-semibold text-white mb-6">Weekly Availability</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400">Loading schedule...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(weeklySchedule).map(([day, schedule]) => (
              <div key={day} className="flex items-center gap-4 p-4 bg-slate-700/60 border border-slate-600/60 rounded-lg hover:bg-slate-600/60 transition-all duration-300 hover:border-blue-500/30">
                <div className="w-24">
                  <span className="font-medium text-gray-100 capitalize">{day}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateDaySchedule(day as keyof WeeklySchedule, 'enabled', !schedule.enabled)}
                    className={`p-1 rounded transition-colors ${schedule.enabled ? 'text-green-400 hover:text-green-300' : 'text-gray-500 hover:text-gray-400'}`}
                  >
                    {schedule.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <span className="text-sm text-gray-300">
                    {schedule.enabled ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                {schedule.enabled && (
                  <div className="flex items-center gap-4 ml-auto">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={schedule.start}
                        onChange={(e) => onUpdateDaySchedule(day as keyof WeeklySchedule, 'start', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={schedule.end}
                        onChange={(e) => onUpdateDaySchedule(day as keyof WeeklySchedule, 'end', e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={onSaveSchedule}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              isLoading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg transform hover:scale-105'
            }`}
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Schedule'}
          </button>
        </div>
      </div>

      {/* Desktop Blackout Dates */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-white">Blackout Dates</h2>
          <button
            onClick={() => setShowBlackoutModal(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Blackout
          </button>
        </div>

        {blackoutDates.length > 0 && (
          <div className="px-6 pb-6">
            <div className="space-y-3">
              {blackoutDates.map((blackout) => (
                <div key={blackout.id} className="flex items-center justify-between p-3 bg-red-900/20 border border-red-800/40 rounded-lg hover:bg-red-900/30 transition-colors">
                  <div>
                    <span className="font-medium text-red-300">{blackout.date}</span>
                    <span className="text-red-400 ml-2">{blackout.reason}</span>
                  </div>
                  <button
                    onClick={() => onRemoveBlackout(blackout.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BlackoutDateModal
        isOpen={showBlackoutModal}
        onClose={() => setShowBlackoutModal(false)}
        onAdd={handleAddBlackout}
      />
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileAvailabilityTab />}
      tablet={<TabletAvailabilityTab />}
      desktop={<DesktopAvailabilityTab />}
    />
  );
};