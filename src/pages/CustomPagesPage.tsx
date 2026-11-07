import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Globe,
  Clock,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Save,
  X,
  Sparkles,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

interface CustomPageItem {
  _id: string;
  title: string;
  slug: string;
  category: 'policy' | 'company' | 'legal' | 'support' | 'general';
  content: string;
  summary?: string;
  status: 'published' | 'draft' | 'archived';
  meta_title?: string;
  meta_description?: string;
  is_system?: boolean;
  published_at?: string;
  createdAt?: string;
  updatedAt?: string;
  updated_by?: {
    name?: string;
    email?: string;
  };
}

export const CustomPagesPage: React.FC = () => {
  const [pages, setPages] = useState<CustomPageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<'policy' | 'company' | 'legal' | 'support' | 'general'>('policy');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [isAutoSlug, setIsAutoSlug] = useState(true);

  // Preview Modal
  const [previewPage, setPreviewPage] = useState<CustomPageItem | null>(null);

  // Notifications
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const fetchPages = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await superAdminService.getCustomPages({
        search: search.trim() || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setPages(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load custom pages', err);
      setErrorMessage(err?.response?.data?.message || 'Could not fetch custom pages.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [categoryFilter, statusFilter]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPages();
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setCategory('policy');
    setSummary('');
    setContent('');
    setStatus('published');
    setMetaTitle('');
    setMetaDesc('');
    setIsAutoSlug(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (page: CustomPageItem) => {
    setEditingId(page._id);
    setTitle(page.title);
    setSlug(page.slug);
    setCategory(page.category);
    setSummary(page.summary || '');
    setContent(page.content);
    setStatus(page.status);
    setMetaTitle(page.meta_title || '');
    setMetaDesc(page.meta_description || '');
    setIsAutoSlug(false);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Auto-slug generator on title typing
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isAutoSlug && !editingId) {
      const genSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(genSlug);
    }
  };

  // Save Page (Create or Update)
  const handleSubmitPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both the page title and content.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      category,
      summary: summary.trim(),
      content: content.trim(),
      status,
      meta_title: metaTitle.trim() || title.trim(),
      meta_description: metaDesc.trim() || summary.trim()
    };

    try {
      if (editingId) {
        await superAdminService.updateCustomPage(editingId, payload);
        showNotice(`Custom page "${payload.title}" updated successfully!`);
      } else {
        await superAdminService.createCustomPage(payload);
        showNotice(`Custom page "${payload.title}" created & published!`);
      }
      setIsModalOpen(false);
      fetchPages();
    } catch (err: any) {
      console.error('Save page error', err);
      setErrorMessage(err?.response?.data?.message || 'Error occurred while saving page.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Status Toggle
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await superAdminService.toggleCustomPageStatus(id, nextStatus);
      showNotice(`Page status changed to ${nextStatus}.`);
      fetchPages();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update status.');
    }
  };

  // Delete Page
  const handleDeletePage = async (page: CustomPageItem) => {
    if (page.is_system) {
      alert('System policy pages (e.g., Privacy Policy, Terms) are protected. You can toggle them to "Draft" instead of deleting.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${page.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await superAdminService.deleteCustomPage(page._id);
      showNotice(`Page "${page.title}" deleted.`);
      fetchPages();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete page.');
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const copySlugToClipboard = (pageSlug: string) => {
    navigator.clipboard.writeText(`/pages/${pageSlug}`);
    setCopiedSlug(pageSlug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Custom Pages & Policy CMS</h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              MongoDB Live
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Create, edit, and publish custom static pages, terms of use, privacy policies, and public legal notices
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Page</span>
        </button>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, slug, or summary..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-surface-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition text-text-primary"
          />
        </form>

        <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto">
          {/* Category Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-slate-50 focus:outline-none focus:bg-white text-text-primary"
            >
              <option value="all">All Categories</option>
              <option value="policy">Policy & Privacy</option>
              <option value="legal">Legal & Terms</option>
              <option value="company">Company & About</option>
              <option value="support">Help & Support</option>
              <option value="general">General Custom Page</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-slate-50 focus:outline-none focus:bg-white text-text-primary"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Pages Table */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-surface-border text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Page Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading platform pages...</span>
                  </td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span>No custom pages found matching your filters.</span>
                  </td>
                </tr>
              ) : (
                pages.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Title & Slug */}
                    <td className="py-3 px-4">
                      <div className="flex items-start space-x-2.5">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-text-primary text-xs hover:text-primary cursor-pointer" onClick={() => handleOpenEdit(p)}>
                              {p.title}
                            </span>
                            {p.is_system && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                System Protected
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-mono text-slate-500">/{p.slug}</span>
                            <button
                              onClick={() => copySlugToClipboard(p.slug)}
                              title="Copy URL path"
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {copiedSlug === p.slug ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {p.summary && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {p.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize bg-slate-100 text-slate-700">
                        {p.category}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(p._id, p.status)}
                        title="Click to toggle status"
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize transition-all ${
                          p.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : p.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ● {p.status}
                      </button>
                    </td>

                    {/* Last Updated */}
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      <div>{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'N/A'}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.updated_by?.name ? `By ${p.updated_by.name}` : 'Admin'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => setPreviewPage(p)}
                          title="Preview Content"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Edit Page"
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(p)}
                          disabled={p.is_system}
                          title={p.is_system ? 'System page cannot be deleted' : 'Delete Page'}
                          className={`p-1.5 rounded-lg transition ${
                            p.is_system
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-surface-border overflow-hidden my-8">
            <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-text-primary">
                  {editingId ? 'Edit Custom Page' : 'Create New Custom Page'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="m-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPage} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Row 1: Title and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-text-primary">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Privacy Policy, Terms & Conditions, Quarry Safety Guidelines"
                    className="w-full text-xs border border-surface-border rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full text-xs border border-surface-border rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:bg-white text-text-primary"
                  >
                    <option value="policy">Policy & Privacy</option>
                    <option value="legal">Legal & Terms</option>
                    <option value="company">Company & About</option>
                    <option value="support">Help & Support</option>
                    <option value="general">General Custom Page</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Slug and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-text-primary">URL Slug *</label>
                    <button
                      type="button"
                      onClick={() => setIsAutoSlug(!isAutoSlug)}
                      className="text-[10px] text-primary hover:underline font-medium"
                    >
                      {isAutoSlug ? 'Unlock manual slug' : 'Auto-sync from title'}
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                      /pages/
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      readOnly={isAutoSlug && !editingId}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                      placeholder="privacy-policy"
                      className="w-full text-xs font-mono border border-surface-border rounded-xl pl-16 pr-3 py-2 bg-slate-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary text-text-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-primary">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full text-xs border border-surface-border rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:bg-white text-text-primary font-medium"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-primary">Brief Summary</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short excerpt or description shown in listings and footers"
                  className="w-full text-xs border border-surface-border rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:bg-white text-text-primary"
                />
              </div>

              {/* Page Content (HTML / Rich Text format) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-text-primary">Page Body Content (HTML / Text) *</label>
                  <span className="text-[10px] text-slate-400">Supports HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;</span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<h2>1. Overview</h2><p>Provide detailed terms, conditions, privacy clauses, or company specifications here...</p>"
                  className="w-full text-xs font-mono border border-surface-border rounded-xl p-3 bg-slate-50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary text-text-primary"
                />
              </div>

              {/* Collapsible SEO Meta Settings */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-surface-border space-y-3">
                <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>SEO & Search Engine Meta Tags (Optional)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Meta Title</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="e.g. Privacy Policy | Stone Market India"
                      className="w-full text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-primary mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-600">Meta Description</label>
                    <input
                      type="text"
                      value={metaDesc}
                      onChange={(e) => setMetaDesc(e.target.value)}
                      placeholder="e.g. Official Privacy Policy and data handling policies..."
                      className="w-full text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-primary mt-0.5"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-surface-border flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-surface-border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : editingId ? 'Update Page' : 'Create & Publish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-border overflow-hidden my-8">
            <div className="p-4 border-b border-surface-border flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-text-primary">Live Public Page Preview</span>
              </div>
              <button
                onClick={() => setPreviewPage(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize bg-blue-50 text-blue-700">
                    {previewPage.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    https://stonemarketindia.com/pages/{previewPage.slug}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-text-primary">{previewPage.title}</h1>
                {previewPage.summary && (
                  <p className="text-xs text-slate-500 mt-1 italic">{previewPage.summary}</p>
                )}
              </div>

              {/* Rendered Body HTML */}
              <div
                className="prose prose-sm max-w-none text-slate-700 text-xs leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{ __html: previewPage.content }}
              />
            </div>
            <div className="p-3 bg-slate-50 border-t border-surface-border text-right">
              <button
                onClick={() => setPreviewPage(null)}
                className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-300"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
