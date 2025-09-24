// src/app/admin/components/AuthForm.tsx

'use client';

import { Settings } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize, getFormFieldHeight } from '@/utils/deviceUtils';

interface AuthFormProps {
  loginForm: { username: string; password: string };
  onLogin: (e: React.FormEvent) => void;
  onUpdateForm: (field: 'username' | 'password', value: string) => void;
}

// CRITICAL FIX: Move component definitions OUTSIDE the main component function
// This prevents React from creating new component instances on every render

// Mobile: Full-screen login with large touch targets
const MobileAuthForm = ({ loginForm, onLogin, onUpdateForm, touchTargetSize, fieldHeight }: {
  loginForm: { username: string; password: string };
  onLogin: (e: React.FormEvent) => void;
  onUpdateForm: (field: "username" | "password", value: string) => void;
  touchTargetSize: string;
  fieldHeight: string;
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex flex-col justify-center">
    <div className="px-6 py-8">
      {/* Mobile Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Settings className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">TechEquity</h1>
        <h2 className="text-xl font-semibold text-blue-200 mb-2">Admin Portal</h2>
        <p className="text-blue-100">Scheduling Management</p>
      </div>
      
      {/* Mobile Form */}
      <form onSubmit={onLogin} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-white mb-3">Username</label>
          <input
            type="text"
            value={loginForm.username}
            onChange={(e) => onUpdateForm('username', e.target.value)}
            className="w-full border-2 border-blue-300 rounded-xl px-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/95"
            style={{ height: fieldHeight }}
            placeholder="Enter username"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-white mb-3">Password</label>
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) => onUpdateForm('password', e.target.value)}
            className="w-full border-2 border-blue-300 rounded-xl px-4 text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/95"
            style={{ height: fieldHeight }}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 active:scale-95 shadow-lg text-lg"
          style={{ height: touchTargetSize }}
        >
          Sign In
        </button>
      </form>
      
      {/* Mobile Demo Credentials */}
      <div className="mt-8 p-4 bg-blue-900/30 rounded-xl border border-blue-400/30">
        <p className="text-sm text-blue-200 text-center font-medium">
          Demo credentials
        </p>
        <p className="text-blue-100 text-center mt-1">
          <span className="font-mono">gabriel / admin123</span>
        </p>
      </div>
    </div>
  </div>
);

// Tablet: Centered form with medium sizing
const TabletAuthForm = ({ loginForm, onLogin, onUpdateForm, touchTargetSize, fieldHeight }: {
  loginForm: { username: string; password: string };
  onLogin: (e: React.FormEvent) => void;
  onUpdateForm: (field: "username" | "password", value: string) => void;
  touchTargetSize: string;
  fieldHeight: string;
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
      <div className="text-center mb-8">
        <div className="w-18 h-18 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Settings className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">TechEquity Admin</h1>
        <p className="text-gray-600 text-lg">Scheduling Management Portal</p>
      </div>
      
      <form onSubmit={onLogin} className="space-y-6">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">Username</label>
          <input
            type="text"
            value={loginForm.username}
            onChange={(e) => onUpdateForm('username', e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            style={{ height: fieldHeight }}
            placeholder="Enter username"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) => onUpdateForm('password', e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            style={{ height: fieldHeight }}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg text-base"
          style={{ height: touchTargetSize }}
        >
          Sign In
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600 text-center font-medium">
          Demo credentials: <span className="font-mono text-gray-800">gabriel / admin123</span>
        </p>
      </div>
    </div>
  </div>
);

// Desktop: Traditional centered form (original design)
const DesktopAuthForm = ({ loginForm, onLogin, onUpdateForm }: {
  loginForm: { username: string; password: string };
  onLogin: (e: React.FormEvent) => void;
  onUpdateForm: (field: "username" | "password", value: string) => void;
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">TechEquity Admin</h1>
        <p className="text-gray-600">Scheduling Management Portal</p>
      </div>
      
      <form onSubmit={onLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={loginForm.username}
            onChange={(e) => onUpdateForm('username', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter username"
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) => onUpdateForm('password', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </form>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        Demo credentials: gabriel / admin123
      </p>
    </div>
  </div>
);

export const AuthForm = ({ loginForm, onLogin, onUpdateForm }: AuthFormProps) => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);
  const fieldHeight = getFormFieldHeight(deviceType);

  // Pass props to the static components
  const componentProps = {
    loginForm,
    onLogin,
    onUpdateForm,
    touchTargetSize,
    fieldHeight
  };

  return (
    <ResponsiveWrapper
      mobile={<MobileAuthForm {...componentProps} />}
      tablet={<TabletAuthForm {...componentProps} />}
      desktop={<DesktopAuthForm {...componentProps} />}
    />
  );
};