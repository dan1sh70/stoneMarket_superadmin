import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  Info,
  Calendar,
  Lock,
  FileText,
  Building,
  HelpCircle
} from 'lucide-react';
import apiClient from '../services/apiClient';

export const DeleteMyAccountPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [reason, setReason] = useState('');
  const [confirmUnderstand, setConfirmUnderstand] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      alert('Please enter your registered mobile number or email address.');
      return;
    }
    if (!confirmUnderstand) {
      alert('Please confirm that you understand the permanent consequences of deleting your account.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await apiClient.post('/app/delete-account-request', {
        identifier: identifier.trim(),
        reason: reason.trim(),
        confirmUnderstand
      }).catch(() => apiClient.post('/v1/app/delete-account-request', {
        identifier: identifier.trim(),
        reason: reason.trim(),
        confirmUnderstand
      }));

      const data = res.data?.data || res.data;
      setSuccessData(data);
    } catch (err: any) {
      console.error('Account deletion submission error', err);
      setErrorMessage(
        err?.response?.data?.message ||
        'Failed to submit deletion request. Please check your details or contact support.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-surface-border sticky top-0 z-20 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white">
              SM
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-extrabold text-xs tracking-wider uppercase text-slate-900">STONE MARKET</span>
              <span className="text-[9px] font-bold px-1 py-0.2 bg-red-600 text-white rounded">INDIA</span>
            </div>
          </Link>

          <span className="text-[11px] font-semibold text-slate-500">
            Google Play Data Safety Portal
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-surface-border shadow-sm p-6 sm:p-10">
          {/* Top Title Banner */}
          <div className="border-b border-slate-100 pb-6 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Delete My Stone Market Account & Data
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
              In compliance with Google Play Store User Data policies, users can request complete deletion of their account, registered company profile, catalog products, and personal data.
            </p>
          </div>

          {successData ? (
            /* Successful Submission View */
            <div className="space-y-6 py-4 animate-fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Deletion Request Received</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Your request for <strong>{successData.identifier}</strong> has been logged in our system under Reference ID:
                  </p>
                  <code className="text-xs font-mono font-bold bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-200 mt-1.5 inline-block">
                    {successData.request_id}
                  </code>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-surface-border text-xs text-slate-600 space-y-2">
                <div className="flex items-center space-x-2 text-slate-800 font-bold">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>7-Day Grace Period Scheduled</span>
                </div>
                <p>
                  Your account status has been suspended from public marketplace visibility. Complete deletion of all personal identifiers, GST certificates, and listed stone catalogues is scheduled for:
                </p>
                <p className="font-semibold text-slate-900 text-sm">
                  {new Date(successData.scheduled_deletion_date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                </p>
                <p className="text-[11px] text-slate-400">
                  If this request was made by mistake, please contact support@stonemarketindia.com before this date to cancel the deletion.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Deletion Request Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Data Purge Disclosure Box */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2.5 text-xs text-amber-900">
                <div className="flex items-center space-x-2 font-bold text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>What data will be permanently removed?</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800">
                  <li>Your user login credentials, mobile number, and password hashes</li>
                  <li>Business Profile, factory details, quarry licenses, and GST certificates</li>
                  <li>All uploaded natural stone products, gangsaw machinery, and spare catalog listings</li>
                  <li>Inquiry history, buyer lead responses, and active chat logs</li>
                  <li>Push notification device tokens and session records</li>
                </ul>
              </div>

              {/* Input: Mobile or Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block">
                  Registered Mobile Number or Email Address *
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or user@company.com"
                  className="w-full text-xs font-mono bg-slate-50 border border-surface-border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-red-500"
                />
                <span className="text-[11px] text-slate-400 block">
                  Must match the mobile number or email used when registering on Stone Market India app.
                </span>
              </div>

              {/* Input: Optional Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Reason for leaving (Optional)
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:bg-white"
                >
                  <option value="">Select a reason</option>
                  <option value="No longer in the stone/granite business">No longer in the stone/granite business</option>
                  <option value="Duplicate account created">Duplicate account created</option>
                  <option value="Privacy concerns">Privacy concerns</option>
                  <option value="App is too complicated">App is too complicated</option>
                  <option value="Other reasons">Other reasons</option>
                </select>
              </div>

              {/* Confirmation Checkbox */}
              <div className="pt-2">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmUnderstand}
                    onChange={(e) => setConfirmUnderstand(e.target.checked)}
                    className="mt-0.5 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I understand that deleting my account is irreversible. Once deleted, my business listing cannot be recovered and I will need to register a new account to access Stone Market India.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  to="/"
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel & Go Back
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting || !confirmUnderstand}
                  className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition shadow-sm disabled:opacity-40 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Request...' : 'Submit Account Deletion Request'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Policy Information Footer */}
          <div className="mt-10 pt-6 border-t border-slate-100 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Stone Market India Data Governance & Privacy Compliance</span>
            <Link to="/pages/privacy-policy" className="text-primary hover:underline font-medium">
              Read Full Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
