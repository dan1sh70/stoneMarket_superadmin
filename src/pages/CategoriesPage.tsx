import React, { useState, useEffect } from 'react';
import {
  Grid,
  Tag,
  Layers,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  RefreshCw,
  FolderTree,
  Search
} from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const CategoriesPage: React.FC = () => {
  const [data, setData] = useState<{ serviceCategories: any[]; mainCategories: any[] }>({
    serviceCategories: [],
    mainCategories: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'service' | 'main'>('service');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminService.getCategories();
      setData({
        serviceCategories: res.serviceCategories || [],
        mainCategories: res.mainCategories || []
      });
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await superAdminService.createCategory({
        name,
        slug: slug || undefined,
        description
      });
      setActionMessage('Category created and saved to MongoDB.');
      setShowModal(false);
      setName('');
      setSlug('');
      setDescription('');
      loadCategories();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create category.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category permanently from database?')) return;
    try {
      await superAdminService.deleteCategory(id);
      setActionMessage('Category deleted.');
      loadCategories();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Delete failed.');
    }
  };

  const currentList = activeTab === 'service' ? data.serviceCategories : data.mainCategories;
  const filteredList = currentList.filter((cat) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return cat.name?.toLowerCase().includes(term) || cat.slug?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Categories & Business Taxonomy</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage industrial classifications, equipment taxonomy, and services catalog stored in MongoDB
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
          <button
            onClick={loadCategories}
            className="p-1.5 border border-surface-border bg-white rounded-lg text-slate-600 hover:text-primary transition-all"
            title="Refresh from DB"
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

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-xl border border-surface-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('service')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'service'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Service Categories ({data.serviceCategories.length})
          </button>
          <button
            onClick={() => setActiveTab('main')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'main'
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Platform Main Categories ({data.mainCategories.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search category name, slug..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Loading categories from database...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No matching categories found in database.
          </div>
        ) : (
          filteredList.map((cat) => (
            <div
              key={cat._id || cat.id || cat.slug}
              className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-50 text-primary rounded-lg">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 capitalize">
                    {cat.status || 'Active'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-text-primary line-clamp-1">{cat.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{cat.slug}</p>
                {cat.description && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{cat.description}</p>
                )}
              </div>

              {activeTab === 'service' && (
                <div className="flex items-center justify-end pt-2 border-t border-surface-border">
                  <button
                    onClick={() => handleDeleteCategory(cat._id || cat.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center space-x-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-surface-border">
            <h3 className="text-base font-bold text-text-primary mb-1">Add Platform Category</h3>
            <p className="text-xs text-text-secondary mb-4">
              Add a new industrial category or service taxonomy to MongoDB
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Diamond Wire Saw Repair"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Slug (URL-friendly)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. diamond-wire-saw-repair (auto-generated if empty)"
                  className="w-full text-xs bg-slate-50 border border-surface-border rounded-xl px-3 py-2 font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of products/services under this category..."
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
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
