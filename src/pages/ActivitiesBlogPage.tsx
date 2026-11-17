import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Tag,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Archive,
  Image as ImageIcon,
  User,
  ArrowUpRight,
  TrendingUp,
  Bookmark,
  Share2,
  AlertCircle
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

interface ActivityItem {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  image?: string;
  type: 'news' | 'event' | 'market_update' | 'announcement' | 'blog' | 'article';
  category: string;
  tags?: string[];
  url?: string;
  author_name?: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  views_count?: number;
  published_at?: string;
  createdAt: string;
}

export const ActivitiesBlogPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ActivityItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Preview Drawer/Modal State
  const [previewItem, setPreviewItem] = useState<ActivityItem | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    type: 'blog',
    category: 'Industry News',
    tags: '',
    url: '',
    author_name: 'Stone Market India Editorial',
    status: 'published',
    is_featured: false,
    published_at: new Date().toISOString().split('T')[0]
  });

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await superAdminService.getActivities({
        search: search || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      const list = res?.activities || (Array.isArray(res) ? res : []);
      setActivities(list);
    } catch (err: any) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [typeFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadActivities();
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      image: '',
      type: 'blog',
      category: 'Industry News',
      tags: 'Granite, Mining, StoneMarket',
      url: '',
      author_name: 'Stone Market India Editorial',
      status: 'published',
      is_featured: false,
      published_at: new Date().toISOString().split('T')[0]
    });
    setFeedback(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ActivityItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug || '',
      description: item.description || '',
      content: item.content || '',
      image: item.image || '',
      type: item.type || 'blog',
      category: item.category || 'Industry News',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      url: item.url || '',
      author_name: item.author_name || 'Stone Market India Editorial',
      status: item.status || 'published',
      is_featured: !!item.is_featured,
      published_at: item.published_at ? item.published_at.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setFeedback(null);
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingItem ? prev.slug : autoSlug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      };

      if (editingItem) {
        await superAdminService.updateActivity(editingItem._id, payload);
        setFeedback({ type: 'success', message: 'Activity / Blog post updated successfully!' });
      } else {
        await superAdminService.createActivity(payload);
        setFeedback({ type: 'success', message: 'Activity / Blog post published successfully!' });
      }

      await loadActivities();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to save activity'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: ActivityItem) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    try {
      await superAdminService.toggleActivityStatus(item._id, nextStatus);
      setActivities((prev) =>
        prev.map((a) => (a._id === item._id ? { ...a, status: nextStatus } : a))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this Activity / Blog post?')) {
      return;
    }
    try {
      await superAdminService.deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete activity');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary tracking-tight">
                Stone Market Activities & Blogs CMS
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Publish articles, exhibitions, quarry policy announcements, and market updates to the home feed and mobile app.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Blog / Activity</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, tags, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white transition-all"
          />
        </form>

        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="all">All Content Types</option>
            <option value="blog">Blogs & Articles</option>
            <option value="news">Industry News</option>
            <option value="event">Trade Fairs & Events</option>
            <option value="market_update">Market & Price Updates</option>
            <option value="announcement">Official Announcements</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center text-text-secondary text-xs">
          Loading Stone Market activities and blogs...
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Newspaper className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">No Activities Found</h3>
          <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
            No published or draft blog activities match your current search or filter criteria.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl"
          >
            Create First Activity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Cover Image */}
              <div className="h-44 bg-slate-100 relative overflow-hidden group">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-[10px]">No Banner Image</span>
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md ${
                      item.status === 'published'
                        ? 'bg-emerald-600/90 text-white'
                        : item.status === 'draft'
                        ? 'bg-amber-600/90 text-white'
                        : 'bg-slate-700/90 text-white'
                    }`}
                  >
                    {item.status}
                  </span>

                  {item.is_featured && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 flex items-center space-x-1 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                {/* Content Type Pill */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-black/60 text-white backdrop-blur-sm uppercase">
                    {item.type.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-text-secondary mb-1.5">
                    <span className="font-semibold text-primary">{item.category}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        {item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Draft'}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description || 'No summary excerpt provided.'}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Author & Actions Bar */}
                <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                    <User className="w-3 h-3" />
                    <span className="line-clamp-1">{item.author_name || 'Editorial'}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setPreviewItem(item)}
                      title="Preview Article"
                      className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(item)}
                      title={item.status === 'published' ? 'Switch to Draft' : 'Publish Live'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        item.status === 'published'
                          ? 'text-emerald-600 hover:bg-emerald-50'
                          : 'text-amber-600 hover:bg-amber-50'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      title="Edit Activity"
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      title="Delete Permanently"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-surface-border w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl my-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary">
                  {editingItem ? 'Edit Activity / Blog Post' : 'Publish New Activity or Blog'}
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Entries are synchronized to the Stone Market home aggregation feed and public apps.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Title & Slug */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., India Stonemart 2026: Innovations in Gangsaw Cutting"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g., india-stonemart-2026-innovations"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Content Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-primary"
                  >
                    <option value="blog">Blog / Article</option>
                    <option value="news">Industry News</option>
                    <option value="event">Trade Exhibition / Event</option>
                    <option value="market_update">Market & Price Update</option>
                    <option value="announcement">Official Announcement</option>
                  </select>
                </div>
              </div>

              {/* Category & Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Exhibitions, Mining Policy, Granite Tech"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Stone Market Editorial Team"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              {/* Banner Image URL */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Featured Banner Image URL</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or S3 URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              {/* Short Summary Description */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Short Excerpt / Description (Feed Preview)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary visible on mobile feed cards and preview listings..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                />
              </div>

              {/* Full Blog Content */}
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Full Blog / Article Content (Markdown / HTML supported)
                </label>
                <textarea
                  rows={6}
                  placeholder="Full article content, paragraphs, bullet points, and technical specifications..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white font-mono"
                />
              </div>

              {/* Tags & External Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Granite, Marble, Export, Jalore, Machinery"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">External Resource URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              {/* Status & Featured Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-primary"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Saved but Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                  />
                  <label htmlFor="is_featured" className="text-xs font-bold text-text-primary cursor-pointer">
                    Pin to Featured Carousel
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-surface-border flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-sm disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Update Activity' : 'Publish Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Detail / Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-surface-border w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl my-auto overflow-hidden">
            <div className="p-4 border-b border-surface-border flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2 text-xs text-text-secondary">
                <span className="font-bold text-primary uppercase">{previewItem.category}</span>
                <span>•</span>
                <span>{previewItem.type.replace('_', ' ').toUpperCase()}</span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {previewItem.image && (
                <div className="rounded-xl overflow-hidden max-h-72 w-full">
                  <img
                    src={previewItem.image}
                    alt={previewItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h1 className="text-xl font-bold text-text-primary">{previewItem.title}</h1>

              <div className="flex items-center space-x-4 text-xs text-slate-500 py-1 border-b border-surface-border">
                <span>By {previewItem.author_name || 'Stone Market Editorial'}</span>
                <span>•</span>
                <span>
                  {previewItem.published_at
                    ? new Date(previewItem.published_at).toLocaleDateString()
                    : 'Draft'}
                </span>
                {previewItem.url && (
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center space-x-1"
                  >
                    <span>External Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {previewItem.description && (
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-slate-800 italic leading-relaxed">
                  {previewItem.description}
                </div>
              )}

              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                {previewItem.content || 'No detailed content provided.'}
              </div>

              {previewItem.tags && previewItem.tags.length > 0 && (
                <div className="pt-4 border-t border-surface-border flex items-center space-x-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <div className="flex flex-wrap gap-1.5">
                    {previewItem.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
