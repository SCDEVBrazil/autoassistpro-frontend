// src/app/techequity-demo/components/DemoBanner.tsx

'use client';

import Link from 'next/link';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFontSize } from '@/utils/deviceUtils';

export const DemoBanner = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Single-line text with simplified messaging
  const MobileDemoBanner = () => (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <span className="font-bold text-base">🚀 DEMO SITE</span>
          <span className="ml-2 text-orange-100 text-sm block mt-1">AutoAssistPro Integration Showcase</span>
        </div>
        <Link 
          href="/" 
          className="text-orange-100 hover:text-white transition-colors text-sm underline ml-4 flex-shrink-0"
          style={{ minHeight: touchTargetSize }}
        >
          Back
        </Link>
      </div>
    </div>
  );

  // Tablet: Two-line layout
  const TabletDemoBanner = () => (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <div className="text-center">
            <span className="font-semibold text-lg">🚀 DEMO SITE - AutoAssistPro Integration</span>
            <div className="text-orange-100 text-sm mt-1">
              Demonstration of how AutoAssistPro integrates into consulting websites
            </div>
          </div>
        </div>
        <Link 
          href="/" 
          className="text-orange-100 hover:text-white transition-colors underline ml-6 flex-shrink-0"
          style={{ minHeight: touchTargetSize }}
        >
          Back to AutoAssistPro
        </Link>
      </div>
    </div>
  );

  // Desktop: Full banner with complete messaging
  const DesktopDemoBanner = () => (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <span className="font-semibold text-lg">🚀 DEMO SITE - AutoAssistPro Integration Showcase</span>
          <span className="ml-4 text-orange-100">
            This is a demonstration of how AutoAssistPro seamlessly integrates into consulting and professional service websites
          </span>
        </div>
        <Link 
          href="/" 
          className="text-orange-100 hover:text-white transition-colors underline ml-6 flex-shrink-0"
        >
          Back to AutoAssistPro
        </Link>
      </div>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileDemoBanner />}
      tablet={<TabletDemoBanner />}
      desktop={<DesktopDemoBanner />}
    />
  );
};