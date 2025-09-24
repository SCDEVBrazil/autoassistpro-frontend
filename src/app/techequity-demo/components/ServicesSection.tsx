// src/app/techequity-demo/components/ServicesSection.tsx

'use client';

import { Building2, Shield, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFontSize } from '@/utils/deviceUtils';
import { useState } from 'react';

export const ServicesSection = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile expandable card state
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const services = [
    {
      icon: Building2,
      title: "Operations Consulting",
      shortDescription: "CRM, HRIS, ERP deployment and enterprise system integration to streamline your operations.",
      longDescription: "Comprehensive operations consulting including Customer Relationship Management (CRM), Human Resources Information Systems (HRIS), and Enterprise Resource Planning (ERP) deployment. We specialize in enterprise system integration, workflow optimization, and digital transformation strategies that eliminate operational bottlenecks and drive efficiency gains of 30-50%.",
      features: [
        "CRM Implementation & Optimization",
        "HRIS Setup & Integration", 
        "ERP Deployment & Training",
        "Workflow Automation",
        "System Integration",
        "Performance Monitoring"
      ],
      color: "blue",
      gradient: "from-blue-600 to-blue-700"
    },
    {
      icon: Shield,
      title: "Cybersecurity Solutions",
      shortDescription: "SOCs, SIEMs, penetration testing, and CMMC compliance to protect your organization.",
      longDescription: "End-to-end cybersecurity solutions including Security Operations Centers (SOCs), Security Information and Event Management (SIEMs), comprehensive penetration testing, and Cybersecurity Maturity Model Certification (CMMC) compliance. Our approach combines proactive threat detection with robust compliance frameworks to protect your organization's critical assets.",
      features: [
        "SOC Design & Implementation",
        "SIEM Integration & Management",
        "Penetration Testing",
        "CMMC Compliance",
        "Threat Assessment",
        "Incident Response Planning"
      ],
      color: "green",
      gradient: "from-green-600 to-green-700"
    },
    {
      icon: Zap,
      title: "Digital Transformation",
      shortDescription: "Scalable systems that future-proof organizations for sustainable growth.",
      longDescription: "Strategic digital transformation initiatives that modernize legacy systems, implement cloud-native architectures, and establish scalable technology foundations. We focus on creating adaptive systems that grow with your organization while maintaining security, compliance, and operational excellence throughout the transformation journey.",
      features: [
        "Legacy System Modernization",
        "Cloud Migration Strategy",
        "Scalable Architecture Design",
        "Change Management",
        "Technology Roadmapping",
        "ROI Optimization"
      ],
      color: "purple",
      gradient: "from-purple-600 to-purple-700"
    }
  ];

  // Mobile: Single column with expandable cards, touch-optimized
  const MobileServicesSection = () => (
    <section id="services" className="py-16 bg-gray-50 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive technology solutions to unlock growth and strengthen security
          </p>
        </div>
        
        <div className="space-y-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isExpanded = expandedCard === index;
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {/* Mobile Card Header - Always Visible */}
                <button
                  onClick={() => toggleCard(index)}
                  className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset active:bg-gray-50"
                  style={{ minHeight: touchTargetSize }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-1">{service.title}</h3>
                        <p className="text-gray-600 text-sm">{service.shortDescription}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Mobile Expandable Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4 space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        {service.longDescription}
                      </p>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Services:</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <div className={`w-2 h-2 bg-${service.color}-500 rounded-full`}></div>
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        className={`w-full bg-gradient-to-r ${service.gradient} text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg active:scale-95`}
                        style={{ minHeight: touchTargetSize }}
                      >
                        Learn More About {service.title}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  // Tablet: Two columns with medium cards
  const TabletServicesSection = () => (
    <section id="services" className="py-20 bg-gray-50 px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive technology solutions to unlock growth and strengthen security
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {services.slice(0, 2).map((service, index) => {
            const Icon = service.icon;
            
            return (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform border border-gray-200">
                <div className={`w-14 h-14 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-900">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.longDescription}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Services:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className={`w-2 h-2 bg-${service.color}-500 rounded-full`}></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  className={`w-full bg-gradient-to-r ${service.gradient} text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 transform`}
                  style={{ minHeight: touchTargetSize }}
                >
                  Learn More
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Third service spans full width on tablet */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className={`w-14 h-14 bg-gradient-to-r ${services[2].gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-900">{services[2].title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{services[2].longDescription}</p>
                <button 
                  className={`bg-gradient-to-r ${services[2].gradient} text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 transform`}
                >
                  Learn More
                </button>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Key Services:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {services[2].features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 bg-${services[2].color}-500 rounded-full`}></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Desktop: Three columns with detailed cards
  const DesktopServicesSection = () => (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive technology solutions to unlock growth and strengthen security
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <div key={index} className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 transform border border-gray-200 relative overflow-hidden">
                {/* Desktop Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 text-slate-900 group-hover:text-slate-800 transition-colors">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.longDescription}</p>
                  
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className={`w-3 h-3 bg-${service.color}-500 rounded-full`}></div>
                      Key Services
                    </h4>
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className={`w-2 h-2 bg-${service.color}-400 rounded-full`}></div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button className={`w-full bg-gradient-to-r ${service.gradient} text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 transform group-hover:shadow-xl`}>
                      Get Started
                    </button>
                    <button className={`w-full border-2 border-${service.color}-200 text-${service.color}-600 py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-${service.color}-50 hover:border-${service.color}-300`}>
                      View Case Studies
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Bottom CTA Section */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Operations?</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Let&apos;s discuss how our proven methodologies can address your specific challenges and drive measurable results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg">
                Schedule Discovery Call
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105 transform backdrop-blur-sm">
                Download Service Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileServicesSection />}
      tablet={<TabletServicesSection />}
      desktop={<DesktopServicesSection />}
    />
  );
};