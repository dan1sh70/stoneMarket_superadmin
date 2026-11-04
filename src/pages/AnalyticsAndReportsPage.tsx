import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  MapPin,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { superAdminService } from '../services/superAdminService';

const MONTHLY_THROUGHPUT = [
  { month: 'Jun', inquiries: 120, leads: 45, conversions: 18 },
  { month: 'Jul', inquiries: 160, leads: 65, conversions: 28 },
  { month: 'Aug', inquiries: 210, leads: 95, conversions: 42 },
  { month: 'Sep', inquiries: 280, leads: 130, conversions: 60 },
  { month: 'Oct', inquiries: 340, leads: 180, conversions: 85 },
  { month: 'Nov', inquiries: 420, leads: 220, conversions: 110 },
];

export const AnalyticsAndReportsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await superAdminService.getDashboardAnalytics();
        setStats(res);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stateData = (stats?.stateDistribution || []).map((s: any) => ({
    state: s._id || 'Rajasthan',
    count: s.count
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Analytics & Platform Reports</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Cross-cluster transaction volume, inquiries funnel, and regional stone adoption
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 border border-surface-border bg-white rounded-lg text-slate-700 hover:text-primary transition-all text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card">
          <p className="text-xs font-semibold text-text-secondary">Total Sourcing Funnel Volume</p>
          <h3 className="text-2xl font-extrabold text-navy-900 mt-1">₹4.82 Cr</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +32% Quarter over Quarter
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card">
          <p className="text-xs font-semibold text-text-secondary">Average Quote Turnaround</p>
          <h3 className="text-2xl font-extrabold text-navy-900 mt-1">3.4 Hours</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> 18% Faster Seller Response
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card">
          <p className="text-xs font-semibold text-text-secondary">Inquiry-to-Lead Conversion</p>
          <h3 className="text-2xl font-extrabold text-navy-900 mt-1">42.6%</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> High Intent Verified Traffic
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card">
          <h3 className="text-sm font-bold text-text-primary mb-1">Inquiry Funnel Velocity</h3>
          <p className="text-xs text-text-secondary mb-4">Inquiries vs Leads generated vs Order Conversions</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_THROUGHPUT}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="inquiries" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2} />
                <Area type="monotone" dataKey="leads" stroke="#10B981" fill="#E6F8EF" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card">
          <h3 className="text-sm font-bold text-text-primary mb-1">Regional Enterprise Density</h3>
          <p className="text-xs text-text-secondary mb-4">State-wise distribution of verified stone businesses</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData.length ? stateData : [{ state: 'Rajasthan', count: 31 }]}>
                <XAxis dataKey="state" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#102B4C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

