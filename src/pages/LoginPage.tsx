import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Phone, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired') === '1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileOrEmail || !password) {
      setError('Please provide your admin identifier and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const isEmail = mobileOrEmail.includes('@');
      await login({
        [isEmail ? 'email' : 'mobile']: mobileOrEmail,
        password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-900 text-white shadow-lg mb-3">
            <Shield className="w-7 h-7 text-blue-500" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-xl font-extrabold tracking-wider text-navy-900">STONE MARKET</h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-red-600 text-white rounded">INDIA</span>
          </div>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mt-1">
            Super Admin Control Center
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-card border border-surface-border p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-text-primary">Administrative Sign In</h2>
            <p className="text-xs text-text-secondary mt-1">
              Authorized credentials required. Sensitive operations are fully logged.
            </p>
          </div>

          {isExpired && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">
                Admin Email or Mobile
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={mobileOrEmail}
                  onChange={(e) => setMobileOrEmail(e.target.value)}
                  placeholder="admin@mockstonemarket.com"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-text-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-60"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Secure Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-surface-border text-center space-y-2">
            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-slate-700 text-left">
              <p className="font-semibold text-primary">Demo Admin Credentials:</p>
              <p className="font-mono text-slate-600 mt-0.5">Email: <span className="font-bold text-slate-900">admin@mockstonemarket.com</span></p>
              <p className="font-mono text-slate-600">Password: <span className="font-bold text-slate-900">admin123</span></p>
            </div>
            <div className="inline-flex items-center space-x-1.5 text-[11px] text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>JWT Encrypted TLS Session</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-text-secondary mt-6">
          Stone Market India &copy; 2026. Enterprise Industrial Platform.
        </p>
      </div>
    </div>
  );
};

