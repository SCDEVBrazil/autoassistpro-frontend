// src/app/admin/components/Header.tsx

'use client';

import { Calendar, LogOut, Menu } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

interface HeaderProps {
  onLogout: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Simplified header with hamburger menu
  const MobileHeader = () => (
    <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-700">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Logo - Simplified */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">TechEquity</h1>
              <p className="text-xs text-gray-300">Admin</p>
            </div>
          </div>
          
          {/* Mobile Sign Out Button - Touch Optimized */}
          <button 
            onClick={onLogout} 
            className="flex items-center justify-center bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 active:scale-95"
            style={{ 
              width: touchTargetSize, 
              height: touchTargetSize,
              minWidth: touchTargetSize,
              minHeight: touchTargetSize
            }}
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );

  // Tablet: Condensed header with essential elements
  const TabletHeader = () => (
    <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">TechEquity Admin</h1>
              <p className="text-xs text-gray-300">Scheduling Management</p>
            </div>
          </div>
          
          {/* Tablet Sign Out Button */}
          <button 
            onClick={onLogout} 
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 transform"
            style={{ minHeight: touchTargetSize }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );

  // Desktop: Full header with all elements (original design)
  const DesktopHeader = () => (
    <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TechEquity Admin</h1>
              <p className="text-sm text-gray-300">Scheduling Management</p>
            </div>
          </div>
          
          {/* Desktop Sign Out Button - Original Design */}
          <button 
            onClick={onLogout} 
            className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg transform"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileHeader />}
      tablet={<TabletHeader />}
      desktop={<DesktopHeader />}
    />
  );
};