import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  RefreshCw,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const ReportsAndComplaintsPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminService.getReports({
        status: statusFilter || undefined,
      });
      setReports(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const handleResolve = async (id: string, nextStatus: string) => {
    try {
      await superAdminService.updateReportStatus(id, nextStatus);
      setActionMessage(`Dispute / Ticket status updated to ${nextStatus}.`);
      loadReports();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Reports & Complaints</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Platform moderation, dispute resolution, counterfeit reports, and customer tickets
          </p>
        </div>
        <button
          onClick={loadReports}
          className="p-2 border border-surface-border bg-white rounded-lg text-slate-600 hover:text-primary transition-all text-xs font-semibold flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Grid of Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Loading reports & complaints...
          </div>
        ) : reports.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No unresolved complaints or dispute reports found.
          </div>
        ) : (
          reports.map((t) => (
            <div
              key={t._id}
              className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[11px] font-bold text-primary">
                    {t.ticket_number || t._id.slice(-6).toUpperCase()}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      t.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700'
                        : t.status === 'open'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {t.status?.replace(/_/g, ' ') || 'Open'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-text-primary line-clamp-1">{t.subject}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{t.description}</p>

                <div className="mt-3 pt-3 border-t border-surface-border text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium text-slate-800">{t.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reporter:</span>
                    <span className="font-medium text-slate-800">{t.userId?.name || 'Customer'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-surface-border">
                <button
                  onClick={() => handleResolve(t._id, 'resolved')}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleResolve(t._id, 'closed')}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Dismiss / Close
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

