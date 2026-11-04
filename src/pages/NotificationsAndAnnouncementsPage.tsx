import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Trash2,
  CheckCircle,
  Clock,
  Radio,
  RefreshCw,
  Plus
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const NotificationsAndAnnouncementsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('industry_news');
  const [targetAudience, setTargetAudience] = useState('all');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminService.getAnnouncements();
      setNewsList(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed to load announcements', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await superAdminService.publishAnnouncement({
        title,
        content,
        type,
        targetAudience
      });
      setActionMessage('Announcement broadcast successfully published.');
      setShowModal(false);
      setTitle('');
      setContent('');
      loadAnnouncements();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Publishing failed.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this broadcast announcement?')) return;
    try {
      await superAdminService.deleteAnnouncement(id);
      setActionMessage('Announcement removed.');
      loadAnnouncements();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Notifications & Announcements</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Broadcast platform updates, exhibition alerts, and push notifications to stone vendors & buyers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Announcement</span>
          </button>
          <button
            onClick={loadAnnouncements}
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

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Loading broadcast alerts...
          </div>
        ) : newsList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No broadcast bulletins active.
          </div>
        ) : (
          newsList.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase">
                    {item.type?.replace(/_/g, ' ') || 'Notice'}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    Audience: {item.targetAudience}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-text-primary line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-3">{item.content}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-border text-[11px] text-slate-400">
                <span>{new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:text-red-700 font-medium flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-xl border border-surface-border">
            <h3 className="text-base font-bold text-text-primary mb-1">Compose Platform Broadcast</h3>
            <p className="text-xs text-text-secondary mb-4">
              Send notifications and announcements across mobile apps and web portals
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Bulletin Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Stonemart 2026 Jaipur Exhibition Live Registration"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Broadcast Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-slate-700"
                  >
                    <option value="industry_news">Industry News</option>
                    <option value="exhibition_alert">Exhibition Alert</option>
                    <option value="market_update">Market Update</option>
                    <option value="breaking_news">Breaking Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Target Audience</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 text-slate-700"
                  >
                    <option value="all">All Users</option>
                    <option value="vendors">Vendors / Sellers</option>
                    <option value="buyers">Stone Buyers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Content / Message</label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write message content..."
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-primary"
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
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

