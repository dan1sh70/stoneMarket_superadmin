import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  Shield,
  Key,
  CheckCircle,
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const AdminAndStaffPage: React.FC = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminService.getStaff();
      setStaff(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed to load staff', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await superAdminService.createStaff({
        name,
        email,
        mobile,
        password: password || 'StaffPass@2026'
      });
      setActionMessage('New administrative staff member registered.');
      setShowModal(false);
      setName('');
      setEmail('');
      setMobile('');
      setPassword('');
      loadStaff();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Creation failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Admin & Staff Management</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Role-based administrative privileges, verification officers, and team oversight
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Admin Officer</span>
          </button>
          <button
            onClick={loadStaff}
            className="p-1.5 border border-surface-border bg-white rounded-lg text-slate-600 hover:text-primary transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Loading administrative personnel...
          </div>
        ) : staff.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No administrative staff records.
          </div>
        ) : (
          staff.map((member) => (
            <div
              key={member._id}
              className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  {member.name ? member.name[0] : 'A'}
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-bold text-text-primary truncate">{member.name}</h3>
                  <div className="flex items-center space-x-1 text-[11px] text-amber-600 font-semibold mt-0.5">
                    <Shield className="w-3 h-3" />
                    <span>Administrator</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">{member.email || member.mobile}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="font-semibold text-slate-800 uppercase">Super Admin Staff</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-emerald-600">Active Access</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-surface-border">
            <h3 className="text-base font-bold text-text-primary mb-1">Add Administrative Staff</h3>
            <p className="text-xs text-text-secondary mb-4">
              Provision administrative access credentials for officers and support staff
            </p>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikramaditya Rathore"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer@stonemarketindia.com"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Mobile Number</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98290XXXXX"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Default Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="StaffPass@2026"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-surface-border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

