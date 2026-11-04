import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const BusinessManagementPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bTypeFilter, setBTypeFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadBusinesses = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminService.getBusinesses({
        business_type: bTypeFilter || undefined,
        is_verified: verifiedFilter ? verifiedFilter === 'true' : undefined,
      });
      setBusinesses(Array.isArray(data) ? data : data.data?.businesses || data.data || []);
    } catch (err) {
      console.error('Failed to load businesses', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, [bTypeFilter, verifiedFilter]);

  const handleVerifyToggle = async (bizId: string, currentStatus: boolean) => {
    try {
      await superAdminService.verifyBusiness(bizId, {
        gstVerified: !currentStatus,
        documentsVerified: !currentStatus,
      });
      setActionMessage(`Business verification status updated.`);
      loadBusinesses();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Verification update failed.');
    }
  };

  const filtered = businesses.filter((b) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const name = b.company_name || b.businessName || '';
    const phone = b.phone || b.mobile || '';
    return name.toLowerCase().includes(term) || phone.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Business Management</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Oversight of all 11+ registered industrial enterprise profiles, compliance, and verification
          </p>
        </div>
        <button
          onClick={loadBusinesses}
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
            placeholder="Search business name, phone, GST..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={bTypeFilter}
            onChange={(e) => setBTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-surface-border rounded-lg px-3 py-1.5 text-slate-700"
          >
            <option value="">All Business Types</option>
            <option value="machine_manufacturer">Machine Manufacturer</option>
            <option value="powder_supplier">Mineral & Powder Supplier</option>
            <option value="diamond_blades">Diamond Blades & Segments</option>
            <option value="hydro_crane">Hydro & Heavy Crane Service</option>
            <option value="machine_repairing">Machine Repairing</option>
            <option value="electrical_panel">Electrical Panel & Repairing</option>
            <option value="water_supplier">Water Supplier</option>
            <option value="ca_tax_advisor">CA & Tax Advisor</option>
            <option value="banking_loan">Banking & Loan Services</option>
            <option value="hotel_restaurant">Hotel & Restaurant</option>
            <option value="solar_solutions">Industrial Solar Solutions</option>
            <option value="manufacturer">Stone Manufacturer</option>
            <option value="mining">Quarry & Mining</option>
            <option value="showroom">Showroom</option>
            <option value="trader">Stone Trader</option>
            <option value="buyer">Stone Buyer</option>
          </select>

          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-surface-border rounded-lg px-3 py-1.5 text-slate-700"
          >
            <option value="">All Verification</option>
            <option value="true">Verified Only</option>
            <option value="false">Unverified / Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-surface-border uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Business Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">GST Number</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading registered businesses...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No registered businesses found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const name = b.company_name || b.businessName || 'Unnamed Enterprise';
                  const bType = b.business_type || b.businessType || 'General Business';
                  const isVerified = b.is_verified || b.badges?.verified;
                  const gst = b.gst_number || b.gstNumber || 'Not Provided';
                  const city = b.address?.district || b.city || 'Rajasthan';

                  return (
                    <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-text-primary">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-md bg-navy-900/10 flex items-center justify-center font-bold text-xs text-navy-900">
                            {name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-text-primary">{name}</p>
                            <p className="text-[10px] text-slate-400">Owner: {b.phone || b.email || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {bType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{city}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">{gst}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isVerified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isVerified ? (
                            <>
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-3 h-3" />
                              <span>Pending</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleVerifyToggle(b._id, isVerified)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                            isVerified
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {isVerified ? 'Revoke Verification' : 'Verify Now'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

