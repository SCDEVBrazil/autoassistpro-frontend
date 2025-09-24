// src/app/techequity-demo/components/SiteHeader.tsx

'use client';

import { Menu, X } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';
import { useState, useEffect } from 'react';

export const SiteHeader = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when device type changes or on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu when device type changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [deviceType]);

  const navigationItems = [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    // Smooth scroll to anchor
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mobile: Full-screen overlay menu with large touch targets
  const MobileSiteHeader = () => (
    <>
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              TechEquity <span className="text-blue-400">Consulting</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-white hover:text-blue-400 transition-colors active:scale-95"
              style={{ 
                width: touchTargetSize, 
                height: touchTargetSize,
                minWidth: touchTargetSize,
                minHeight: touchTargetSize
              }}
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 mx-auto" />
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800">
            <div className="text-2xl font-bold text-white">
              TechEquity <span className="text-blue-400">Consulting</span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white hover:text-blue-400 transition-colors active:scale-95"
              style={{ 
                width: touchTargetSize, 
                height: touchTargetSize,
                minWidth: touchTargetSize,
                minHeight: touchTargetSize
              }}
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6 mx-auto" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 flex flex-col justify-center px-6">
            <nav className="space-y-6">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left text-2xl font-semibold text-white hover:text-blue-400 transition-colors py-4 border-b border-slate-800 hover:border-blue-400 active:scale-95"
                  style={{ minHeight: touchTargetSize }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-slate-800">
            <button 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg active:scale-95"
              style={{ minHeight: touchTargetSize }}
              onClick={() => {
                setIsMenuOpen(false);
                handleNavClick('#contact');
              }}
            >
              Get Started Today
            </button>
          </div>
        </div>
      )}
    </>
  );

  // Tablet: Collapsible horizontal menu
  const TabletSiteHeader = () => (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800">
      <div className="container mx-auto px-8 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            TechEquity <span className="text-blue-400">Consulting</span>
          </div>
          
          {/* Tablet Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-400 transition-colors"
              style={{ 
                width: touchTargetSize, 
                height: touchTargetSize,
                minWidth: touchTargetSize,
                minHeight: touchTargetSize
              }}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 mx-auto" />
              ) : (
                <Menu className="w-6 h-6 mx-auto" />
              )}
            </button>
          </div>

          {/* Tablet Horizontal Menu (Hidden on smaller screens) */}
          <div className="hidden md:flex space-x-8">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className="hover:text-blue-400 transition-colors py-2 px-3 rounded-lg hover:bg-slate-800"
                style={{ minHeight: touchTargetSize }}
              >
                {item.label}
              </button>
            ))}
            <button 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 transform"
              onClick={() => handleNavClick('#contact')}
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Tablet Collapsible Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-800 pt-4">
            <nav className="space-y-3">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item.href)}
                  className="block w-full text-left text-lg text-white hover:text-blue-400 transition-colors py-3 px-4 rounded-lg hover:bg-slate-800"
                  style={{ minHeight: touchTargetSize }}
                >
                  {item.label}
                </button>
              ))}
              <button 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg mt-4"
                style={{ minHeight: touchTargetSize }}
                onClick={() => {
                  setIsMenuOpen(false);
                  handleNavClick('#contact');
                }}
              >
                Get Started Today
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );

  // Desktop: Full horizontal navigation
  const DesktopSiteHeader = () => (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 backdrop-blur-sm bg-slate-900/95">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            TechEquity <span className="text-blue-400">Consulting</span>
          </div>
          
          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-slate-800/50 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </button>
            ))}
            
            {/* Desktop CTA Button */}
            <button 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-blue-500/25"
              onClick={() => handleNavClick('#contact')}
            >
              Get Started
            </button>
          </div>

          {/* Desktop Secondary Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              className="text-gray-300 hover:text-white transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-slate-800/50"
              onClick={() => window.open('tel:+1-555-123-4567', '_self')}
            >
              Call: (555) 123-4567
            </button>
          </div>
        </nav>
      </div>
    </header>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileSiteHeader />}
      tablet={<TabletSiteHeader />}
      desktop={<DesktopSiteHeader />}
    />
  );
};