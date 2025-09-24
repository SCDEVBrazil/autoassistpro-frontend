// src/app/techequity-demo/components/ContactSection.tsx

'use client';

import { Phone, Mail, MapPin, Calendar, MessageSquare, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFontSize } from '@/utils/deviceUtils';

export const ContactSection = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Vertical stack with large touch targets for contact methods
  const MobileContactSection = () => (
    <section id="contact" className="py-16 bg-slate-900 text-white px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Ready to transform your operations? Let&apos;s discuss how we can help.
          </p>
        </div>
        
        {/* Mobile Contact Methods - Large Touch Targets */}
        <div className="space-y-4 mb-12">
          {/* Schedule Call Button */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-6 rounded-xl text-left transition-all duration-300 hover:scale-105 transform shadow-lg active:scale-95"
                  style={{ minHeight: touchTargetSize }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Schedule Discovery Call</h3>
                <p className="text-blue-100 text-sm">Book a 30-minute consultation</p>
              </div>
              <ArrowRight className="w-6 h-6 text-white ml-auto" />
            </div>
          </button>

          {/* Email Contact */}
          <a href="mailto:gabriel@techequity.consulting" 
             className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white p-6 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105 transform active:scale-95"
             style={{ minHeight: touchTargetSize }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600/80 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Email Direct</h3>
                <p className="text-gray-300 text-sm">gabriel@techequity.consulting</p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </a>

          {/* Phone Contact */}
          <a href="tel:+1-555-123-4567" 
             className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white p-6 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105 transform active:scale-95"
             style={{ minHeight: touchTargetSize }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-600/80 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Call Direct</h3>
                <p className="text-gray-300 text-sm">Available Mon-Fri 9am-5pm PST</p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400 ml-auto" />
            </div>
          </a>

          {/* Location Info */}
          <div className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600/80 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Location</h3>
                <p className="text-gray-300 text-sm">Seattle, Washington - Serving the Pacific Northwest</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Quick Response Promise */}
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
          <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">Quick Response Guarantee</h3>
          <p className="text-blue-100 text-sm">We respond to all inquiries within 24 hours, typically within 4 hours during business days.</p>
        </div>
      </div>
    </section>
  );

  // Tablet: Two-column layout
  const TabletContactSection = () => (
    <section id="contact" className="py-20 bg-slate-900 text-white px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Get Started Today</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your operations and strengthen your cybersecurity? 
            Let&apos;s discuss how TechEquity Consulting can support your goals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Tablet Contact Methods Column */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Methods</h3>
            <div className="space-y-4">
              {/* Schedule Call */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-6 rounded-xl text-left transition-all duration-300 hover:scale-105 transform shadow-lg"
                      style={{ minHeight: touchTargetSize }}>
                <div className="flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-white" />
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Schedule Discovery Call</h4>
                    <p className="text-blue-100 text-sm">30-minute consultation to discuss your needs</p>
                  </div>
                </div>
              </button>

              {/* Email */}
              <a href="mailto:gabriel@techequity.consulting" 
                 className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105 transform">
                <Mail className="w-8 h-8 text-green-400" />
                <div>
                  <h4 className="text-lg font-semibold">Email</h4>
                  <p className="text-gray-300">gabriel@techequity.consulting</p>
                </div>
              </a>

              {/* Phone */}
              <a href="tel:+1-555-123-4567" 
                 className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-300 hover:scale-105 transform">
                <Phone className="w-8 h-8 text-orange-400" />
                <div>
                  <h4 className="text-lg font-semibold">Phone</h4>
                  <p className="text-gray-300">Available Mon-Fri 9am-5pm PST</p>
                </div>
              </a>

              {/* Location */}
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                <MapPin className="w-8 h-8 text-purple-400" />
                <div>
                  <h4 className="text-lg font-semibold">Location</h4>
                  <p className="text-gray-300">Seattle, Washington</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Info Column */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Why Choose TechEquity?</h3>
            <div className="space-y-6">
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
                <Clock className="w-8 h-8 text-blue-400 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Quick Response</h4>
                <p className="text-blue-100 text-sm">24-hour response guarantee, typically within 4 hours during business days.</p>
              </div>

              <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-6 backdrop-blur-sm">
                <MessageSquare className="w-8 h-8 text-green-400 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Free Consultation</h4>
                <p className="text-green-100 text-sm">Initial discovery call at no cost to understand your challenges and explore solutions.</p>
              </div>

              <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
                <ArrowRight className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="text-lg font-semibold mb-2">Proven Results</h4>
                <p className="text-purple-100 text-sm">10+ years of experience with measurable outcomes across multiple industries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Desktop: Three-column layout
  const DesktopContactSection = () => (
    <section id="contact" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Desktop Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 via-transparent to-purple-950/20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-blue-500/30">
            <MessageSquare className="w-4 h-4" />
            Ready to Get Started?
          </div>
          <h2 className="text-4xl font-bold mb-4">Get Started Today</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your operations and strengthen your cybersecurity? 
            Let&apos;s discuss how TechEquity Consulting can support your goals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Phone Contact Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105 transform">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Phone Consultation</h3>
            <p className="text-gray-300 mb-4">Direct access to Gabriel Cook for immediate technical discussions</p>
            <a href="tel:+1-555-123-4567" 
               className="inline-block bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 transform shadow-lg">
              Call Now
            </a>
            <p className="text-gray-400 text-sm mt-3">Mon-Fri 9am-5pm PST</p>
          </div>

          {/* Email Contact Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105 transform">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Email Direct</h3>
            <p className="text-gray-300 mb-4">Detailed project discussions and comprehensive proposal requests</p>
            <a href="mailto:gabriel@techequity.consulting" 
               className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 transform shadow-lg">
              Send Email
            </a>
            <p className="text-gray-400 text-sm mt-3">gabriel@techequity.consulting</p>
          </div>

          {/* Location Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105 transform">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Location</h3>
            <p className="text-gray-300 mb-4">Serving the Pacific Northwest with on-site and remote capabilities</p>
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-lg font-medium">
              Seattle, WA
            </div>
            <p className="text-gray-400 text-sm mt-3">Remote & On-site Available</p>
          </div>
        </div>

        {/* Desktop Featured CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
          
          <div className="relative z-10">
            <Calendar className="w-16 h-16 text-white mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">Schedule Your Discovery Call</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              30-minute complimentary consultation to understand your challenges, 
              explore solutions, and determine if TechEquity is the right fit for your organization.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 transform shadow-lg">
                Schedule Discovery Call
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 transform backdrop-blur-sm">
                Download Case Studies
              </button>
            </div>

            {/* Desktop Service Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Clock className="w-6 h-6 text-white mx-auto mb-2" />
                <h4 className="font-semibold mb-1">24-Hour Response</h4>
                <p className="text-blue-100 text-sm">Guaranteed response within 24 hours</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <MessageSquare className="w-6 h-6 text-white mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Free Consultation</h4>
                <p className="text-blue-100 text-sm">No-cost initial discovery session</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <ArrowRight className="w-6 h-6 text-white mx-auto mb-2" />
                <h4 className="font-semibold mb-1">Proven Results</h4>
                <p className="text-blue-100 text-sm">10+ years of measurable outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileContactSection />}
      tablet={<TabletContactSection />}
      desktop={<DesktopContactSection />}
    />
  );
};