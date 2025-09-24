// src/app/admin/components/Navigation.tsx

'use client';

import { Clock, Users, Settings, MessageSquare, BarChart3 } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

type ActiveTab = 'availability' | 'bookings' | 'settings' | 'chat-logs' | 'analytics';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  const tabs = [
    {
      id: 'availability' as ActiveTab,
      icon: Clock,
      label: 'Availability',
      shortLabel: 'Schedule'
    },
    {
      id: 'bookings' as ActiveTab,
      icon: Users,
      label: 'Scheduled Calls',
      shortLabel: 'Calls'
    },
    {
      id: 'chat-logs' as ActiveTab,
      icon: MessageSquare,
      label: 'Chat Logs',
      shortLabel: 'Chats'
    },
    {
      id: 'analytics' as ActiveTab,
      icon: BarChart3,
      label: 'Analytics',
      shortLabel: 'Stats'
    },
    {
      id: 'settings' as ActiveTab,
      icon: Settings,
      label: 'Settings',
      shortLabel: 'Settings'
    }
  ];

  // Mobile: Bottom tab bar with icons only
  const MobileNavigation = () => (
    <nav className="bg-gray-800/95 backdrop-blur-sm">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center transition-colors ${
                isActive
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              style={{ 
                minHeight: touchTargetSize,
                minWidth: touchTargetSize
              }}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.shortLabel}</span>
              {isActive && (
                <div className="w-4 h-0.5 bg-blue-400 rounded-full mt-1"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );

  // Tablet: Side navigation drawer
  const TabletNavigation = () => (
    <nav className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                  }`}
                  style={{ minHeight: touchTargetSize }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );

  // Desktop: Horizontal tab navigation (original design)
  const DesktopNavigation = () => (
    <nav className="bg-gray-800/60 backdrop-blur-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileNavigation />}
      tablet={<TabletNavigation />}
      desktop={<DesktopNavigation />}
    />
  );
};