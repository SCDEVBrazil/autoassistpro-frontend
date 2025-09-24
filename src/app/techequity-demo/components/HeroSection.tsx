// src/app/techequity-demo/components/HeroSection.tsx

'use client';

import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFontSize, getSpacing } from '@/utils/deviceUtils';

export const HeroSection = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);
  const spacing = getSpacing(deviceType, 'lg');

  // Mobile: Vertical layout, larger touch targets, simplified text
  const MobileHeroSection = () => (
    <section className="bg-gradient-to-b from-slate-800 to-slate-900 text-white py-16 px-6">
      <div className="container mx-auto text-center">
        {/* Mobile Simplified Headline */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
          Transform Your Business
          <span className="text-blue-400 block mt-2">Through Technology</span>
        </h1>
        
        {/* Mobile Simplified Description */}
        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Expert operations consulting and cybersecurity solutions. 
          Over a decade of experience helping organizations grow.
        </p>
        
        {/* Mobile CTA Buttons - Stacked */}
        <div className="flex flex-col gap-4 items-center">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg w-full max-w-sm active:scale-95"
            style={{ 
              minHeight: touchTargetSize,
              fontSize: getFontSize(deviceType, 'lg')
            }}
          >
            Get Started Today
          </button>
          <button 
            className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 transform w-full max-w-sm active:scale-95"
            style={{ 
              minHeight: touchTargetSize,
              fontSize: getFontSize(deviceType, 'lg')
            }}
          >
            Learn More
          </button>
        </div>
        
        {/* Mobile Key Benefits - Simplified */}
        <div className="mt-12 space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Operations Excellence</h3>
            <p className="text-gray-300 text-sm">CRM, HRIS, ERP deployment and system integration</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Cybersecurity Solutions</h3>
            <p className="text-gray-300 text-sm">SOCs, SIEMs, penetration testing, and compliance</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Proven Results</h3>
            <p className="text-gray-300 text-sm">From startups to tribal governments - trusted expertise</p>
          </div>
        </div>
      </div>
    </section>
  );

  // Tablet: Balanced layout with medium touch targets
  const TabletHeroSection = () => (
    <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-20 px-8">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Tablet Content Column */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Empowering Business Through
              <span className="text-blue-400 block">Technology Excellence</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Over a decade of expertise in operations consulting and cybersecurity solutions. 
              Transforming organizations from startups to tribal governments.
            </p>
            
            {/* Tablet CTA Buttons - Side by side */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg"
                style={{ 
                  minHeight: touchTargetSize,
                  fontSize: getFontSize(deviceType, 'lg')
                }}
              >
                Schedule Consultation
              </button>
              <button 
                className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 transform"
                style={{ 
                  minHeight: touchTargetSize,
                  fontSize: getFontSize(deviceType, 'lg')
                }}
              >
                Learn More
              </button>
            </div>

            {/* Tablet Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">10+</div>
                <div className="text-sm text-gray-300">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">50+</div>
                <div className="text-sm text-gray-300">Projects Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">100%</div>
                <div className="text-sm text-gray-300">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Tablet Visual Column */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Why Choose TechEquity?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Proven Track Record</h4>
                    <p className="text-gray-300 text-sm">Successful transformations across multiple industries</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">End-to-End Solutions</h4>
                    <p className="text-gray-300 text-sm">From strategy to implementation and support</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Expert Leadership</h4>
                    <p className="text-gray-300 text-sm">Led by Gabriel Cook with decade+ experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Desktop: Full horizontal layout with detailed messaging
  const DesktopHeroSection = () => (
    <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-24 relative overflow-hidden">
      {/* Desktop Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 via-transparent to-purple-950/20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Desktop Content Column */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-blue-500/30">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Transforming Business Since 2013
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Empowering Business Through
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 block animate-pulse">
                Technology Excellence
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Over a decade of expertise in operations consulting and cybersecurity solutions. 
              Transforming organizations from startups to tribal governments with proven methodologies 
              and cutting-edge technology implementations.
            </p>

            {/* Desktop Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-blue-400 font-bold text-lg">Operations</div>
                <div className="text-gray-300 text-sm">CRM, HRIS, ERP Solutions</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-green-400 font-bold text-lg">Security</div>
                <div className="text-gray-300 text-sm">SOCs, SIEMs, Compliance</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-purple-400 font-bold text-lg">Growth</div>
                <div className="text-gray-300 text-sm">Scalable Transformations</div>
              </div>
            </div>
            
            {/* Desktop CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 transform">
                <span className="flex items-center gap-2 justify-center">
                  Schedule Consultation
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
              <button className="border-2 border-gray-400/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm hover:scale-105 transform">
                View Case Studies
              </button>
            </div>

            {/* Desktop Trust Indicators */}
            <div className="grid grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-1">10+</div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-1">50+</div>
                <div className="text-sm text-gray-400">Projects Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-1">7</div>
                <div className="text-sm text-gray-400">Industries Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">100%</div>
                <div className="text-sm text-gray-400">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Desktop Visual Column */}
          <div className="relative">
            {/* Desktop Hero Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-3xl p-8 backdrop-blur-sm border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Gabriel Cook, Founder</h3>
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <h4 className="font-semibold text-lg mb-2">Suquamish Tribe Transformation</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Led comprehensive digital transformation including ERP implementation, 
                      cybersecurity enhancement, and operational optimization resulting in 
                      40% efficiency improvement and $2M cost savings.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <h4 className="font-semibold text-lg mb-2">Pacific Northwest Tribal Technology Group</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Co-founded regional technology consortium serving 15+ tribal organizations 
                      with shared cybersecurity, cloud infrastructure, and digital governance solutions.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <h4 className="font-semibold text-lg mb-2">Cross-Industry Expertise</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Manufacturing, banking, hospitality, construction, and technology sectors. 
                      Proven methodologies adapted to unique organizational needs and constraints.
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Desktop Bottom CTA Bar */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to Transform Your Operations?</h3>
              <p className="text-gray-300">Schedule a discovery call to discuss your specific needs and challenges.</p>
            </div>
            <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg whitespace-nowrap">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileHeroSection />}
      tablet={<TabletHeroSection />}
      desktop={<DesktopHeroSection />}
    />
  );
};