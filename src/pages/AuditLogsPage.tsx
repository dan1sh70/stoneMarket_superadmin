import React, { useState, useEffect } from 'react';
import { FileText, ShieldAlert, RefreshCw } from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminService.getAuditLogs();
      setLogs(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to load logs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Audit Logs & Security Trail</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Immutable log of administrative operations, verification decisions, and status mutations
          </p>
        </div>
        <button
          onClick={loadLogs}
          className="p-2 border border-surface-border bg-white rounded-lg text-slate-600 hover:text-primary transition-all text-xs font-semibold flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-surface-border uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Admin Operator</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No administrative audit events recorded.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-navy-900">{log.action}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      <span className="uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">
                        {log.targetType}: {String(log.targetId).slice(-6)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">{log.adminId?.name || 'Super Admin'}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{log.ip || '127.0.0.1'}</td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

