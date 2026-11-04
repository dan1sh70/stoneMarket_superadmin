import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Building,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const LeadManagementPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminService.getLeads({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
      });
      setLeads(res.leads || (Array.isArray(res) ? res : []));
    } catch (err) {
      console.error('Failed to load leads', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [statusFilter, priorityFilter]);

  const handleStatusChange = async (leadId: string, nextStatus: string) => {
    try {
      await superAdminService.updateLeadStatus(leadId, nextStatus);
      setActionMessage(`Lead status updated to ${nextStatus}.`);
      loadLeads();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Status update failed.');
    }
  };

  const filtered = leads.filter((item) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const leadNo = item.lead_number?.toLowerCase() || '';
    const buyerName = item.buyer_id?.name?.toLowerCase() || '';
    const bizName = item.manufacturer_id?.company_name?.toLowerCase() || '';
    return leadNo.includes(term) || buyerName.includes(term) || bizName.includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Lead Management</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Enterprise conversion pipeline, stage transitions, and seller dispatch
          </p>
        </div>
        <button
          onClick={loadLeads}
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-surface-border shadow-card flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lead number, buyer, vendor..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-surface-border rounded-lg px-3 py-1.5 text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="in_discussion">In Discussion</option>
            <option value="quote_sent">Quote Sent</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-surface-border rounded-lg px-3 py-1.5 text-slate-700"
          >
            <option value="">All Priorities</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-surface-border uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Lead Number</th>
                <th className="py-3 px-4">Buyer Client</th>
                <th className="py-3 px-4">Assigned Vendor</th>
                <th className="py-3 px-4">Application / Urgency</th>
                <th className="py-3 px-4">Stage Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading platform leads...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No leads found in this filter range.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      {item.lead_number}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-text-primary">{item.buyer_id?.name || 'Industrial Buyer'}</p>
                      <p className="text-[10px] text-slate-400">{item.buyer_id?.mobile || '—'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-700">{item.manufacturer_id?.company_name || 'Assigned Vendor'}</p>
                      <p className="text-[10px] text-slate-400">{item.manufacturer_id?.phone || '—'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">{item.usage_application || 'Commercial Flooring'}</span>
                      <p className="text-[10px] text-slate-400">{item.urgency?.replace(/_/g, ' ')}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          item.lead_status === 'converted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.lead_status === 'new'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.lead_status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={item.lead_status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className="text-[11px] bg-slate-50 border border-surface-border rounded px-2 py-1 text-slate-700 font-medium"
                      >
                        <option value="new">New</option>
                        <option value="in_discussion">In Discussion</option>
                        <option value="quote_sent">Quote Sent</option>
                        <option value="converted">Mark Converted</option>
                        <option value="closed">Close Lead</option>
                      </select>
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

