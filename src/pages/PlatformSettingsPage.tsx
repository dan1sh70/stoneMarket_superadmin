import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  ShieldAlert
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const PlatformSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    app_name: 'Stone Market India',
    app_version: '1.0.0',
    min_supported_version: '1.0.0',
    support_email: 'support@stonemarketindia.com',
    support_phone: '+91 9999999999',
    privacy_policy_url: 'https://stonemarketindia.com/privacy-policy',
    terms_and_conditions_url: 'https://stonemarketindia.com/terms-and-conditions'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminService.getPlatformSettings();
      if (res) {
        setSettings({
          app_name: res.app_name || 'Stone Market India',
          app_version: res.app_version || '1.0.0',
          min_supported_version: res.min_supported_version || '1.0.0',
          support_email: res.support_email || 'support@stonemarketindia.com',
          support_phone: res.support_phone || '+91 9999999999',
          privacy_policy_url: res.privacy_policy_url || 'https://stonemarketindia.com/privacy-policy',
          terms_and_conditions_url: res.terms_and_conditions_url || 'https://stonemarketindia.com/terms-and-conditions'
        });
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await superAdminService.savePlatformSettings(settings);
      setActionMessage('Platform configuration saved successfully.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Platform Settings</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Global application parameters, support hotlines, legal policies, and client app version gates
          </p>
        </div>
        <button
          onClick={loadSettings}
          className="p-1.5 border border-surface-border bg-white rounded-lg text-slate-600 hover:text-primary transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-surface-border shadow-card p-6 space-y-6 max-w-4xl">
        <div>
          <h3 className="text-sm font-bold text-text-primary mb-1">General Application Identity</h3>
          <p className="text-xs text-text-secondary mb-4">Branding details presented to industrial users</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={settings.app_name}
                onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Production App Version</label>
              <input
                type="text"
                value={settings.app_version}
                onChange={(e) => setSettings({ ...settings, app_version: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-border">
          <h3 className="text-sm font-bold text-text-primary mb-1">Support & Escalation Hotlines</h3>
          <p className="text-xs text-text-secondary mb-4">Official channels shown on invoices and support screens</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Customer Support Email</label>
              <input
                type="email"
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Support Telephone Hotline</label>
              <input
                type="text"
                value={settings.support_phone}
                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-border">
          <h3 className="text-sm font-bold text-text-primary mb-1">Compliance & Legal URLs</h3>
          <p className="text-xs text-text-secondary mb-4">Published policies for platform terms and customer protection</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Privacy Policy URL</label>
              <input
                type="url"
                value={settings.privacy_policy_url}
                onChange={(e) => setSettings({ ...settings, privacy_policy_url: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Terms & Conditions URL</label>
              <input
                type="url"
                value={settings.terms_and_conditions_url}
                onChange={(e) => setSettings({ ...settings, terms_and_conditions_url: e.target.value })}
                className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-surface-border flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Configurations...' : 'Save Platform Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

