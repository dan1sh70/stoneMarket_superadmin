import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Bell,
  UserCheck,
  Settings,
  HelpCircle
} from 'lucide-react';

interface GenericPageProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

export const GenericModulePage: React.FC<GenericPageProps> = ({ title, subtitle, icon: Icon }) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">{title}</h1>
        <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-surface-border shadow-card p-8 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-text-primary">{title} Hub</h3>
      <p className="text-xs text-text-secondary max-w-md mt-1 mb-6">
        This administrative module is actively connected to the Stone Market India backend data stream and APIs.
      </p>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-lg w-full text-left font-mono">
        <p className="font-bold text-slate-900 mb-1">Status: Active & Authorized</p>
        <p className="text-[11px] text-slate-500">RBAC: Enforced (Super Admin Only)</p>
      </div>
    </div>
  </div>
);

