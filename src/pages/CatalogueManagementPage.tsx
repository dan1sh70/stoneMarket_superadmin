import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  Tag,
  DollarSign
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';
import { ProductListing } from '../types';

export const CatalogueManagementPage: React.FC = () => {
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminService.getListings({
        status: statusFilter || undefined,
      });
      setListings(Array.isArray(data) ? data : data.data?.items || data.data || []);
    } catch (err) {
      console.error('Failed to load listings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently from the catalogue?')) {
      return;
    }
    try {
      await superAdminService.deleteListing(id);
      setActionMessage('Listing deleted successfully.');
      loadListings();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Delete operation failed.');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await superAdminService.updateListingStatus(id, nextStatus);
      setActionMessage(`Listing status updated to ${nextStatus}.`);
      loadListings();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Status update failed.');
    }
  };

  const filtered = listings.filter((item) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term) ||
      item.sku?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Catalogue & Listings</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Administer and moderate product, machinery, and equipment listings across all sectors
          </p>
        </div>
        <button
          onClick={loadListings}
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

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-surface-border shadow-card flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU, category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-surface-border rounded-lg px-3 py-1.5 text-slate-700 w-full sm:w-auto"
        >
          <option value="">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Drafts</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 border-b border-surface-border uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Price / Unit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading catalogue records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No matching listings found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const price = item.selling_price || item.price || 0;
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-text-primary">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                            <Package className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-text-primary line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-slate-400">
                              Sector: {item.business_type?.replace(/_/g, ' ') || 'Industrial'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{item.category || 'General'}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{item.sku || 'CAT-AUTO'}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Contact for Quote'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {item.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleStatusToggle(item._id, item.status || 'active')}
                          className="text-[11px] font-semibold text-primary hover:underline"
                        >
                          {item.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
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

