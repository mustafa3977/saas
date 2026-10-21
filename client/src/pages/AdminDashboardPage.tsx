import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  DollarSign,
  Layers,
  FileText,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  Download,
  Mail,
  Phone,
  Shield,
  Server,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { SERVICES_CATALOG, FulfillmentStatus, PaymentStatus } from '@legacypixels/shared';

interface AdminOrder {
  id: string;
  orderNumber: string;
  service: string;
  packageName: string;
  recipientName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  assignedProducer: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
  deliveryDate: string;
  storyBrief: string;
  genre: string;
  mood: string;
}

interface AdminLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
  status: 'NEW' | 'CONTACTED' | 'PROPOSAL_SENT' | 'CONVERTED' | 'ARCHIVED';
  createdAt: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'LP-2026-881920',
    service: 'Music & Personalized Songs',
    packageName: 'Cinematic Song (Flagship)',
    recipientName: 'Layla & Zayd',
    customerName: 'Zayd Al-Fassi',
    customerEmail: 'zayd.alfassi@example.com',
    customerPhone: '+44 7405 593913',
    assignedProducer: 'Elena Rostova (Lead Composer)',
    totalAmount: 68,
    paymentStatus: 'paid',
    fulfillmentStatus: 'CUSTOMER_REVIEW',
    createdAt: '2026-10-14',
    deliveryDate: '2026-10-19',
    storyBrief: 'Met in Lake Como in autumn 2018 under a café awning during rain. First dance at wedding.',
    genre: 'Cinematic Pop & Orchestral Strings',
    mood: 'Romantic & Intimate',
  },
  {
    id: 'ord-2',
    orderNumber: 'LP-2026-319042',
    service: 'Music & Personalized Songs',
    packageName: 'Personal Song',
    recipientName: 'Marcus Vance Sr.',
    customerName: 'Marcus Vance Jr.',
    customerEmail: 'mvance@example.com',
    customerPhone: '+1 415 555 2671',
    assignedProducer: 'David Thorne (Acoustic Arranger)',
    totalAmount: 29,
    paymentStatus: 'paid',
    fulfillmentStatus: 'IN_PRODUCTION',
    createdAt: '2026-10-17',
    deliveryDate: '2026-10-22',
    storyBrief: 'Celebrating 60th birthday, father of three who built the family woodworking workshop.',
    genre: 'Acoustic Folk Ballad',
    mood: 'Heartwarming & Emotional',
  },
  {
    id: 'ord-3',
    orderNumber: 'LP-2026-559103',
    service: 'Music & Personalized Songs',
    packageName: 'Signature Studio Anthem',
    recipientName: 'Aura Luxury Group',
    customerName: 'Sophie Chen',
    customerEmail: 'schen@auraluxury.ch',
    customerPhone: '+41 22 819 0044',
    assignedProducer: 'Elena Rostova & Live Strings Section',
    totalAmount: 124,
    paymentStatus: 'paid',
    fulfillmentStatus: 'QUALITY_REVIEW',
    createdAt: '2026-10-15',
    deliveryDate: '2026-10-20',
    storyBrief: 'Brand theme celebration for global flagship opening in Geneva. Stems and 4K lyric video included.',
    genre: 'Orchestral Cinematic',
    mood: 'Epic & Grandiose',
  },
  {
    id: 'ord-4',
    orderNumber: 'LP-2026-110294',
    service: 'Music & Personalized Songs',
    packageName: 'Cinematic Song',
    recipientName: 'Amina & Tariq',
    customerName: 'Amina Siddiqui',
    customerEmail: 'amina.s@example.com',
    assignedProducer: 'Farhan Vance',
    totalAmount: 59,
    paymentStatus: 'paid',
    fulfillmentStatus: 'COMPLETED',
    createdAt: '2026-10-08',
    deliveryDate: '2026-10-13',
    storyBrief: '10th Wedding Anniversary milestone, bilingual English and Urdu acoustic ballad.',
    genre: 'Urdu Ghazal / Cinematic Fusion',
    mood: 'Nostalgic & Reflective',
  },
];

const INITIAL_LEADS: AdminLead[] = [
  {
    id: 'lead-101',
    name: 'Julian Henderson',
    email: 'j.henderson@solisfilm.com',
    phone: '+44 20 7946 0192',
    service: 'Movies & Narrative Cinema',
    budget: '$15,000 - $50,000',
    timeline: 'Within 2-4 weeks',
    message: 'Looking for anamorphic 8K RED crew and color grading for a 20-minute dramatic short film in Scotland.',
    status: 'NEW',
    createdAt: '2026-10-18 14:20',
  },
  {
    id: 'lead-102',
    name: 'Camilla Rossi',
    email: 'crossi@voguemilano.it',
    phone: '+39 02 8739 1100',
    service: 'Ads & Motion Graphics',
    budget: '$5,000 - $15,000',
    timeline: 'Urgent (Within 48-72 Hours)',
    message: 'High-speed macro campaign for luxury cosmetics line. Need 3x 15s Instagram Reels & 1x 45s brand anthem.',
    status: 'PROPOSAL_SENT',
    createdAt: '2026-10-17 09:15',
  },
  {
    id: 'lead-103',
    name: 'Dr. Hamza Malik',
    email: 'hamza@apexsummit.ae',
    phone: '+971 50 123 4567',
    service: 'Livestream Production',
    budget: '$5,000 - $15,000',
    timeline: '1-3 Months',
    message: 'Multi-camera broadcast production for 3-day tech leadership summit at Dubai World Trade Centre.',
    status: 'CONTACTED',
    createdAt: '2026-10-16 17:40',
  },
];

const PRODUCERS = [
  { name: 'Elena Rostova', role: 'Head of Sound & Composition', activeOrders: 5, status: 'Active' },
  { name: 'Farhan Vance', role: 'Executive Director & Film Lead', activeOrders: 3, status: 'Active' },
  { name: 'Tariq Al-Mansoor', role: 'Chief VFX & Virtual Stage Lead', activeOrders: 4, status: 'Active' },
  { name: 'David Thorne', role: 'Senior Audio Engineer', activeOrders: 6, status: 'Active' },
];

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'leads' | 'services' | 'team' | 'financials' | 'system'
  >('overview');

  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [leads, setLeads] = useState<AdminLead[]>(INITIAL_LEADS);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Load any orders created by the user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lp_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userOrders: AdminOrder[] = parsed.map((p: any, idx: number) => ({
            id: `usr-ord-${idx}`,
            orderNumber: p.publicNumber || `LP-2026-${Math.floor(100000 + Math.random() * 900000)}`,
            service: 'Music & Personalized Songs',
            packageName: p.packageName || 'Cinematic Song',
            recipientName: p.recipientName || 'Valued Patron',
            customerName: 'Online Customer',
            customerEmail: 'customer@legacypixels.net',
            assignedProducer: 'Elena Rostova',
            totalAmount: (p.totalCents || 5900) / 100,
            paymentStatus: (p.paymentStatus as PaymentStatus) || 'paid',
            fulfillmentStatus: (p.fulfillmentStatus as FulfillmentStatus) || 'IN_PRODUCTION',
            createdAt: p.createdAt ? p.createdAt.split('T')[0] : '2026-10-19',
            deliveryDate: p.estimatedDeliveryDate || 'Within 4 Days',
            storyBrief: p.story || 'Custom personalized song brief received.',
            genre: p.genre || 'Cinematic Pop',
            mood: p.mood || 'Romantic & Intimate',
          }));
          setOrders([...userOrders, ...INITIAL_ORDERS]);
        }
      } catch (e) {}
    }
  }, []);

  const handleUpdateOrderStatus = (orderId: string, newStatus: FulfillmentStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: newStatus } : o));
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, fulfillmentStatus: newStatus });
    }
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: AdminLead['status']) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l));
    setLeads(updated);
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.recipientName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.fulfillmentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0) + 14500;
  const activeOrdersCount = orders.filter((o) => o.fulfillmentStatus !== 'COMPLETED').length;
  const completedOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'COMPLETED').length;
  const newLeadsCount = leads.filter((l) => l.status === 'NEW').length;

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
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>API Gateway: <strong>http://localhost:5000</strong></span>
            </div>

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
              {newLeadsCount > 0 && (
                <span className="text-[10px] bg-[#E50914] text-white px-2 py-0.5 rounded font-poppins font-bold animate-pulse">
                  {newLeadsCount} New
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

          {/* Quick Stats Widget */}
          <div className="bg-[#101010] border border-[#222222] rounded-sm p-4 space-y-3">
            <span className="text-[10px] font-poppins uppercase tracking-widest text-[#B48A3C] block">
              Direct Quick Action
            </span>
            <Link
              to="/order/music"
              className="w-full btn-cinematic-red text-[11px] py-2 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate New Order</span>
            </Link>
          </div>
        </aside>

        {/* Right Main Admin Dashboard View */}
        <main className="flex-1 space-y-8 min-w-0">
          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#B5B5B5] mb-2">
                    <span className="text-xs font-poppins uppercase tracking-wider">Gross Bookings MTD</span>
                    <DollarSign className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div className="font-oswald text-3xl font-bold text-white mb-1">
                    ${totalRevenue.toLocaleString()} <span className="text-xs font-poppins text-emerald-400 font-normal">+18.4%</span>
                  </div>
                  <span className="text-[10px] font-poppins text-[#777]">Stripe verified settlements</span>
                </div>

                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#B5B5B5] mb-2">
                    <span className="text-xs font-poppins uppercase tracking-wider">Active Queue</span>
                    <ShoppingBag className="w-4 h-4 text-[#B48A3C]" />
                  </div>
                  <div className="font-oswald text-3xl font-bold text-white mb-1">
                    {activeOrdersCount} Projects
                  </div>
                  <span className="text-[10px] font-poppins text-[#777]">In production & QC review</span>
                </div>

                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#B5B5B5] mb-2">
                    <span className="text-xs font-poppins uppercase tracking-wider">New Quote Leads</span>
                    <FileText className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div className="font-oswald text-3xl font-bold text-white mb-1">
                    {newLeadsCount} Inquiries
                  </div>
                  <span className="text-[10px] font-poppins text-[#777]">Pending producer response</span>
                </div>

                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#B5B5B5] mb-2">
                    <span className="text-xs font-poppins uppercase tracking-wider">Studio CSAT</span>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-oswald text-3xl font-bold text-emerald-400 mb-1">
                    4.98 / 5.0
                  </div>
                  <span className="text-[10px] font-poppins text-[#777]">120+ Verified Patron ratings</span>
                </div>
              </div>

              {/* Recent Orders Snapshot */}
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

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-raleway">
                    <thead className="bg-[#0A0A0A] text-[#777] font-poppins uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Order Ref</th>
                        <th className="p-3">Package / Recipient</th>
                        <th className="p-3">Assigned Lead</th>
                        <th className="p-3">Fulfillment Status</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e1e]">
                      {orders.slice(0, 4).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#141414] transition-colors">
                          <td className="p-3 font-oswald text-sm font-bold text-white tracking-wide">
                            {ord.orderNumber}
                          </td>
                          <td className="p-3">
                            <span className="font-medium text-white block">{ord.packageName}</span>
                            <span className="text-[11px] text-[#B5B5B5]">For: {ord.recipientName}</span>
                          </td>
                          <td className="p-3 text-[#CCCCCC]">{ord.assignedProducer}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-sm text-[10px] font-poppins uppercase font-bold ${
                                ord.fulfillmentStatus === 'COMPLETED'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : ord.fulfillmentStatus === 'CUSTOMER_REVIEW'
                                  ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40'
                                  : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                              }`}
                            >
                              {ord.fulfillmentStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 text-[#B48A3C] font-poppins">{ord.deliveryDate}</td>
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
                          value={lead.status}
                          onChange={(e: any) => handleUpdateLeadStatus(lead.id, e.target.value)}
                          className="bg-[#141414] border border-[#333] text-white text-[11px] font-poppins px-2 py-1 rounded-sm focus:outline-none"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="ARCHIVED">ARCHIVED</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <option value="READY">Ready</option>
                    <option value="IN_PRODUCTION">In Production</option>
                    <option value="QUALITY_REVIEW">Quality Review</option>
                    <option value="CUSTOMER_REVIEW">Customer Review</option>
                    <option value="COMPLETED">Completed</option>
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
                      <span className="text-xs bg-[#E50914] text-white px-2 py-0.5 rounded font-poppins">
                        ${selectedOrder.totalAmount} USD
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-xs font-oswald uppercase text-[#B5B5B5] hover:text-white"
                    >
                      Close Inspector ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-raleway">
                    <div>
                      <span className="text-[10px] font-poppins uppercase text-[#777] block">Patron & Contact</span>
                      <strong className="text-white block">{selectedOrder.customerName}</strong>
                      <span className="text-[#B5B5B5]">{selectedOrder.customerEmail}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-poppins uppercase text-[#777] block">Recipient / Protagonist</span>
                      <strong className="text-white block">{selectedOrder.recipientName}</strong>
                      <span className="text-[#B48A3C]">{selectedOrder.genre} • {selectedOrder.mood}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-poppins uppercase text-[#777] block">Assigned Lead</span>
                      <strong className="text-white block">{selectedOrder.assignedProducer}</strong>
                      <span className="text-[#777]">Due: {selectedOrder.deliveryDate}</span>
                    </div>
                  </div>

                  <div className="bg-[#0A0A0A] p-4 rounded-sm border border-[#222222] text-xs font-raleway">
                    <span className="text-[10px] font-poppins uppercase text-[#777] block mb-1">
                      Creative Story Brief & Anecdotes:
                    </span>
                    <p className="text-[#CCCCCC] italic">"{selectedOrder.storyBrief}"</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2A2A2A]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-poppins text-[#B48A3C]">Change Production Stage:</span>
                      {(['READY', 'IN_PRODUCTION', 'QUALITY_REVIEW', 'CUSTOMER_REVIEW', 'COMPLETED'] as FulfillmentStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, st)}
                          className={`px-2.5 py-1 text-[10px] font-oswald uppercase rounded ${
                            selectedOrder.fulfillmentStatus === st
                              ? 'bg-[#E50914] text-white font-bold'
                              : 'bg-[#1c1c1c] text-[#999] hover:text-white'
                          }`}
                        >
                          {st.replace('_', ' ')}
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
                        <th className="p-4">Target Delivery</th>
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
                          <td className="p-4 text-[#CCCCCC]">{ord.recipientName}</td>
                          <td className="p-4 text-[#B5B5B5]">{ord.customerEmail}</td>
                          <td className="p-4 font-oswald text-sm font-bold text-white">${ord.totalAmount}</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-sm text-[10px] font-poppins uppercase font-bold inline-block ${
                                ord.fulfillmentStatus === 'COMPLETED'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : ord.fulfillmentStatus === 'CUSTOMER_REVIEW'
                                  ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40'
                                  : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                              }`}
                            >
                              {ord.fulfillmentStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-[#B48A3C] font-poppins">{ord.deliveryDate}</td>
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
                        </div>
                        <span className="text-xs font-poppins text-[#777]">Received: {lead.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-poppins text-[#B5B5B5]">Lead Status:</span>
                        <select
                          value={lead.status}
                          onChange={(e: any) => handleUpdateLeadStatus(lead.id, e.target.value)}
                          className="bg-[#181818] border border-[#333] text-white text-xs font-poppins px-3 py-1.5 rounded-sm focus:outline-none"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="PROPOSAL_SENT">PROPOSAL SENT</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="ARCHIVED">ARCHIVED</option>
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
            </div>
          )}

          {/* TAB 4: SERVICES CATALOG & RATES */}
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

          {/* TAB 5: TEAM & CREATIVE ROSTER */}
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

          {/* TAB 6: FINANCIAL LEDGER */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-oswald text-2xl uppercase font-bold text-white tracking-wider">
                  Financial Ledger & Stripe Settlements
                </h2>
                <p className="font-raleway text-xs text-[#B5B5B5]">
                  Real-time transaction tracking, currency settlements, and escrow clearance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm">
                  <span className="text-[10px] font-poppins uppercase text-[#777] block">Gross Platform Sales</span>
                  <span className="font-oswald text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm">
                  <span className="text-[10px] font-poppins uppercase text-[#777] block">Refund Rate</span>
                  <span className="font-oswald text-3xl font-bold text-emerald-400">0.0%</span>
                </div>
                <div className="bg-[#101010] border border-[#222222] p-5 rounded-sm">
                  <span className="text-[10px] font-poppins uppercase text-[#777] block">Average Order Value (AOV)</span>
                  <span className="font-oswald text-3xl font-bold text-[#B48A3C]">$68.50</span>
                </div>
              </div>

              <div className="bg-[#101010] border border-[#222222] rounded-sm p-6 space-y-4">
                <h3 className="font-oswald text-lg uppercase font-bold text-white tracking-wider">
                  Settled Transactions
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-raleway">
                    <thead className="bg-[#0A0A0A] text-[#777] font-poppins uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Transaction ID</th>
                        <th className="p-3">Order Ref</th>
                        <th className="p-3">Client</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Channel</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e1e]">
                      {orders.map((ord, idx) => (
                        <tr key={ord.id} className="hover:bg-[#141414]">
                          <td className="p-3 font-mono text-[11px] text-[#777]">tx_stripe_99{idx}21</td>
                          <td className="p-3 font-oswald text-white font-bold">{ord.orderNumber}</td>
                          <td className="p-3 text-[#CCCCCC]">{ord.customerName}</td>
                          <td className="p-3 font-oswald text-white font-bold">${ord.totalAmount} USD</td>
                          <td className="p-3 text-[#B5B5B5]">Credit Card (Stripe)</td>
                          <td className="p-3 text-emerald-400 font-bold uppercase text-[10px]">Settled</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SYSTEM DIAGNOSTICS & LOGS */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-oswald text-2xl uppercase font-bold text-white tracking-wider">
                  System Diagnostics & Server Console
                </h2>
                <p className="font-raleway text-xs text-[#B5B5B5]">
                  Microservices heartbeat, database connectivity, and Express API logs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#101010] border border-[#222222] rounded-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-poppins uppercase text-[#777] block">Express API Service</span>
                    <strong className="text-white font-oswald text-base">Port 5000 (Active)</strong>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="p-4 bg-[#101010] border border-[#222222] rounded-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-poppins uppercase text-[#777] block">Vite Client Service</span>
                    <strong className="text-white font-oswald text-base">Port 5173 (Active)</strong>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="p-4 bg-[#101010] border border-[#222222] rounded-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-poppins uppercase text-[#777] block">Storage Vault</span>
                    <strong className="text-white font-oswald text-base">Cloudflare R2 / S3</strong>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-[#222222] rounded-sm p-4 font-mono text-[11px] text-[#A0A0A0] space-y-2">
                <span className="text-[#E50914] font-bold block mb-2 font-poppins">
                  [LIVE STREAMING SERVER LOGS — PINO PRETTY]:
                </span>
                <p>[2026-10-19 15:10:44] INFO: Legacy Pixels Server running on http://localhost:5000</p>
                <p>[2026-10-19 15:11:06] INFO: GET /api/health HTTP/1.1 200 OK (1.2ms)</p>
                <p>[2026-10-19 15:12:15] INFO: GET /api/services HTTP/1.1 200 OK (2.1ms)</p>
                <p>[2026-10-19 15:14:02] INFO: POST /api/orders/draft → Order Number Generated LP-2026-881920 (4.8ms)</p>
                <p className="text-emerald-400">[2026-10-19 15:28:38] SUCCESS: Monorepo compile verified. All 8 disciplines operational.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
