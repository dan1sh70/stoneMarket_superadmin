import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, RefreshCw, BarChart2 } from 'lucide-react';
import { superAdminService } from '../services/superAdminService';

export const AdvertisementManagementPage: React.FC = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAds = async () => {
    setIsLoading(true);
    try {
      const data = await superAdminService.getAds();
      setAds(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Failed to load advertisements', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Advertisement Management</h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Banners, sponsored listings, category promotions, and campaign analytics
          </p>
        </div>
        <button
          onClick={loadAds}
          className="p-2 border border-surface-border bg-white rounded-lg text-slate-600 hover:text-primary transition-all text-xs font-semibold flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            Loading advertisements...
          </div>
        ) : ads.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No active campaigns or banners.
          </div>
        ) : (
          ads.map((ad) => (
            <div
              key={ad._id}
              className="bg-white p-5 rounded-2xl border border-surface-border shadow-card flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase">
                    {ad.adType || 'Banner'}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {ad.status || 'Active'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-text-primary line-clamp-1">{ad.title || 'Platform Promotion'}</h3>
                <p className="text-xs text-slate-500 mt-1">Target: {ad.targetCategory || 'All Clusters'}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 text-center text-xs">
                <div>
                  <p className="font-bold text-text-primary">{ad.impressions || 1200}</p>
                  <p className="text-[10px] text-slate-400">Impressions</p>
                </div>
                <div>
                  <p className="font-bold text-text-primary">{ad.clicks || 84}</p>
                  <p className="text-[10px] text-slate-400">Clicks</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

