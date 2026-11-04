import React, { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw, Clock, ArrowRight } from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const InquiryManagementPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminService.getInquiries();
      setInquiries(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to load inquiries', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Inquiry Management</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Real-time stone buyer inquiries, quotes requested, and dispatch leads
          </p>
        </div>
        <button
          onClick={loadInquiries}
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
                <th className="py-3 px-4">Ref Number</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Subject & Specs</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading inquiries...
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No active inquiries recorded.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      {inq.reference_number || inq._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{inq.category || 'Granite Slabs'}</td>
                    <td className="py-3 px-4 font-semibold text-text-primary line-clamp-1">
                      {inq.subject || inq.message || inq.requirements || 'Gangsaw cut requirement'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {inq.quantity ? `${inq.quantity} ${inq.unit || 'Sq.ft'}` : 'Bulk Request'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {inq.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {new Date(inq.createdAt).toLocaleDateString()}
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

