// src/app/admin/components/ChatLogsTab/components/LeadManagement.tsx

'use client';

import { Star, Crown, TrendingUp } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper';
import { getTouchTargetSize } from '@/utils/deviceUtils';

export const LeadManagement = () => {
  const { type: deviceType } = useDeviceDetection();
  const touchTargetSize = getTouchTargetSize(deviceType);

  // Mobile: Simplified dashboard with essential metrics
  const MobileLeadManagement = () => (
    <>
      {/* Mobile Enhanced Lead Management Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Lead Management</h3>
            <p className="text-purple-100 text-sm">Premium Features - Full Version</p>
          </div>
        </div>
      </div>

      {/* Mobile Lead Dashboard - Simplified */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
        <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-4 text-center shadow-lg max-w-xs">
            <Crown className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h4 className="text-base font-semibold text-gray-700 mb-2">Premium Feature</h4>
            <p className="text-gray-600 mb-3 text-sm">Lead scoring available in full version</p>
            <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Lead Dashboard</h3>
            <p className="text-gray-300 text-sm">Essential lead metrics</p>
          </div>

          {/* Mobile Essential Metrics - Single Column */}
          <div className="space-y-3 mb-4">
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 p-3 rounded-lg border border-red-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-red-300">Hot Leads</span>
                  </div>
                  <div className="text-xl font-bold text-red-400">--</div>
                </div>
                <div className="text-xs text-red-400">Score 80+</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 p-3 rounded-lg border border-yellow-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-300">Warm</span>
                  </div>
                  <div className="text-xl font-bold text-yellow-400">--</div>
                </div>
                <div className="text-xs text-yellow-400">Score 50+</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 p-3 rounded-lg border border-green-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-3 h-3 text-green-400" />
                    <span className="text-sm font-medium text-green-300">Conversion</span>
                  </div>
                  <div className="text-xl font-bold text-green-400">--.-%</div>
                </div>
                <div className="text-xs text-green-400">30 days</div>
              </div>
            </div>
          </div>

          {/* Mobile Recent Activity - Simplified List */}
          <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg">
            <div className="bg-slate-600/60 px-3 py-2 border-b border-slate-600/60">
              <h4 className="font-medium text-gray-200 text-sm">Recent Activity</h4>
            </div>
            <div className="divide-y divide-slate-600/50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-300 text-sm truncate">--- ----</div>
                    <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-gray-400">--</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400 truncate">--@----.---</div>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-slate-600/60 text-gray-400 flex-shrink-0">
                      ---
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Tablet: Condensed dashboard
  const TabletLeadManagement = () => (
    <>
      {/* Tablet Enhanced Lead Management Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Enhanced Lead Management</h3>
            <p className="text-purple-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>

      {/* Tablet Lead Scoring Dashboard - Condensed */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
        <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-5 text-center shadow-lg">
            <Crown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-4 max-w-md">Lead scoring and qualification dashboard available in the full version</p>
            <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-white">Lead Scoring Dashboard</h3>
              <p className="text-gray-300 text-sm">Automatic qualification and temperature tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-300">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                <span>-- qualified leads</span>
              </div>
            </div>
          </div>

          {/* Tablet Lead Scoring Metrics - Two columns */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 p-4 rounded-lg border border-red-800/40">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-300">Hot Leads</span>
              </div>
              <div className="text-xl font-bold text-red-400">--</div>
              <div className="text-xs text-red-400">Score 80-100</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 p-4 rounded-lg border border-yellow-800/40">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-300">Warm Leads</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">--</div>
              <div className="text-xs text-yellow-400">Score 50-79</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 p-4 rounded-lg border border-blue-800/40">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-300">Cold Leads</span>
              </div>
              <div className="text-xl font-bold text-blue-400">--</div>
              <div className="text-xs text-blue-400">Score 0-49</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 p-4 rounded-lg border border-green-800/40">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">Conversion Rate</span>
              </div>
              <div className="text-xl font-bold text-green-400">--.-%</div>
              <div className="text-xs text-green-400">Last 30 days</div>
            </div>
          </div>

          {/* Tablet Lead Qualification Table - Condensed */}
          <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg overflow-hidden">
            <div className="bg-slate-600/60 px-4 py-3 border-b border-slate-600/60">
              <h4 className="font-medium text-gray-200">Recent Lead Activity</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-600/40">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase">Contact</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase">Score</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/50">
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="hover:bg-slate-600/30">
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-300 text-sm">--- ----</div>
                        <div className="text-xs text-gray-400">--@----.---</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="w-7 h-7 bg-slate-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-400">--</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-slate-600/60 text-gray-400">
                          ---
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-400">-- min ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Desktop: Full dashboard with all features
  const DesktopLeadManagement = () => (
    <>
      {/* Desktop Enhanced Lead Management Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Enhanced Lead Management</h3>
            <p className="text-purple-100">Premium Features - Available in Full Version</p>
          </div>
        </div>
      </div>

      {/* Desktop Lead Scoring & Qualification Dashboard - Full Features */}
      <div className="bg-gradient-to-br from-slate-800/90 via-red-900/10 to-slate-700/90 backdrop-blur-sm rounded-xl shadow-xl border border-slate-600/50 relative overflow-hidden opacity-75">
        <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center z-10">
          <div className="bg-white border-2 border-gray-300 rounded-xl p-6 text-center shadow-lg">
            <Crown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Feature</h3>
            <p className="text-gray-600 mb-4 max-w-md">Lead scoring and qualification dashboard available in the full version</p>
            <span className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Coming Soon</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Lead Scoring Dashboard</h3>
              <p className="text-gray-300 mt-1">Automatic qualification and temperature tracking</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-300">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                <span>-- qualified leads this week</span>
              </div>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Export Report
              </button>
            </div>
          </div>

          {/* Desktop Lead Scoring Metrics - Four columns */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 p-4 rounded-lg border border-red-800/40">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-300">Hot Leads</span>
              </div>
              <div className="text-2xl font-bold text-red-400">--</div>
              <div className="text-xs text-red-400">Score 80-100</div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 p-4 rounded-lg border border-yellow-800/40">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-yellow-300">Warm Leads</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400">--</div>
              <div className="text-xs text-yellow-400">Score 50-79</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 p-4 rounded-lg border border-blue-800/40">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-300">Cold Leads</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">--</div>
              <div className="text-xs text-blue-400">Score 0-49</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 p-4 rounded-lg border border-green-800/40">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">Conversion Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-400">--.-%</div>
              <div className="text-xs text-green-400">Last 30 days</div>
            </div>
          </div>

          {/* Desktop Lead Qualification Table - Full Features */}
          <div className="bg-slate-700/60 border border-slate-600/60 rounded-lg overflow-hidden">
            <div className="bg-slate-600/60 px-4 py-3 border-b border-slate-600/60">
              <h4 className="font-medium text-gray-200">Recent Lead Activity</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-600/40">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Temperature</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Indicators</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/50">
                  {[1, 2, 3].map((i) => (
                    <tr key={i} className="hover:bg-slate-600/30">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-300">--- ----</div>
                        <div className="text-sm text-gray-400">--@----.---</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-400">--</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-600/60 text-gray-400">
                          ---
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 text-xs bg-slate-600/60 text-gray-400 rounded">------</span>
                          <span className="px-2 py-1 text-xs bg-slate-600/60 text-gray-400 rounded">---</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">-- min ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ResponsiveWrapper
      mobile={<MobileLeadManagement />}
      tablet={<TabletLeadManagement />}
      desktop={<DesktopLeadManagement />}
    />
  );
};