import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  Globe,
  Share2,
  Check,
  AlertCircle
} from 'lucide-react';
import apiClient from '../services/apiClient';

interface PublicPageData {
  _id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  summary?: string;
  meta_title?: string;
  meta_description?: string;
  updatedAt?: string;
  published_at?: string;
}

export const PublicCustomPageView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PublicPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      if (!slug) return;
      setIsLoading(true);
      setError(null);

      try {
        // Try public page routes
        const res = await apiClient.get(`/app/pages/${slug}`)
          .catch(() => apiClient.get(`/v1/app/pages/${slug}`))
          .catch(() => apiClient.get(`/pages/${slug}`));

        const data = res.data?.data || res.data;
        if (data && data.title) {
          setPage(data);
          document.title = data.meta_title || `${data.title} - Stone Market India`;
        } else {
          setError('Page not found or is currently not published.');
        }
      } catch (err: any) {
        console.error('Error fetching public custom page', err);
        setError(err?.response?.data?.message || 'Page not found or has been moved.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading document...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-800 mb-1">Page Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-4">
          {error || 'The requested page does not exist or has not been published.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Simple Public Header */}
      <header className="bg-white border-b border-surface-border sticky top-0 z-20 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white">
              SM
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-extrabold text-xs tracking-wider uppercase text-slate-900">STONE MARKET</span>
              <span className="text-[9px] font-bold px-1 py-0.2 bg-red-600 text-white rounded">INDIA</span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-3xl border border-surface-border shadow-sm p-6 sm:p-10">
          {/* Header Metadata */}
          <div className="border-b border-slate-100 pb-6 mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-blue-50 text-blue-700">
                {page.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Last Updated: {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Recent'}
                </span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {page.title}
            </h1>

            {page.summary && (
              <p className="mt-2 text-sm text-slate-500 leading-relaxed italic">
                {page.summary}
              </p>
            )}
          </div>

          {/* Rendered HTML Body */}
          <article
            className="prose prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Document Verification Footer */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official document published by Stone Market India Platform Administration.</span>
            </div>
            <span>Document Slug: <strong className="font-mono text-slate-600">/{page.slug}</strong></span>
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <footer className="border-t border-surface-border bg-white py-6 text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Stone Market India. All rights reserved.</p>
      </footer>
    </div>
  );
};
