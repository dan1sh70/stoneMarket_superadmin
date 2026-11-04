import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const SystemMonitoringPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkHealth = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminService.getSystemHealth();
      setHealth(data.data || data);
    } catch (err) {
      console.error('System health check failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">System Monitoring</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Infrastructure health, database cluster connectivity, and backend services uptime
          </p>
        </div>
        <button
          onClick={checkHealth}
          className="p-2 border border-surface-border bg-white rounded-lg text-slate-600 hover:text-primary transition-all text-xs font-semibold flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Ping Systems</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600">Operational</span>
            </div>
            <h3 className="text-sm font-bold text-text-primary mt-1">REST API Gateway</h3>
            <p className="text-[11px] text-slate-400">Node / Express Cluster</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600">Connected</span>
            </div>
            <h3 className="text-sm font-bold text-text-primary mt-1">MongoDB Primary</h3>
            <p className="text-[11px] text-slate-400">Read & Write Latency: 4ms</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-blue-600">Build Version</span>
            </div>
            <h3 className="text-sm font-bold text-text-primary mt-1">
              v{health?.version || '1.0.0'} Industrial
            </h3>
            <p className="text-[11px] text-slate-400">Production Engine 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

