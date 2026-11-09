import apiClient from './apiClient';

export const superAdminService = {
  // 1. Authentication
  login: async (credentials: { mobile?: string; email?: string; password: string }) => {
    const res = await apiClient.post('/v1/auth/login', credentials);
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await apiClient.get('/v1/auth/me');
    return res.data;
  },

  logout: async () => {
    try {
      await apiClient.post('/customer/logout');
    } catch (e) {
      // ignore network errors
    }
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
  },

  // 2. Dashboard KPIs & Live Analytics
  getDashboardAnalytics: async () => {
    const res = await apiClient.get('/admin/super/dashboard-stats');
    return res.data?.data || res.data;
  },

  // 3. User Management
  getUsers: async (params?: { role?: string; status?: string; page?: number; limit?: number; search?: string }) => {
    const res = await apiClient.get('/v1/admin/users', { params }).catch(async () => {
      return await apiClient.get('/admin/users', { params });
    });
    return res.data;
  },

  updateUserStatus: async (userId: string, status: string) => {
    const res = await apiClient.put(`/v1/admin/users/${userId}/status`, { status }).catch(async () => {
      return await apiClient.put(`/admin/users/${userId}/status`, { status });
    });
    return res.data;
  },

  // 4. Business Management & Verifications
  getBusinesses: async (params?: { business_type?: string; is_verified?: boolean; status?: string }) => {
    const res = await apiClient.get('/admin/super/businesses', { params });
    return res.data?.data || res.data;
  },

  verifyBusiness: async (businessId: string, payload: { is_verified?: boolean; verification_status?: string; gstVerified?: boolean; documentsVerified?: boolean }) => {
    const res = await apiClient.put(`/admin/super/businesses/${businessId}/verify`, payload);
    return res.data?.data || res.data;
  },

  updateBusinessStatus: async (businessId: string, status: string) => {
    const res = await apiClient.put(`/admin/super/businesses/${businessId}/verify`, { status });
    return res.data?.data || res.data;
  },

  // 5. Catalogue & Listing Management
  getListings: async (params?: { status?: string; category?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get('/v1/admin/listings', { params })
      .catch(() => apiClient.get('/admin/listings', { params }))
      .catch(() => apiClient.get('/catalogue', { params }));
    return res.data;
  },

  deleteListing: async (listingId: string) => {
    const res = await apiClient.delete(`/v1/admin/listings/${listingId}`)
      .catch(() => apiClient.delete(`/admin/listings/${listingId}`));
    return res.data;
  },

  updateListingStatus: async (listingId: string, status: string) => {
    const res = await apiClient.patch(`/catalogue/${listingId}/status`, { status });
    return res.data;
  },

  // 6. Inquiries Oversight
  getInquiries: async (params?: { page?: number; limit?: number; status?: string }) => {
    const res = await apiClient.get('/inquiries/admin/all', { params });
    return res.data;
  },

  // 7. Leads Management
  getLeads: async (params?: { status?: string; priority?: string; page?: number; limit?: number }) => {
    const res = await apiClient.get('/admin/super/leads', { params });
    return res.data?.data || res.data;
  },

  updateLeadStatus: async (leadId: string, status: string) => {
    const res = await apiClient.patch(`/admin/super/leads/${leadId}/status`, { status });
    return res.data;
  },

  // 8. Reports & Complaints / Support Tickets
  getReports: async (params?: { status?: string; category?: string }) => {
    const res = await apiClient.get('/admin/super/reports', { params });
    return res.data?.data || res.data;
  },

  updateReportStatus: async (reportId: string, status: string) => {
    const res = await apiClient.patch(`/admin/super/reports/${reportId}/status`, { status });
    return res.data;
  },

  // 9. Advertisements
  getAds: async () => {
    const res = await apiClient.get('/v1/ads').catch(() => apiClient.get('/ads'));
    return res.data;
  },

  createAd: async (payload: any) => {
    const res = await apiClient.post('/v1/ads', payload).catch(() => apiClient.post('/ads', payload));
    return res.data;
  },

  // 10. Categories Management (CRUD with DB fallback & auto-seed)
  getCategories: async () => {
    const res = await apiClient.get('/admin/super/categories');
    return res.data?.data || res.data;
  },

  createCategory: async (payload: { name: string; slug?: string; description?: string }) => {
    const res = await apiClient.post('/admin/super/categories', payload);
    return res.data;
  },

  updateCategory: async (id: string, payload: any) => {
    const res = await apiClient.put(`/admin/super/categories/${id}`, payload);
    return res.data;
  },

  deleteCategory: async (id: string) => {
    const res = await apiClient.delete(`/admin/super/categories/${id}`);
    return res.data;
  },

  // 11. Locations Management (CRUD with DB hierarchy & auto-seed)
  getLocations: async () => {
    const res = await apiClient.get('/admin/super/locations');
    return res.data?.data || res.data;
  },

  createState: async (payload: { name: string }) => {
    const res = await apiClient.post('/admin/super/locations', payload);
    return res.data;
  },

  addDistrictToState: async (stateId: string, payload: { districtName: string; areaName?: string; pincode?: string }) => {
    const res = await apiClient.post(`/admin/super/locations/${stateId}/districts`, payload);
    return res.data;
  },

  deleteState: async (stateId: string) => {
    const res = await apiClient.delete(`/admin/super/locations/${stateId}`);
    return res.data;
  },

  // 12. Audit Logs
  getAuditLogs: async () => {
    const res = await apiClient.get('/v1/admin/logs').catch(() => apiClient.get('/admin/logs'));
    return res.data;
  },

  // 13. Notifications & Announcements
  getAnnouncements: async () => {
    const res = await apiClient.get('/admin/super/announcements');
    return res.data?.data || res.data;
  },

  publishAnnouncement: async (payload: { title: string; content: string; type?: string; targetAudience?: string }) => {
    const res = await apiClient.post('/admin/super/announcements', payload);
    return res.data;
  },

  deleteAnnouncement: async (id: string) => {
    const res = await apiClient.delete(`/admin/super/announcements/${id}`);
    return res.data;
  },

  // 14. Admin & Staff RBAC Management
  getStaff: async () => {
    const res = await apiClient.get('/admin/super/staff');
    return res.data?.data || res.data;
  },

  createStaff: async (payload: { name: string; mobile: string; email: string; password?: string }) => {
    const res = await apiClient.post('/admin/super/staff', payload);
    return res.data;
  },

  // 15. Platform Settings
  getPlatformSettings: async () => {
    const res = await apiClient.get('/admin/super/settings');
    return res.data?.data || res.data;
  },

  savePlatformSettings: async (settings: any) => {
    const res = await apiClient.put('/admin/super/settings', settings);
    return res.data;
  },

  getApiKeys: async () => {
    const res = await apiClient.get('/admin/super/settings/keys');
    return res.data?.data || res.data;
  },

  saveApiKeys: async (keys: any) => {
    const res = await apiClient.put('/admin/super/settings/keys', keys);
    return res.data?.data || res.data;
  },

  getGeneralPublicKeys: async () => {
    const res = await apiClient.get('/app/keys').catch(() => apiClient.get('/v1/app/keys'));
    return res.data?.data || res.data;
  },

  // 16. System Health Monitoring
  getSystemHealth: async () => {
    const res = await apiClient.get('/app/version').catch(() => ({ data: { version: '1.0.0', status: 'online' } }));
    return res.data;
  },

  // 17. Custom Pages Management (CMS, Policies, Terms, About, Legal)
  getCustomPages: async (params?: { search?: string; category?: string; status?: string }) => {
    const res = await apiClient.get('/admin/super/pages', { params });
    return res.data?.data || res.data;
  },

  getCustomPageByIdOrSlug: async (idOrSlug: string) => {
    const res = await apiClient.get(`/admin/super/pages/${idOrSlug}`);
    return res.data?.data || res.data;
  },

  createCustomPage: async (payload: {
    title: string;
    slug?: string;
    category: string;
    content: string;
    summary?: string;
    status: string;
    meta_title?: string;
    meta_description?: string;
  }) => {
    const res = await apiClient.post('/admin/super/pages', payload);
    return res.data?.data || res.data;
  },

  updateCustomPage: async (id: string, payload: {
    title?: string;
    slug?: string;
    category?: string;
    content?: string;
    summary?: string;
    status?: string;
    meta_title?: string;
    meta_description?: string;
  }) => {
    const res = await apiClient.put(`/admin/super/pages/${id}`, payload);
    return res.data?.data || res.data;
  },

  toggleCustomPageStatus: async (id: string, status: string) => {
    const res = await apiClient.patch(`/admin/super/pages/${id}/status`, { status });
    return res.data?.data || res.data;
  },

  deleteCustomPage: async (id: string) => {
    const res = await apiClient.delete(`/admin/super/pages/${id}`);
    return res.data?.data || res.data;
  },

  // 18. Vision OCR Hub (Stone Image Matching & Estimation Document OCR)
  matchStoneImage: async (formData: FormData) => {
    const res = await apiClient.post('/v1/ocr/stone-match', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).catch(() => apiClient.post('/ocr/stone-match', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
    return res.data?.data || res.data;
  },

  parseEstimateImage: async (formData: FormData) => {
    const res = await apiClient.post('/v1/ocr/estimate-parse', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).catch(() => apiClient.post('/ocr/estimate-parse', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }));
    return res.data?.data || res.data;
  },

  saveParsedEstimate: async (payload: any) => {
    const res = await apiClient.post('/v1/ocr/save-parsed-estimate', payload)
      .catch(() => apiClient.post('/ocr/save-parsed-estimate', payload));
    return res.data?.data || res.data;
  }
};
