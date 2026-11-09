import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Save,
  CheckCircle,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  ShieldAlert,
  Sparkles,
  Eye,
  EyeOff,
  Cloud,
  MessageSquare,
  Lock,
  Layers,
  Cpu,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const PlatformSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'keys'>('general');

  // General Settings State
  const [settings, setSettings] = useState<any>({
    app_name: 'Stone Market India',
    app_version: '1.0.0',
    min_supported_version: '1.0.0',
    support_email: 'support@stonemarketindia.com',
    support_phone: '+91 9999999999',
    privacy_policy_url: 'https://stonemarketindia.com/privacy-policy',
    terms_and_conditions_url: 'https://stonemarketindia.com/terms-and-conditions'
  });

  // API Keys Section State
  const [apiKeys, setApiKeys] = useState<any>({
    gemini_api_key: '',
    google_vision_api_key: '',
    google_maps_api_key: '',
    aws_access_key: '',
    aws_secret_key: '',
    aws_s3_bucket: '',
    aws_region: 'ap-south-1',
    twilio_account_sid: '',
    twilio_auth_token: '',
    twilio_phone_number: ''
  });

  // Public/App view of keys
  const [publicAppKeys, setPublicAppKeys] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Password / Secret visibility toggles
  const [showGemini, setShowGemini] = useState(false);
  const [showAwsSecret, setShowAwsSecret] = useState(false);
  const [showTwilioToken, setShowTwilioToken] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, keysRes, publicRes] = await Promise.all([
        superAdminService.getPlatformSettings().catch(() => null),
        superAdminService.getApiKeys().catch(() => null),
        superAdminService.getGeneralPublicKeys().catch(() => null)
      ]);

      if (settingsRes) {
        setSettings({
          app_name: settingsRes.app_name || 'Stone Market India',
          app_version: settingsRes.app_version || '1.0.0',
          min_supported_version: settingsRes.min_supported_version || '1.0.0',
          support_email: settingsRes.support_email || 'support@stonemarketindia.com',
          support_phone: settingsRes.support_phone || '+91 9999999999',
          privacy_policy_url: settingsRes.privacy_policy_url || 'https://stonemarketindia.com/privacy-policy',
          terms_and_conditions_url: settingsRes.terms_and_conditions_url || 'https://stonemarketindia.com/terms-and-conditions'
        });
      }

      if (keysRes) {
        setApiKeys({
          gemini_api_key: keysRes.gemini_api_key || '',
          google_vision_api_key: keysRes.google_vision_api_key || '',
          google_maps_api_key: keysRes.google_maps_api_key || '',
          aws_access_key: keysRes.aws_access_key || '',
          aws_secret_key: keysRes.aws_secret_key || '',
          aws_s3_bucket: keysRes.aws_s3_bucket || '',
          aws_region: keysRes.aws_region || 'ap-south-1',
          twilio_account_sid: keysRes.twilio_account_sid || '',
          twilio_auth_token: keysRes.twilio_auth_token || '',
          twilio_phone_number: keysRes.twilio_phone_number || ''
        });
      }

      if (publicRes) {
        setPublicAppKeys(publicRes);
      }
    } catch (err) {
      console.error('Failed to load settings & API keys', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await superAdminService.savePlatformSettings(settings);
      setActionMessage('General platform configuration saved successfully.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await superAdminService.saveApiKeys(apiKeys);
      setActionMessage('API keys updated in database. Vision OCR & services will use updated credentials.');
      loadData();
      setTimeout(() => setActionMessage(null), 3500);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save API keys.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Platform Settings & Credentials</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Configure application parameters, AI Vision API keys, maps, cloud storage, and client app endpoints
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-1.5 border border-surface-border bg-white rounded-lg text-slate-600 hover:text-primary transition-all self-start sm:self-auto"
          title="Reload configurations"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-fade-in shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-surface-border space-x-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 text-xs font-bold transition-all relative flex items-center space-x-2 ${
            activeTab === 'general'
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>General Application Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('keys')}
          className={`pb-3 text-xs font-bold transition-all relative flex items-center space-x-2 ${
            activeTab === 'keys'
              ? 'text-primary border-b-2 border-primary'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Key className="w-4 h-4 text-purple-600" />
          <span>API Keys Section</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700">
            AI & Integrations
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: GENERAL APP SETTINGS */}
      {/* ========================================================= */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white rounded-2xl border border-surface-border shadow-card p-6 space-y-6 max-w-4xl">
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
              <span>{isSaving ? 'Saving Configurations...' : 'Save General Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 2: API KEYS SECTION (AI, MAPS, CLOUD, SMS) */}
      {/* ========================================================= */}
      {activeTab === 'keys' && (
        <div className="space-y-6 max-w-4xl">
          {/* General API Info Card */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-blue-100 text-primary shrink-0 mt-0.5">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">General Public API for Apps</h4>
                <p className="text-slate-600 mt-0.5">
                  Client apps and mobile frontends use endpoint: <strong className="font-mono text-primary bg-white px-1.5 py-0.5 rounded border border-blue-200">GET /api/v1/app/keys</strong>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Public endpoints safely serve public client keys (like Google Maps & AI availability status) without exposing secret backend credentials.
                </p>
              </div>
            </div>
            {publicAppKeys && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                ● Status: Active & Syncing
              </span>
            )}
          </div>

          <form onSubmit={handleSaveKeys} className="bg-white rounded-2xl border border-surface-border shadow-card p-6 space-y-6">
            {/* 1. AI & Vision API Keys */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-text-primary">Artificial Intelligence & Vision Models</h3>
              </div>
              <p className="text-xs text-text-secondary mb-4">
                Powers Model A (Stone Similarity Matching) and Model B (Measurement Slip OCR Parsing)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Gemini Vision API Key (Recommended)
                  </label>
                  <div className="relative">
                    <input
                      type={showGemini ? 'text' : 'password'}
                      value={apiKeys.gemini_api_key}
                      onChange={(e) => setApiKeys({ ...apiKeys, gemini_api_key: e.target.value })}
                      placeholder="AIzaSy..."
                      className="w-full text-xs font-mono bg-slate-50 border border-surface-border rounded-xl pl-3 pr-10 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGemini(!showGemini)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showGemini ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Used by gemini-2.5-flash for stone visual matching and slip OCR</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Google Cloud Vision API Key (Optional)
                  </label>
                  <input
                    type="text"
                    value={apiKeys.google_vision_api_key}
                    onChange={(e) => setApiKeys({ ...apiKeys, google_vision_api_key: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full text-xs font-mono bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Fallback OCR provider if Gemini key is not configured</span>
                </div>
              </div>
            </div>

            {/* 2. Google Maps API Key */}
            <div className="pt-4 border-t border-surface-border">
              <div className="flex items-center space-x-2 mb-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-text-primary">Google Maps & Geolocation</h3>
              </div>
              <p className="text-xs text-text-secondary mb-4">
                Required for GPS location pin, nearby stone mandi searches, and radius clustering in apps
              </p>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Google Maps API Key (Public Client Key)
                </label>
                <input
                  type="text"
                  value={apiKeys.google_maps_api_key}
                  onChange={(e) => setApiKeys({ ...apiKeys, google_maps_api_key: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full text-xs font-mono bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Synchronized with general public app endpoint: <code className="bg-slate-100 px-1 rounded">/api/v1/app/keys</code>
                </span>
              </div>
            </div>

            {/* 3. AWS S3 Storage Credentials */}
            <div className="pt-4 border-t border-surface-border">
              <div className="flex items-center space-x-2 mb-1">
                <Cloud className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-text-primary">Amazon Web Services (AWS S3) Storage</h3>
              </div>
              <p className="text-xs text-text-secondary mb-4">
                Handles product images, quarry photos, verification PDFs, and estimate documents
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">AWS Access Key ID</label>
                  <input
                    type="text"
                    value={apiKeys.aws_access_key}
                    onChange={(e) => setApiKeys({ ...apiKeys, aws_access_key: e.target.value })}
                    placeholder="AKIA..."
                    className="w-full text-xs font-mono bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">AWS Secret Access Key</label>
                  <div className="relative">
                    <input
                      type={showAwsSecret ? 'text' : 'password'}
                      value={apiKeys.aws_secret_key}
                      onChange={(e) => setApiKeys({ ...apiKeys, aws_secret_key: e.target.value })}
                      placeholder="••••••••••••••••••••••••••••••"
                      className="w-full text-xs font-mono bg-slate-50 border border-surface-border rounded-xl pl-3 pr-10 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAwsSecret(!showAwsSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showAwsSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">S3 Bucket Name</label>
                  <input
                    type="text"
                    value={apiKeys.aws_s3_bucket}
                    onChange={(e) => setApiKeys({ ...apiKeys, aws_s3_bucket: e.target.value })}
                    placeholder="stone-market-media-bucket"
                    className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">AWS Region</label>
                  <input
                    type="text"
                    value={apiKeys.aws_region}
                    onChange={(e) => setApiKeys({ ...apiKeys, aws_region: e.target.value })}
                    placeholder="ap-south-1"
                    className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4. Twilio SMS OTP Gateway */}
            <div className="pt-4 border-t border-surface-border">
              <div className="flex items-center space-x-2 mb-1">
                <MessageSquare className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-text-primary">Twilio SMS Gateway (OTP Verification)</h3>
              </div>
              <p className="text-xs text-text-secondary mb-4">
                Sends one-time passwords (OTP) to Indian mobile numbers during enterprise registration
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Twilio Account SID</label>
                  <input
                    type="text"
                    value={apiKeys.twilio_account_sid}
                    onChange={(e) => setApiKeys({ ...apiKeys, twilio_account_sid: e.target.value })}
                    placeholder="AC..."
                    className="w-full text-xs font-mono bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Twilio Auth Token</label>
                  <div className="relative">
                    <input
                      type={showTwilioToken ? 'text' : 'password'}
                      value={apiKeys.twilio_auth_token}
                      onChange={(e) => setApiKeys({ ...apiKeys, twilio_auth_token: e.target.value })}
                      placeholder="••••••••••••••••••••••••••••••"
                      className="w-full text-xs font-mono bg-slate-50 border border-surface-border rounded-xl pl-3 pr-10 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTwilioToken(!showTwilioToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showTwilioToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Twilio Sender Number</label>
                  <input
                    type="text"
                    value={apiKeys.twilio_phone_number}
                    onChange={(e) => setApiKeys({ ...apiKeys, twilio_phone_number: e.target.value })}
                    placeholder="+1234567890"
                    className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-4 border-t border-surface-border flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Updating Credentials...' : 'Save API Keys to Database'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
