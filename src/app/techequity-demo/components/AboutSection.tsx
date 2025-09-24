// src/app/techequity-demo/components/AboutSection.tsx

'use client';

import { Users, Award, Building, Globe, Shield, Zap } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFontSize } from '@/utils/deviceUtils';

export const AboutSection = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Stacked content with mobile-first information hierarchy
  const MobileAboutSection = () => (
    <section id="about" className="py-16 px-6">
      <div className="container mx-auto">
        {/* Mobile Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">About TechEquity Consulting</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Expert technology consulting with proven results
          </p>
        </div>

        {/* Mobile Gabriel Introduction */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-8 border border-blue-100">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Gabriel Cook</h3>
            <p className="text-blue-600 font-semibold">Founder & Principal Consultant</p>
          </div>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-base">
              Over a decade of experience in operations and cybersecurity consulting, 
              specializing in helping organizations overcome operational roadblocks.
            </p>
            <p className="text-base">
              Notable work includes transforming the Suquamish Tribe&apos;s technology infrastructure 
              and co-founding the Pacific Northwest Tribal Technology Group.
            </p>
          </div>
        </div>

        {/* Mobile Key Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">10+</div>
            <div className="text-sm text-gray-600">Years Experience</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">7</div>
            <div className="text-sm text-gray-600">Industries Served</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">100%</div>
            <div className="text-sm text-gray-600">Client Satisfaction</div>
          </div>
        </div>

        {/* Mobile Industries List */}
        <div className="bg-slate-100 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4 text-center">Trusted By Organizations Across Industries</h3>
          <div className="space-y-3">
            {[
              "Tribal Governments",
              "Manufacturing", 
              "Banking & Finance",
              "Technology Startups",
              "Hospitality",
              "Construction",
              "Small to Medium Businesses"
            ].map((industry, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 font-medium">{industry}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center">
          <button 
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg w-full max-w-sm active:scale-95"
            style={{ minHeight: touchTargetSize }}
          >
            Learn About Our Experience
          </button>
        </div>
      </div>
    </section>
  );

  // Tablet: Side-by-side with adjusted content
  const TabletAboutSection = () => (
    <section id="about" className="py-20 px-8">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Tablet Content Column */}
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">About TechEquity Consulting</h2>
            
            {/* Gabriel Introduction */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Gabriel Cook</h3>
                  <p className="text-blue-600 font-semibold">Founder & Principal Consultant</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Founded by Gabriel Cook, TechEquity Consulting brings over a decade of experience 
                in operations and cybersecurity consulting. We specialize in helping organizations 
                overcome operational roadblocks and strengthen their cybersecurity posture.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our expertise spans from startup implementations to complex tribal government 
                transformations, including our notable work with the Suquamish Tribe and 
                co-founding the Pacific Northwest Tribal Technology Group.
              </p>
            </div>

            {/* Tablet Key Achievements */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Suquamish Tribe Transformation</h4>
                  <p className="text-gray-600 text-sm">Led comprehensive digital transformation with 40% efficiency improvement</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Pacific Northwest Tribal Technology Group</h4>
                  <p className="text-gray-600 text-sm">Co-founded consortium serving 15+ tribal organizations</p>
                </div>
              </div>
            </div>

            {/* Tablet Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">10+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="text-3xl font-bold text-green-600 mb-1">50+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
            </div>
          </div>

          {/* Tablet Industries Column */}
          <div>
            <div className="bg-slate-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Building className="w-8 h-8 text-slate-700" />
                Key Industries
              </h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, name: "Tribal Governments", desc: "Sovereign nation technology solutions" },
                  { icon: Building, name: "Manufacturing", desc: "Operational efficiency & automation" },
                  { icon: Globe, name: "Banking & Finance", desc: "Security & compliance systems" },
                  { icon: Zap, name: "Technology Startups", desc: "Scalable infrastructure & growth" },
                  { icon: Users, name: "Hospitality", desc: "Guest experience optimization" },
                  { icon: Award, name: "Construction", desc: "Project management & safety systems" }
                ].map((industry, index) => {
                  const Icon = industry.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{industry.name}</div>
                        <div className="text-sm text-gray-600">{industry.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Desktop: Full side-by-side with complete content
  const DesktopAboutSection = () => (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Desktop Content Column */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              About Our Leadership
            </div>

            <h2 className="text-4xl font-bold text-slate-900 mb-6">About TechEquity Consulting</h2>
            
            {/* Gabriel Profile */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8 border border-blue-100">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">Gabriel Cook</h3>
                  <p className="text-blue-600 font-semibold mb-2">Founder & Principal Consultant</p>
                  <p className="text-gray-600">Technology Transformation Leader</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Founded by Gabriel Cook, TechEquity Consulting brings over a decade of experience 
                in operations and cybersecurity consulting. We specialize in helping organizations 
                overcome operational roadblocks and strengthen their cybersecurity posture through 
                proven methodologies and cutting-edge solutions.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our expertise spans from startup implementations to complex tribal government 
                transformations, including our notable work with the Suquamish Tribe and 
                co-founding the Pacific Northwest Tribal Technology Group. Each engagement delivers 
                measurable results and sustainable operational improvements.
              </p>

              {/* Desktop Credentials */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">CISSP Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">PMP Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">AWS Solutions Architect</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Tribal Tech Specialist</span>
                </div>
              </div>
            </div>

            {/* Desktop Key Projects */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-slate-900 mb-4">Notable Achievements</h4>
              
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-slate-900 mb-1">Suquamish Tribe Digital Transformation</h5>
                  <p className="text-gray-600 text-sm mb-2">Led comprehensive technology overhaul including ERP implementation, cybersecurity enhancement, and operational optimization</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>40% efficiency improvement</span>
                    <span>$2M cost savings</span>
                    <span>Zero security incidents</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-slate-900 mb-1">Pacific Northwest Tribal Technology Group</h5>
                  <p className="text-gray-600 text-sm mb-2">Co-founded and led regional consortium providing shared cybersecurity, cloud infrastructure, and governance solutions</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>15+ tribal organizations</span>
                    <span>Regional collaboration</span>
                    <span>Ongoing leadership</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Industries & Stats Column */}
          <div>
            {/* Desktop Statistics Dashboard */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <h3 className="text-2xl font-bold mb-6 relative z-10">By the Numbers</h3>
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">10+</div>
                  <div className="text-gray-300 text-sm">Years of Expertise</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
                  <div className="text-gray-300 text-sm">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">7</div>
                  <div className="text-gray-300 text-sm">Industries Served</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 mb-2">100%</div>
                  <div className="text-gray-300 text-sm">Client Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Desktop Industries Grid */}
            <div className="bg-slate-100 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Building className="w-8 h-8 text-slate-700" />
                Trusted Across Industries
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Shield, name: "Tribal Governments", desc: "Sovereign nation technology solutions & digital governance", color: "blue" },
                  { icon: Building, name: "Manufacturing", desc: "Operational efficiency, automation & supply chain optimization", color: "green" },
                  { icon: Globe, name: "Banking & Finance", desc: "Security compliance, risk management & regulatory adherence", color: "purple" },
                  { icon: Zap, name: "Technology Startups", desc: "Scalable infrastructure, growth systems & technical strategy", color: "orange" },
                  { icon: Users, name: "Hospitality", desc: "Guest experience optimization & service delivery systems", color: "cyan" },
                  { icon: Award, name: "Construction", desc: "Project management systems, safety protocols & compliance", color: "pink" },
                  { icon: Building, name: "Small to Medium Businesses", desc: "End-to-end technology transformation & operational excellence", color: "indigo" }
                ].map((industry, index) => {
                  const Icon = industry.icon;
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 transform border border-gray-200">
                      <div className={`w-10 h-10 bg-gradient-to-r from-${industry.color}-600 to-${industry.color}-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">{industry.name}</div>
                        <div className="text-sm text-gray-600 leading-relaxed">{industry.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Work with Proven Experts?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join the growing list of organizations that trust TechEquity Consulting for their most critical technology initiatives.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">
              Schedule a Discovery Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileAboutSection />}
      tablet={<TabletAboutSection />}
      desktop={<DesktopAboutSection />}
    />
  );
};