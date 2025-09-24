// src/app/page.tsx

'use client';

import { MessageCircle, Zap, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getSpacing } from '@/utils/deviceUtils';

export default function Home() {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);
  const spacing = getSpacing(deviceType, 'lg');

  // Mobile: Single-column hero with simplified messaging
  const MobileLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Mobile Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 via-transparent to-purple-950/20"></div>
      
      {/* Mobile Header */}
      <header className="px-6 py-6 relative z-10">
        <nav className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">
              AutoAssist<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Pro</span>
            </div>
            <div className="text-xs text-gray-400 font-medium">
              Powered by <a href="https://www.accelerateai.ai" target="_blank" rel="noopener noreferrer" className="text-blue-300 font-semibold hover:text-blue-200 transition-colors duration-200">Accelerate AI</a>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          <div className="flex flex-col space-y-2 w-full max-w-sm">
            <a href="#features" className="w-full text-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 rounded-lg transition-all duration-300" style={{ minHeight: touchTargetSize }}>
              Features
            </a>
            <Link href="/demo" className="w-full text-center px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 rounded-lg transition-all duration-300" style={{ minHeight: touchTargetSize }}>
              Demo
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Hero Section */}
      <main className="px-6 pt-8 pb-16 relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
            AI-Powered Customer Service
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 block mt-2">Made Simple</span>
          </h1>
          
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Transform your customer interactions with intelligent automation and seamless appointment scheduling.
          </p>

          {/* Mobile CTA Button */}
          <a href="https://www.accelerateai.ai/contact" target="_blank" rel="noopener noreferrer" 
             className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg active:scale-95"
             style={{ minHeight: touchTargetSize }}>
            Get Started
          </a>
          <p className="text-gray-400 mt-4 text-sm">Schedule your consultation today</p>
        </div>

        {/* Mobile Features Grid */}
        <div id="features" className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Key Features</h2>
          
          {/* Mobile Feature Cards - Single Column */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-8 h-8 text-blue-400 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-white">Smart Chat</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                AI-powered conversations that understand context and provide relevant responses to customer inquiries.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-white">Instant Booking</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Seamless appointment scheduling integrated directly into chat conversations.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-green-400 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-white">Secure Platform</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Enterprise-grade security protecting your customer data and conversations.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-purple-400 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-white">Team Management</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Comprehensive admin dashboard for managing conversations and appointments.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Bottom CTA */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-6 text-sm">
            Discuss implementing AutoAssistPro for your business
          </p>
          <a href="https://www.accelerateai.ai/contact" target="_blank" rel="noopener noreferrer" 
             className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
             style={{ minHeight: touchTargetSize }}>
            Contact Accelerate AI
          </a>
        </div>
      </main>
    </div>
  );

  // Tablet: Two-column layout with condensed features
  const TabletLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Tablet Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 via-transparent to-purple-950/20"></div>
      
      {/* Tablet Header */}
      <header className="container mx-auto px-8 py-6 relative z-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-white">
              AutoAssist<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Pro</span>
            </div>
            <div className="text-sm text-gray-400 font-medium">
              Powered by <a href="https://www.accelerateai.ai" target="_blank" rel="noopener noreferrer" className="text-blue-300 font-semibold hover:text-blue-200 transition-colors duration-200 hover:underline">Accelerate AI</a>
            </div>
          </div>
          <div className="flex space-x-4">
            <a href="#features" className="px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 rounded-lg transition-all duration-300" style={{ minHeight: '40px' }}>
              Features
            </a>
            <Link href="/demo" className="px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 rounded-lg transition-all duration-300" style={{ minHeight: '40px' }}>
              Demo
            </Link>
          </div>
        </nav>
      </header>

      {/* Tablet Hero Section */}
      <main className="container mx-auto px-8 pt-8 pb-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            AI-Powered Customer Service
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 block mt-2">
              That Actually Works
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your customer interactions with intelligent automation, seamless appointment scheduling, and powerful analytics.
          </p>

          {/* Tablet CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://www.accelerateai.ai/contact" target="_blank" rel="noopener noreferrer" 
               className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 transform shadow-lg"
               style={{ minHeight: '48px' }}>
              Get Started Today
            </a>
            <Link href="/demo" className="border border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 transform"
                  style={{ minHeight: '48px' }}>
              View Demo
            </Link>
          </div>
          
          <p className="text-gray-400 mt-6">Discuss implementing AutoAssistPro for your business</p>
        </div>

        {/* Tablet Features Grid - Two Columns */}
        <section id="features" className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-300">Powerful features designed for modern businesses</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Intelligent Chat</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                AI-powered conversations that understand context, handle complex inquiries, and provide personalized responses to your customers.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Smart Scheduling</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Seamless appointment booking integrated directly into conversations, with automatic calendar management and confirmation.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Enterprise Security</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Bank-level encryption and security protocols protecting your customer data and maintaining compliance standards.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Team Dashboard</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Comprehensive admin interface for managing conversations, tracking performance, and optimizing customer experiences.
              </p>
            </div>
          </div>
        </section>

        {/* Tablet Bottom CTA */}
        <section className="mt-20 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Customer Service?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get started with AutoAssistPro and see how AI can revolutionize your customer interactions
            </p>
            <a href="https://www.accelerateai.ai/contact" target="_blank" rel="noopener noreferrer" 
               className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 transform shadow-lg">
              Contact Accelerate AI
            </a>
          </div>
        </section>
      </main>
    </div>
  );

  // Desktop: Full multi-column layout with animations (original design enhanced)
  const DesktopLandingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Desktop Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/20 via-transparent to-purple-950/20"></div>
      
      {/* Desktop Header */}
      <header className="container mx-auto px-6 py-8 relative z-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-white">
              AutoAssist<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Pro</span>
            </div>
            <div className="text-sm text-gray-400 font-medium">
              Powered by <a href="https://www.accelerateai.ai" target="_blank" rel="noopener noreferrer" className="text-blue-300 font-semibold hover:text-blue-200 transition-colors duration-200 hover:underline">Accelerate AI</a>
            </div>
          </div>
          <div className="hidden md:flex space-x-3">
            <a href="#features" className="px-6 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 rounded-lg transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-blue-400/30">
              Features
            </a>
            <Link href="/demo" className="px-6 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 rounded-lg transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-blue-400/30">
              Demo
            </Link>
            <a href="https://www.accelerateai.ai/contact" target="_blank" rel="noopener noreferrer" className="px-6 py-3 text-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 transform shadow-lg">
              Contact Us
            </a>
          </div>
        </nav>
      </header>

      {/* Desktop Hero Section */}
      <main className="container mx-auto px-6 pt-12 pb-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            AI-Powered Customer Service
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 block mt-2">
              That Scales With Your Business
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your customer interactions with intelligent automation, seamless appointment scheduling, 
            and powerful analytics. Built for businesses that demand excellence.
          </p>

          {/* Desktop CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <a href="https://www.accelerateai.ai/contact" target="_blank" rel="noopener noreferrer" 
               className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-6 rounded-xl text-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 transform shadow-lg">
              Get Started Today
            </a>
            <Link href="/demo" className="border-2 border-blue-400 text-blue-300 hover:bg-blue-400 hover:text-white px-12 py-6 rounded-xl text-xl font-semibold transition-all duration-300 hover:scale-105 transform">
              View Live Demo
            </Link>
          </div>
          
          <p className="text-gray-400">Discuss implementing AutoAssistPro for your business</p>
        </div>

        {/* Desktop Features Grid - Full Layout */}
        <section id="features" className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful features designed for modern businesses that want to deliver exceptional customer experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Intelligent Conversations</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Advanced AI that understands context, handles complex inquiries, and provides personalized responses that feel natural and helpful.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li>• Natural language processing</li>
                <li>• Context-aware responses</li>
                <li>• Multi-turn conversations</li>
                <li>• Custom knowledge base</li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Smart Scheduling</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Seamless appointment booking integrated directly into conversations, with intelligent availability management and automated confirmations.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li>• Real-time availability checking</li>
                <li>• Automatic calendar sync</li>
                <li>• Email confirmations</li>
                <li>• Timezone handling</li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Enterprise Security</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Bank-level encryption and security protocols ensuring your customer data is protected with the highest industry standards.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li>• End-to-end encryption</li>
                <li>• GDPR compliance</li>
                <li>• SOC 2 Type II certified</li>
                <li>• Regular security audits</li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Powerful Analytics</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Comprehensive dashboard with insights into customer interactions, conversion rates, and team performance metrics.
              </p>
              <ul className="text-gray-400 space-y-2">
                <li>• Real-time analytics</li>
                <li>• Conversion tracking</li>
                <li>• Performance metrics</li>
                <li>• Custom reporting</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Desktop Bottom CTA */}
        <section className="mt-24 bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="text-center relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Customer Service?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Get started with AutoAssistPro and see how AI can revolutionize your customer service operations
            </p>
            <a href="https://www.accelerateai.ai/contact" target="_blank" rel="noopener noreferrer" 
               className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-12 py-6 rounded-xl text-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 hover:scale-105 transform shadow-lg">
              Contact Accelerate AI
            </a>
            <p className="text-gray-400 mt-4">Discuss implementing AutoAssistPro for your business</p>
          </div>
        </section>
      </main>
    </div>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileLandingPage />}
      tablet={<TabletLandingPage />}
      desktop={<DesktopLandingPage />}
    />
  );
}