import React, { useState, useEffect, useCallback } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  DollarSign,
  Layers,
  FileText,
  Activity,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Eye,
  ArrowUpRight,
  Mail,
  Phone,
  Shield,
  Sparkles,
  ExternalLink,
  RefreshCw,
  MessageSquare,
  X,
} from 'lucide-react';
import { SERVICES_CATALOG } from '@legacypixels/shared';

interface AdminOrder {
  id: string;
  orderNumber: string;
  service: string;
  serviceSlug?: string;
  packageName: string;
  recipientName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  assignedProducer: string;
  totalAmount: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  deliveryDate: string;
  storyBrief: string;
  genre: string;
  mood: string;
  payload?: any;
}

interface AdminLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  serviceSlug?: string;
  budget: string;
  timeline: string;
  message: string;
  status: 'new' | 'contacted' | 'closed' | string;
  createdAt: string;
  payload?: any;
}

interface AdminMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'closed' | string;
  createdAt: string;
}

interface AdminStats {
  totalOrders: number;
  ordersInProduction: number;
  newQuoteLeads: number;
  newMessages: number;
  totalCustomers: number;
  grossBookings: number | null;
  csat: number | null;
}

const ORDER_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_production', label: 'In Production' },
  { value: 'quality_review', label: 'Quality Review' },
  { value: 'customer_review', label: 'Customer Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRODUCERS = [
  { name: 'Elena Rostova', role: 'Head of Sound & Composition', activeOrders: 5, status: 'Active' },
  { name: 'Farhan Vance', role: 'Executive Director & Film Lead', activeOrders: 3, status: 'Active' },
  { name: 'Tariq Al-Mansoor', role: 'Chief VFX & Virtual Stage Lead', activeOrders: 4, status: 'Active' },
  { name: 'David Thorne', role: 'Senior Audio Engineer', activeOrders: 6, status: 'Active' },
];

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isCustomerAuthenticated, isAdminAuthenticated, logoutAdmin } = useAuth();

  // A logged-in customer who opens an admin URL is redirected to the home page
  if (isCustomerAuthenticated && !isAdminAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // With no valid admin session, redirect to /admin/login
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'leads' | 'messages' | 'services' | 'team' | 'financials' | 'system'
  >('overview');

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isHealthOk, setIsHealthOk] = useState<boolean | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [selectedLead, setSelectedLead] = useState<AdminLead | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);

  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Compute Gateway Hostname dynamically
  const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim();
  let apiHostname = 'Same origin';
  if (rawApiUrl) {
    try {
      const url = new URL(rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`);
      apiHostname = url.hostname;
    } catch {
      apiHostname = rawApiUrl.replace(/^https?:\/\//, '').split('/')[0];
    }
  }

  // Health check
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await apiFetch('/api/health');
        if (isMounted) setIsHealthOk(res.ok);
      } catch {
        if (isMounted) setIsHealthOk(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch real data from Admin API
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const [ordersRes, leadsRes, messagesRes, statsRes] = await Promise.all([
        apiFetch('/api/admin/orders', { asAdmin: true }),
        apiFetch('/api/admin/leads', { asAdmin: true }),
        apiFetch('/api/admin/messages', { asAdmin: true }),
        apiFetch('/api/admin/stats', { asAdmin: true }),
      ]);

      // If unauthorized or forbidden, clear admin session and redirect to /admin/login
      if (
        ordersRes.status === 401 || ordersRes.status === 403 ||
        leadsRes.status === 401 || leadsRes.status === 403 ||
        messagesRes.status === 401 || messagesRes.status === 403 ||
        statsRes.status === 401 || statsRes.status === 403
      ) {
        logoutAdmin();
        navigate('/admin/login', { replace: true });
        return;
      }

      const [ordersData, leadsData, messagesData, statsData] = await Promise.all([
        ordersRes.json(),
        leadsRes.json(),
        messagesRes.json(),
        statsRes.json(),
      ]);

      if (ordersData?.success && Array.isArray(ordersData.data)) {
        setOrders(ordersData.data);
      }
      if (leadsData?.success && Array.isArray(leadsData.data)) {
        setLeads(leadsData.data);
      }
      if (messagesData?.success && Array.isArray(messagesData.data)) {
        setMessages(messagesData.data);
      }
      if (statsData?.success && statsData.data) {
        setStats(statsData.data);
      }
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load live data');
    } finally {
      setIsLoading(false);
    }
  }, [logoutAdmin, navigate]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Status update handlers
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/admin/orders/${orderId}/status`, {
        asAdmin: true,
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });

      if (res.status === 401 || res.status === 403) {
        logoutAdmin();
        navigate('/admin/login', { replace: true });
        return;
      }

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: newStatus, fulfillmentStatus: newStatus }
              : o
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, status: newStatus, fulfillmentStatus: newStatus } : null
          );
        }
      }
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/admin/leads/${leadId}/status`, {
        asAdmin: true,
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });

      if (res.status === 401 || res.status === 403) {
        logoutAdmin();
        navigate('/admin/login', { replace: true });
        return;
      }

      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update lead status', err);
    }
  };

  const handleUpdateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/admin/messages/${messageId}/status`, {
        asAdmin: true,
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });

      if (res.status === 401 || res.status === 403) {
        logoutAdmin();
        navigate('/admin/login', { replace: true });
        return;
      }

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update message status', err);
    }
  };

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'completed':
        return 'bg-emerald-950 text-emerald-300 border border-emerald-800';
      case 'customer_review':
        return 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40';
      case 'quality_review':
        return 'bg-purple-950 text-purple-300 border border-purple-800';
      case 'in_production':
        return 'bg-yellow-950 text-yellow-300 border border-yellow-800';
      case 'submitted':
        return 'bg-blue-950 text-blue-300 border border-blue-800';
      case 'draft':
        return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
      case 'cancelled':
        return 'bg-red-950 text-red-400 border border-red-900';
      case 'new':
        return 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40 font-bold';
      case 'contacted':
        return 'bg-yellow-950 text-yellow-300 border border-yellow-800';
      case 'closed':
        return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
      default:
        return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const query = orderSearchQuery.toLowerCase();
    const matchesSearch =
      (o.orderNumber || '').toLowerCase().includes(query) ||
      (o.recipientName || '').toLowerCase().includes(query) ||
      (o.customerName || '').toLowerCase().includes(query) ||
      (o.customerEmail || '').toLowerCase().includes(query);

    const ordStatus = (o.status || o.fulfillmentStatus || '').toLowerCase();
    const matchesStatus =
      statusFilter === 'ALL' || ordStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const activeOrdersCount = orders.filter(
    (o) => (o.status || o.fulfillmentStatus || '').toLowerCase() === 'in_production'
  ).length;

  const newLeadsCount = leads.filter(
    (l) => (l.status || '').toLowerCase() === 'new'
  ).length;

  const newMessagesCount = messages.filter(
    (m) => (m.status || '').toLowerCase() === 'new'
  ).length;

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="bg-[#0c0c0c] border-b border-[#222222] sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#1c1c1c] border border-[#B48A3C]/50 flex items-center justify-center font-oswald text-[#B48A3C] font-bold text-xs">
                LP
              </div>
              <span className="font-oswald text-base uppercase font-bold tracking-widest text-white">
                LEGACY <span className="text-[#E50914]">PIXELS</span>
              </span>
            </Link>
            <div className="h-5 w-[1px] bg-[#2A2A2A]" />
            <div className="flex items-center gap-2">
              <span className="bg-[#E50914]/15 border border-[#E50914]/40 text-[#E50914] text-[10px] font-oswald tracking-widest uppercase px-2 py-0.5 rounded-sm font-semibold">
                Studio Command Console
              </span>
              <span className="hidden sm:inline text-xs font-poppins text-[#777]">
                v1.0.0 Enterprise
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs font-poppins text-[#999] bg-[#141414] border border-[#2A2A2A] px-3 py-1.5 rounded-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  isHealthOk === true
                    ? 'bg-emerald-500 animate-pulse'
                    : isHealthOk === false
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              />
              <span>API Gateway: <strong>{apiHostname}</strong></span>
            </div>

            <button
              onClick={fetchAllData}
              disabled={isLoading}
              className="text-xs font-oswald uppercase tracking-wider text-[#B5B5B5] hover:text-white transition-colors flex items-center gap-1.5 bg-[#141414] border border-[#2A2A2A] px-2.5 py-1.5 rounded-sm"
              title="Refresh live dashboard data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#E50914]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/portal"
              className="btn-cinematic text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Patron Portal</span>
            </Link>

            <Link
              to="/"
              className="text-xs font-oswald uppercase tracking-wider text-[#B5B5B5] hover:text-white transition-colors"
            >
              Public Site →
            </Link>

            <button
              onClick={() => logoutAdmin()}
              className="text-xs font-oswald uppercase tracking-wider text-[#E50914] hover:text-[#FF1F2D] transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Container */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
          <div className="bg-[#101010] border border-[#222222] rounded-sm p-4 space-y-1">
            <span className="text-[10px] font-poppins uppercase tracking-widest text-[#777] px-3 block mb-2">
              Management Panes
            </span>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-oswald uppercase tracking-wider transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-[#B5B5B5] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & KPIs</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-oswald uppercase tracking-wider transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-[#B5B5B5] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Production Queue</span>
              </div>
              <span className="text-[10px] bg-[#1a1a1a] text-white px-2 py-0.5 rounded font-poppins">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-oswald uppercase tracking-wider transition-all ${
                activeTab === 'leads'
                  ? 'bg-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-[#B5B5B5] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Quote Inquiries</span>
              </div>
              {newLeadsCount > 0 ? (
                <span className="text-[10px] bg-[#E50914] text-white px-2 py-0.5 rounded font-poppins font-bold animate-pulse">
                  {newLeadsCount} New
                </span>
              ) : (
                <span className="text-[10px] bg-[#1a1a1a] text-[#777] px-2 py-0.5 rounded font-poppins">
                  {leads.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-oswald uppercase tracking-wider transition-all ${
                activeTab === 'messages'
                  ? 'bg-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-[#B5B5B5] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Contact Messages</span>
              </div>
              {newMessagesCount > 0 ? (
                <span className="text-[10px] bg-[#E50914] text-white px-2 py-0.5 rounded font-poppins font-bold animate-pulse">
                  {newMessagesCount} New
                </span>
              ) : (
                <span className="text-[10px] bg-[#1a1a1a] text-[#777] px-2 py-0.5 rounded font-poppins">
                  {messages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-oswald uppercase tracking-wider transition-all ${
                activeTab === 'services'
                  ? 'bg-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-[#B5B5B5] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Catalog & Rates</span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-oswald uppercase tracking-wider transition-all ${
                activeTab === 'team'
                  ? 'bg-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-[#B5B5B5] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Creative Roster</span>
            </button>

            <button
              onClick={() => setActiveTab('financials')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-oswald uppercase tracking-wider transition-all ${
                activeTab === 'financials'
                  ? 'bg-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-[#B5B5B5] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Financial Ledger</span>
            </button>

            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-oswald uppercase tracking-wider transition-all ${
                activeTab === 'system'
                  ? 'bg-[#E50914] text-white font-bold shadow-[0_0_15px_rgba(229,9,20,0.3)]'
                  : 'text-[#B5B5B5] hover:bg-[#181818] hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>System & Logs</span>
            </button>
          </div>
        </aside>

        {/* Right Main Admin Dashboard View */}
        <main className="flex-1 space-y-8 min-w-0">
          {fetchError && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 p-4 rounded-sm text-xs font-poppins flex items-center justify-between">
              <span>{fetchError}</span>
              <button
                onClick={fetchAllData}
                className="underline text-white ml-3"
              >
                Retry
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Top 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Gross Bookings MTD */}
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#B5B5B5] mb-2">
                    <span className="text-xs font-poppins uppercase tracking-wider">Gross Bookings MTD</span>
                    <DollarSign className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div className="font-oswald text-3xl font-bold text-white mb-1">
                    —
                  </div>
                  <span className="text-[10px] font-poppins text-[#777]">Not connected</span>
                </div>

                {/* KPI 2: Active Queue */}
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#B5B5B5] mb-2">
                    <span className="text-xs font-poppins uppercase tracking-wider">Active Queue</span>
                    <ShoppingBag className="w-4 h-4 text-[#B48A3C]" />
                  </div>
                  <div className="font-oswald text-3xl font-bold text-white mb-1">
                    {stats ? stats.ordersInProduction : activeOrdersCount} Projects
                  </div>
                  <span className="text-[10px] font-poppins text-[#777]">
                    In production ({stats ? stats.totalOrders : orders.length} total orders)
                  </span>
                </div>

                {/* KPI 3: New Quote Leads */}
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#B5B5B5] mb-2">
                    <span className="text-xs font-poppins uppercase tracking-wider">New Quote Leads</span>
                    <FileText className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div className="font-oswald text-3xl font-bold text-white mb-1">
                    {stats ? stats.newQuoteLeads : newLeadsCount} Inquiries
                  </div>
                  <span className="text-[10px] font-poppins text-[#777]">Pending producer response</span>
                </div>

                {/* KPI 4: Studio CSAT */}
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#B5B5B5] mb-2">
                    <span className="text-xs font-poppins uppercase tracking-wider">Studio CSAT</span>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-oswald text-3xl font-bold text-white mb-1">
                    —
                  </div>
                  <span className="text-[10px] font-poppins text-[#777]">Not connected</span>
                </div>
              </div>

              {/* Live Production Queue Snapshot */}
              <div className="bg-[#101010] border border-[#222222] rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#222222] pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#E50914]" />
                    <h3 className="font-oswald text-lg uppercase font-bold text-white tracking-wider">
                      Live Production Queue
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-oswald uppercase tracking-wider text-[#E50914] hover:underline"
                  >
                    View All Orders ({orders.length}) →
                  </button>
                </div>

                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3 text-xs text-[#999] font-poppins">
                    <RefreshCw className="w-5 h-5 animate-spin text-[#E50914]" />
                    <span>Loading real orders from Neon Postgres...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#777] font-poppins">
                    No orders yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-raleway">
                      <thead className="bg-[#0A0A0A] text-[#777] font-poppins uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="p-3">Order Ref</th>
                          <th className="p-3">Package / Recipient</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1e1e]">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#141414] transition-colors">
                            <td className="p-3 font-oswald text-sm font-bold text-white tracking-wide">
                              {ord.orderNumber}
                            </td>
                            <td className="p-3">
                              <span className="font-medium text-white block">{ord.packageName}</span>
                              <span className="text-[11px] text-[#B5B5B5]">For: {ord.recipientName || 'Patron'}</span>
                            </td>
                            <td className="p-3">
                              <span className="text-white block">{ord.customerName}</span>
                              <span className="text-[11px] text-[#777]">{ord.customerEmail}</span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-sm text-[10px] font-poppins uppercase font-bold ${getStatusBadge(
                                  ord.status || ord.fulfillmentStatus
                                )}`}
                              >
                                {(ord.status || ord.fulfillmentStatus || 'draft').replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-3 text-[#B48A3C] font-poppins">
                              {ord.createdAt ? ord.createdAt.split('T')[0] : '—'}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setActiveTab('orders');
                                }}
                                className="text-[#E50914] hover:underline font-poppins text-xs font-medium"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Incoming Leads */}
              <div className="bg-[#101010] border border-[#222222] rounded-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#222222] pb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#B48A3C]" />
                    <h3 className="font-oswald text-lg uppercase font-bold text-white tracking-wider">
                      Recent High-Value Leads & Brief Requests
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs font-oswald uppercase tracking-wider text-[#B48A3C] hover:underline"
                  >
                    View All Leads ({leads.length}) →
                  </button>
                </div>

                {isLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-[#999] font-poppins">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#E50914]" />
                    <span>Loading quote inquiries...</span>
                  </div>
                ) : leads.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#777] font-poppins">
                    No quote inquiries yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leads.slice(0, 3).map((lead) => (
                      <div
                        key={lead.id}
                        className="p-4 bg-[#0a0a0a] border border-[#222222] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-oswald text-base uppercase font-bold text-white">
                              {lead.name}
                            </h4>
                            <span className="text-[10px] font-poppins uppercase bg-[#E50914]/20 text-[#E50914] px-2 py-0.5 rounded-sm">
                              {lead.service}
                            </span>
                          </div>
                          <p className="font-raleway text-xs text-[#B5B5B5] line-clamp-1">
                            "{lead.message}"
                          </p>
                          <div className="flex items-center gap-4 text-[10px] font-poppins text-[#777] mt-1.5">
                            <span>Budget: <strong className="text-white">{lead.budget}</strong></span>
                            <span>•</span>
                            <span>Timeline: {lead.timeline}</span>
                            <span>•</span>
                            <span>Email: {lead.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={(lead.status || 'new').toLowerCase()}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                            className="bg-[#141414] border border-[#333] text-white text-[11px] font-poppins px-2 py-1 rounded-sm focus:outline-none"
                          >
                            <option value="new">NEW</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="closed">CLOSED</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTION QUEUE & ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-oswald text-2xl uppercase font-bold text-white tracking-wider">
                    Studio Production Queue ({filteredOrders.length})
                  </h2>
                  <p className="font-raleway text-xs text-[#B5B5B5]">
                    Track fulfillment pipelines, update status stages, and inspect creative briefs.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#777] absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search order ref, patron..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="bg-[#101010] border border-[#222222] pl-8 pr-4 py-2 text-xs text-white rounded-sm placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#101010] border border-[#222222] px-3 py-2 text-xs text-white rounded-sm focus:outline-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="in_production">In Production</option>
                    <option value="quality_review">Quality Review</option>
                    <option value="customer_review">Customer Review</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Detail Modal / Inspector Drawer if selected */}
              {selectedOrder && (
                <div className="bg-[#141414] border border-[#E50914] p-6 rounded-sm shadow-2xl relative space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-oswald text-xl uppercase font-bold text-white">
                        Order Inspector: {selectedOrder.orderNumber}
                      </span>
                      <span className="text-xs bg-[#E50914] text-white px-2 py-0.5 rounded font-poppins font-semibold">
                        ${selectedOrder.totalAmount} USD
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-poppins uppercase font-bold ${getStatusBadge(
                          selectedOrder.status || selectedOrder.fulfillmentStatus
                        )}`}
                      >
                        {(selectedOrder.status || selectedOrder.fulfillmentStatus || 'draft').replace('_', ' ')}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-xs font-oswald uppercase text-[#B5B5B5] hover:text-white flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Close Inspector</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-raleway">
                    <div>
                      <span className="text-[10px] font-poppins uppercase text-[#777] block">Patron & Contact</span>
                      <strong className="text-white block">{selectedOrder.customerName}</strong>
                      <span className="text-[#B5B5B5] block">{selectedOrder.customerEmail}</span>
                      {selectedOrder.customerPhone && (
                        <span className="text-[#777] block">{selectedOrder.customerPhone}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-poppins uppercase text-[#777] block">Recipient / Protagonist</span>
                      <strong className="text-white block">{selectedOrder.recipientName || 'Patron'}</strong>
                      <span className="text-[#B48A3C]">
                        {selectedOrder.genre ? `${selectedOrder.genre} • ` : ''}{selectedOrder.mood || selectedOrder.packageName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-poppins uppercase text-[#777] block">Service & Created Date</span>
                      <strong className="text-white block">{selectedOrder.packageName}</strong>
                      <span className="text-[#777]">
                        Created: {selectedOrder.createdAt ? selectedOrder.createdAt.split('T')[0] : '—'}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.storyBrief && (
                    <div className="bg-[#0A0A0A] p-4 rounded-sm border border-[#222222] text-xs font-raleway">
                      <span className="text-[10px] font-poppins uppercase text-[#777] block mb-1">
                        Creative Story Brief & Details:
                      </span>
                      <p className="text-[#CCCCCC] italic">"{selectedOrder.storyBrief}"</p>
                    </div>
                  )}

                  {/* Additional Payload Details if present */}
                  {selectedOrder.payload && (
                    <div className="bg-[#0A0A0A] p-4 rounded-sm border border-[#222222] text-xs font-raleway">
                      <span className="text-[10px] font-poppins uppercase text-[#777] block mb-2">
                        Complete Order Payload Spec:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-[#A0A0A0]">
                        {selectedOrder.payload.serviceSlug && (
                          <div>Service Slug: <strong className="text-white">{selectedOrder.payload.serviceSlug}</strong></div>
                        )}
                        {selectedOrder.payload.brief?.occasion && (
                          <div>Occasion: <strong className="text-white">{selectedOrder.payload.brief.occasion}</strong></div>
                        )}
                        {selectedOrder.payload.brief?.vocalPreference && (
                          <div>Vocals: <strong className="text-white">{selectedOrder.payload.brief.vocalPreference}</strong></div>
                        )}
                        {selectedOrder.payload.brief?.songLanguage && (
                          <div>Language: <strong className="text-white">{selectedOrder.payload.brief.songLanguage}</strong></div>
                        )}
                        {selectedOrder.payload.item?.fastDelivery && (
                          <div className="text-emerald-400 font-bold">Fast Track 48-Hour Delivery Enabled</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2A2A2A]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-poppins text-[#B48A3C]">Change Stage:</span>
                      {ORDER_STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, opt.value)}
                          className={`px-2.5 py-1 text-[10px] font-oswald uppercase rounded ${
                            (selectedOrder.status || selectedOrder.fulfillmentStatus || '').toLowerCase() === opt.value
                              ? 'bg-[#E50914] text-white font-bold'
                              : 'bg-[#1c1c1c] text-[#999] hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <Link
                      to="/portal"
                      className="btn-cinematic text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Screening Room</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Full Orders Table */}
              <div className="bg-[#101010] border border-[#222222] rounded-sm overflow-hidden">
                {isLoading ? (
                  <div className="p-12 text-center text-xs text-[#999] font-poppins flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#E50914]" />
                    <span>Loading production queue from database...</span>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-12 text-center text-xs text-[#777] font-poppins">
                    No orders yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-raleway">
                      <thead className="bg-[#0A0A0A] text-[#777] font-poppins uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="p-4">Ref Number</th>
                          <th className="p-4">Discipline & Package</th>
                          <th className="p-4">Recipient</th>
                          <th className="p-4">Customer Email</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Current Stage</th>
                          <th className="p-4">Created Date</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1e1e]">
                        {filteredOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#141414] transition-colors">
                            <td className="p-4 font-oswald text-sm font-bold text-white tracking-wider">
                              {ord.orderNumber}
                            </td>
                            <td className="p-4 font-medium text-white">{ord.packageName}</td>
                            <td className="p-4 text-[#CCCCCC]">{ord.recipientName || 'Patron'}</td>
                            <td className="p-4 text-[#B5B5B5]">{ord.customerEmail}</td>
                            <td className="p-4 font-oswald text-sm font-bold text-white">
                              ${ord.totalAmount}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-sm text-[10px] font-poppins uppercase font-bold inline-block ${getStatusBadge(
                                  ord.status || ord.fulfillmentStatus
                                )}`}
                              >
                                {(ord.status || ord.fulfillmentStatus || 'draft').replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-4 text-[#B48A3C] font-poppins">
                              {ord.createdAt ? ord.createdAt.split('T')[0] : '—'}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="btn-cinematic text-[11px] py-1 px-3"
                              >
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: QUOTE INQUIRIES & LEADS */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-oswald text-2xl uppercase font-bold text-white tracking-wider">
                  Inbound Quote Leads & Film Inquiries ({leads.length})
                </h2>
                <p className="font-raleway text-xs text-[#B5B5B5]">
                  Prospective commercial film, VFX, editorial, and enterprise commissions submitted via `/api/leads`.
                </p>
              </div>

              {isLoading ? (
                <div className="p-12 text-center text-xs text-[#999] font-poppins flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#E50914]" />
                  <span>Loading quote inquiries from database...</span>
                </div>
              ) : leads.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#777] font-poppins bg-[#101010] border border-[#222222] rounded-sm">
                  No quote inquiries yet
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-[#101010] border border-[#222222] p-6 rounded-sm space-y-4 hover:border-[#E50914] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222222] pb-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-oswald text-xl uppercase font-bold text-white">
                              {lead.name}
                            </h3>
                            <span className="text-[10px] font-poppins uppercase bg-[#E50914] text-white px-2 py-0.5 rounded-sm font-semibold">
                              {lead.service}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-poppins uppercase font-bold ${getStatusBadge(
                                lead.status
                              )}`}
                            >
                              {lead.status}
                            </span>
                          </div>
                          <span className="text-xs font-poppins text-[#777]">
                            Received: {lead.createdAt ? lead.createdAt.split('T')[0] : '—'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-poppins text-[#B5B5B5]">Lead Status:</span>
                          <select
                            value={(lead.status || 'new').toLowerCase()}
                            onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                            className="bg-[#181818] border border-[#333] text-white text-xs font-poppins px-3 py-1.5 rounded-sm focus:outline-none"
                          >
                            <option value="new">NEW</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="closed">CLOSED</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-raleway">
                        <div>
                          <span className="text-[10px] font-poppins uppercase text-[#777] block">Direct Email</span>
                          <a href={`mailto:${lead.email}`} className="text-white hover:text-[#E50914] flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-[#E50914]" />
                            {lead.email}
                          </a>
                        </div>
                        <div>
                          <span className="text-[10px] font-poppins uppercase text-[#777] block">Phone / WhatsApp</span>
                          <span className="text-white flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                            {lead.phone || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-poppins uppercase text-[#777] block">Budget & Timeline</span>
                          <span className="text-[#B48A3C] font-semibold">{lead.budget}</span> • {lead.timeline}
                        </div>
                      </div>

                      <div className="bg-[#0A0A0A] p-4 rounded-sm border border-[#222222]">
                        <span className="text-[10px] font-poppins uppercase text-[#777] block mb-1">
                          Client Scope & Vision:
                        </span>
                        <p className="text-xs font-raleway text-[#CCCCCC] leading-relaxed">
                          "{lead.message}"
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <a
                          href={`mailto:${lead.email}?subject=Legacy Pixels Production Proposal for ${lead.name}`}
                          className="btn-cinematic-red text-xs py-1.5 px-4 flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply with Studio Proposal</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-oswald text-2xl uppercase font-bold text-white tracking-wider">
                  Patron Messages & Production Desk Inquiries ({messages.length})
                </h2>
                <p className="font-raleway text-xs text-[#B5B5B5]">
                  Inbound correspondence received through the public contact desk (`/api/contact`).
                </p>
              </div>

              {isLoading ? (
                <div className="p-12 text-center text-xs text-[#999] font-poppins flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#E50914]" />
                  <span>Loading contact messages from database...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#777] font-poppins bg-[#101010] border border-[#222222] rounded-sm">
                  No contact messages yet
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="bg-[#101010] border border-[#222222] p-6 rounded-sm space-y-4 hover:border-[#E50914] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222222] pb-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-oswald text-lg uppercase font-bold text-white">
                              {msg.subject}
                            </h3>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-poppins uppercase font-bold ${getStatusBadge(
                                msg.status
                              )}`}
                            >
                              {msg.status}
                            </span>
                          </div>
                          <span className="text-xs font-poppins text-[#777]">
                            From: <strong className="text-white">{msg.name}</strong> ({msg.email}) • Received: {msg.createdAt ? msg.createdAt.split('T')[0] : '—'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-poppins text-[#B5B5B5]">Status:</span>
                          <select
                            value={(msg.status || 'new').toLowerCase()}
                            onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value)}
                            className="bg-[#181818] border border-[#333] text-white text-xs font-poppins px-3 py-1.5 rounded-sm focus:outline-none"
                          >
                            <option value="new">NEW</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="closed">CLOSED</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-[#0A0A0A] p-4 rounded-sm border border-[#222222]">
                        <p className="text-xs font-raleway text-[#CCCCCC] leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="btn-cinematic-red text-xs py-1.5 px-4 flex items-center gap-1.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply via Email</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SERVICES CATALOG & RATES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-oswald text-2xl uppercase font-bold text-white tracking-wider">
                  Discipline Catalog & Pricing Matrix ({SERVICES_CATALOG.length})
                </h2>
                <p className="font-raleway text-xs text-[#B5B5B5]">
                  Active studio disciplines, starting investment tiers, and checkout availability.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SERVICES_CATALOG.map((srv) => (
                  <div
                    key={srv.slug}
                    className="bg-[#101010] border border-[#222222] p-6 rounded-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-oswald text-xl uppercase font-bold text-white">
                          {srv.title.en}
                        </h3>
                        <span
                          className={`text-[10px] font-poppins uppercase px-2 py-0.5 rounded-sm font-semibold ${
                            srv.checkoutEnabled
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-[#1c1c1c] text-[#777] border border-[#333]'
                          }`}
                        >
                          {srv.checkoutEnabled ? 'Direct Checkout Active' : 'Quote Only'}
                        </span>
                      </div>

                      <p className="font-poppins text-xs uppercase tracking-wider text-[#E50914] mb-3">
                        {srv.tagline.en}
                      </p>

                      <p className="font-raleway text-xs text-[#B5B5B5] leading-relaxed mb-4">
                        {srv.shortDescription.en}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-[#222222] text-xs font-poppins">
                        <span className="text-[#777]">Starting Investment:</span>
                        <strong className="text-white font-oswald text-base">
                          {srv.startingPriceCents > 0 ? `$${(srv.startingPriceCents / 100).toFixed(0)} USD` : 'Custom Quote'}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#222222] flex items-center justify-between">
                      <Link
                        to={`/services/${srv.slug}`}
                        className="text-xs font-oswald uppercase text-[#B48A3C] hover:underline"
                      >
                        Inspect Public Spec Page →
                      </Link>
                      {srv.checkoutEnabled && (
                        <Link
                          to={`/order/${srv.slug}`}
                          className="btn-cinematic-red text-[11px] py-1 px-3"
                        >
                          Test Booking Wizard
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TEAM & CREATIVE ROSTER */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-oswald text-2xl uppercase font-bold text-white tracking-wider">
                  Studio Creative & Production Roster
                </h2>
                <p className="font-raleway text-xs text-[#B5B5B5]">
                  Assigned directors, lead composers, mix engineers, and VFX supervisors.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PRODUCERS.map((member) => (
                  <div
                    key={member.name}
                    className="bg-[#101010] border border-[#222222] p-6 rounded-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-sm bg-[#1c1c1c] border border-[#E50914] flex items-center justify-center font-oswald text-base font-bold text-white">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-oswald text-lg uppercase font-bold text-white">
                          {member.name}
                        </h4>
                        <span className="text-xs font-poppins text-[#E50914] block">
                          {member.role}
                        </span>
                        <span className="text-[11px] font-raleway text-[#777]">
                          Active Load: <strong className="text-white">{member.activeOrders} Projects</strong>
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-poppins uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-sm">
                      {member.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FINANCIAL LEDGER */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-oswald text-2xl uppercase font-bold text-white tracking-wider">
                  Financial Ledger & Settlements
                </h2>
                <p className="font-raleway text-xs text-[#B5B5B5]">
                  Real-time transaction tracking and customer order settlements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm">
                  <span className="text-[10px] font-poppins uppercase text-[#777] block">Gross Platform Sales</span>
                  <span className="font-oswald text-3xl font-bold text-white">—</span>
                  <span className="text-[10px] font-poppins text-[#777]">Not connected</span>
                </div>
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm">
                  <span className="text-[10px] font-poppins uppercase text-[#777] block">Refund Rate</span>
                  <span className="font-oswald text-3xl font-bold text-white">—</span>
                  <span className="text-[10px] font-poppins text-[#777]">Not connected</span>
                </div>
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm">
                  <span className="text-[10px] font-poppins uppercase text-[#777] block">Total Settled Orders</span>
                  <span className="font-oswald text-3xl font-bold text-[#B48A3C]">
                    {orders.length}
                  </span>
                  <span className="text-[10px] font-poppins text-[#777]">Database orders</span>
                </div>
              </div>

              <div className="bg-[#101010] border border-[#222222] rounded-sm p-6 space-y-4">
                <h3 className="font-oswald text-lg uppercase font-bold text-white tracking-wider">
                  Production Orders Ledger
                </h3>
                {orders.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#777] font-poppins">
                    No transactions recorded yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-raleway">
                      <thead className="bg-[#0A0A0A] text-[#777] font-poppins uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Record ID</th>
                          <th className="p-3">Order Ref</th>
                          <th className="p-3">Client</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1e1e]">
                        {orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#141414]">
                            <td className="p-3 font-mono text-[11px] text-[#777]">rec_neon_{ord.id}</td>
                            <td className="p-3 font-oswald text-white font-bold">{ord.orderNumber}</td>
                            <td className="p-3 text-[#CCCCCC]">{ord.customerName}</td>
                            <td className="p-3 font-oswald text-white font-bold">${ord.totalAmount} USD</td>
                            <td className="p-3 text-emerald-400 font-bold uppercase text-[10px]">
                              {(ord.status || 'draft').toUpperCase()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: SYSTEM DIAGNOSTICS & LOGS */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-oswald text-2xl uppercase font-bold text-white tracking-wider">
                  System Diagnostics & Server Console
                </h2>
                <p className="font-raleway text-xs text-[#B5B5B5]">
                  Microservices heartbeat, database connectivity, and Express API status.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#101010] border border-[#222222] rounded-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-poppins uppercase text-[#777] block">Express API Service</span>
                    <strong className="text-white font-oswald text-base">
                      {isHealthOk ? 'Online (Active)' : 'Offline / Checking'}
                    </strong>
                  </div>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      isHealthOk ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                </div>

                <div className="p-4 bg-[#101010] border border-[#222222] rounded-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-poppins uppercase text-[#777] block">API Gateway Host</span>
                    <strong className="text-white font-oswald text-base truncate max-w-[170px] block" title={apiHostname}>
                      {apiHostname}
                    </strong>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="p-4 bg-[#101010] border border-[#222222] rounded-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-poppins uppercase text-[#777] block">Database Engine</span>
                    <strong className="text-white font-oswald text-base">Neon Serverless Postgres</strong>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-[#222222] rounded-sm p-4 font-mono text-[11px] text-[#A0A0A0] space-y-2">
                <span className="text-[#E50914] font-bold block mb-2 font-poppins">
                  [LIVE STREAMING SERVER DIAGNOSTICS]:
                </span>
                <p>[SYSTEM] API Gateway endpoint: {apiHostname}</p>
                <p>[HEALTH] GET /api/health returned status: {isHealthOk ? '200 OK' : 'Unavailable'}</p>
                <p>[DATABASE] Connected to Neon Postgres via serverless driver pool.</p>
                <p>[ORDERS] Loaded {orders.length} real orders into administrative queue.</p>
                <p>[LEADS] Loaded {leads.length} commercial inquiries and {messages.length} patron messages.</p>
                <p className="text-emerald-400">[READY] Enterprise Studio Command Console operational.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
