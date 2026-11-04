export interface User {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  role: string;
  status: 'active' | 'suspended' | 'blocked' | 'inactive';
  createdAt: string;
  updatedAt?: string;
  businessProfile?: BusinessProfile;
}

export interface BusinessProfile {
  _id: string;
  userId: string | User;
  business_type: string;
  company_name: string;
  logo?: string;
  cover_image?: string;
  gst_number?: string;
  email?: string;
  phone?: string;
  is_verified: boolean;
  status?: string;
  address?: {
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
  metrics?: {
    views?: number;
    inquiries_count?: number;
    leads_count?: number;
  };
  createdAt: string;
}

export interface ProductListing {
  _id: string;
  name: string;
  sku?: string;
  business_type: string;
  category: string;
  price?: number;
  selling_price?: number;
  status: 'active' | 'inactive' | 'draft' | 'rejected' | 'pending';
  publishing_status?: string;
  views?: number;
  inquiries_count?: number;
  vendorId?: string | BusinessProfile;
  cover_image?: string;
  images?: string[];
  createdAt: string;
}

export interface InquiryItem {
  _id: string;
  reference_number?: string;
  senderId?: {
    _id: string;
    name: string;
    mobile: string;
  };
  businessId?: {
    _id: string;
    company_name: string;
  };
  category: string;
  subject?: string;
  message?: string;
  requirements?: string;
  quantity?: number;
  unit?: string;
  status?: string;
  createdAt: string;
}

export interface LeadItem {
  _id: string;
  lead_number: string;
  lead_status: 'new' | 'in_discussion' | 'quote_sent' | 'converted' | 'closed' | 'expired';
  priority: 'normal' | 'high' | 'urgent';
  urgency: string;
  usage_application?: string;
  buyer_id?: {
    name: string;
    mobile: string;
  };
  manufacturer_id?: {
    company_name: string;
  };
  estimated_value?: number;
  createdAt: string;
}

export interface AdvertisementItem {
  _id: string;
  title: string;
  imageUrl?: string;
  adType: string;
  targetCategory?: string;
  targetState?: string;
  status: 'active' | 'paused' | 'expired';
  impressions: number;
  clicks: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface AdminLogItem {
  _id: string;
  adminId?: {
    _id: string;
    name: string;
    email?: string;
  };
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, any>;
  ip?: string;
  createdAt: string;
}

export interface SupportTicketItem {
  _id: string;
  ticket_number: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  userId?: {
    name: string;
    mobile: string;
    email?: string;
  };
  createdAt: string;
}

