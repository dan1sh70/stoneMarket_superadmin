import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const VerificationCenterPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadPending = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminService.getBusinesses();
      const list = Array.isArray(data) ? data : data.data?.businesses || data.data || [];
      // Surface unverified records first
      list.sort((a: any, b: any) => (a.is_verified === b.is_verified ? 0 : a.is_verified ? 1 : -1));
      setBusinesses(list);
    } catch (err) {
      console.error('Failed to load pending verifications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await superAdminService.verifyBusiness(id, {
        is_verified: true,
        verification_status: 'approved',
        gstVerified: true,
        documentsVerified: true,
      });
      setActionMessage('Enterprise verification approved and badge issued.');
      loadPending();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Approval failed.');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await superAdminService.verifyBusiness(id, {
        is_verified: false,
        verification_status: 'rejected',
        gstVerified: false,
        documentsVerified: false,
      });
      setActionMessage('Verification status revoked.');
      loadPending();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Rejection failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Verification Center</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Audit and approve GST registrations, trade certificates, and enterprise credentials
          </p>
        </div>
        <button
          onClick={loadPending}
          className="p-2 border border-surface-border bg-white rounded-lg text-slate-600 hover:text-primary transition-all text-xs font-semibold flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Loading verification queue...
          </div>
        ) : businesses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No enterprises requiring verification review.
          </div>
        ) : (
          businesses.slice(0, 9).map((b) => {
            const name = b.company_name || b.businessName || 'Industrial Vendor';
            const gst = b.gst_number || b.gstNumber || 'Not Uploaded';
            const verified = b.is_verified || b.badges?.verified;
            return (
              <div
                key={b._id}
                className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {(b.business_type || 'industrial').replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {verified ? 'Verified' : 'Pending Review'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-text-primary line-clamp-1">{name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Location: {b.address?.state || 'Rajasthan, India'}</p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">GST Registration:</span>
                      <span className="font-mono font-semibold text-slate-800">{gst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Document Type:</span>
                      <span className="font-medium text-slate-700">GST Certificate & Aadhaar</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-surface-border">
                  <button
                    onClick={() => handleApprove(b._id)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(b._id)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

