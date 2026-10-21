import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Sliders,
  Shield,
  Play,
  Pause,
  Download,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Music,
  Send,
  MessageSquare,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';
import { FulfillmentStatus } from '@legacypixels/shared';

interface OrderRecord {
  publicNumber: string;
  packageName: string;
  recipientName: string;
  genre: string;
  mood: string;
  story: string;
  totalCents: number;
  paymentStatus: string;
  fulfillmentStatus: FulfillmentStatus;
  createdAt: string;
  estimatedDeliveryDate: string;
  audioPreviewUrl?: string;
  lyricsDraft?: string;
}

const DEFAULT_ORDERS: OrderRecord[] = [
  {
    publicNumber: 'LP-2026-881920',
    packageName: 'Cinematic Song (Flagship)',
    recipientName: 'Layla & Zayd',
    genre: 'Cinematic Pop & Orchestral Strings',
    mood: 'Romantic & Intimate',
    story:
      'Met in Lake Como in autumn 2018 during a downpour under a café awning. First dance at wedding.',
    totalCents: 6800,
    paymentStatus: 'paid',
    fulfillmentStatus: 'CUSTOMER_REVIEW',
    createdAt: '2026-10-14',
    estimatedDeliveryDate: '2026-10-19',
    audioPreviewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    lyricsDraft:
      "Verse 1:\nUnderneath the Tuscan rain, two strangers sheltered from the grey\nA stolen glance across the glass, before the storm was washed away...\n\nChorus:\nAnd here we stand where time stands still\nThrough every valley, over every hill\nLayla and Zayd, forever true\nMy heartbeat writes its song to you.",
  },
  {
    publicNumber: 'LP-2026-319042',
    packageName: 'Personal Song',
    recipientName: 'Marcus Vance Sr.',
    genre: 'Acoustic Folk Ballad',
    mood: 'Heartwarming & Emotional',
    story: 'Celebrating 60th birthday, father of three who built the family woodworking workshop.',
    totalCents: 2900,
    paymentStatus: 'paid',
    fulfillmentStatus: 'IN_PRODUCTION',
    createdAt: '2026-10-17',
    estimatedDeliveryDate: '2026-10-22',
  },
];

const STATUS_STEPS: { status: FulfillmentStatus; label: string }[] = [
  { status: 'READY', label: 'Brief Verified' },
  { status: 'IN_PRODUCTION', label: 'Recording & Mixing' },
  { status: 'QUALITY_REVIEW', label: 'Senior QC Review' },
  { status: 'CUSTOMER_REVIEW', label: 'Patron Screening' },
  { status: 'COMPLETED', label: 'Broadcast Master Delivered' },
];

export const PortalPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'customer' | 'producer' | 'admin'>('customer');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>('LP-2026-881920');

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35); // percent

  // Revision Modal State
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [revisionSuccess, setRevisionSuccess] = useState(false);

  // Chat message state
  const [messages, setMessages] = useState([
    {
      sender: 'producer',
      name: 'Elena Rostova (Lead Composer)',
      text: "Greetings! We've recorded the live acoustic cello track for Layla & Zayd's master cut. Please listen to preview v1.2 above and let us know your impressions!",
      time: '10:45 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Load orders from localStorage or default
  useEffect(() => {
    const saved = localStorage.getItem('lp_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrders([...parsed, ...DEFAULT_ORDERS]);
          setSelectedOrderNumber(parsed[0].publicNumber);
          return;
        }
      } catch (e) {}
    }
    setOrders(DEFAULT_ORDERS);
  }, []);

  const currentOrder = orders.find((o) => o.publicNumber === selectedOrderNumber) || orders[0] || DEFAULT_ORDERS[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      sender: activeRole,
      name: activeRole === 'customer' ? 'You (Patron)' : activeRole === 'producer' ? 'Producer Desk' : 'Executive Admin',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setChatInput('');

    // Simulate quick auto-reply from Producer desk
    if (activeRole === 'customer') {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'producer',
            name: 'Elena Rostova (Lead Composer)',
            text: 'Thank you for your note! We have received your comment and our mix engineer is reviewing.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1500);
    }
  };

  const handleStatusChange = (newStatus: FulfillmentStatus) => {
    const updated = orders.map((o) =>
      o.publicNumber === currentOrder.publicNumber ? { ...o, fulfillmentStatus: newStatus } : o
    );
    setOrders(updated);
  };

  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) return;

    handleStatusChange('IN_REVISION' as FulfillmentStatus);
    setRevisionSuccess(true);
    setMessages((prev) => [
      ...prev,
      {
        sender: 'customer',
        name: 'Revision Request Filed',
        text: `Requested Changes: ${revisionNotes}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setTimeout(() => {
      setIsRevisionModalOpen(false);
      setRevisionSuccess(false);
      setRevisionNotes('');
    }, 2000);
  };

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === currentOrder.fulfillmentStatus);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      {/* Top Banner / Role Switcher */}
      <section className="bg-[#0D0D0D] border-b border-[#2A2A2A] py-6 sticky top-20 z-40">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#1c1c1c] border border-[#B48A3C]/50 flex items-center justify-center font-oswald text-[#B48A3C] font-bold">
              LP
            </div>
            <div>
              <span className="text-[10px] font-poppins uppercase tracking-widest text-[#E50914] block">
                Production Command Portal
              </span>
              <h1 className="font-oswald text-xl uppercase font-bold text-white">
                CLIENT & PRODUCER DESK
              </h1>
            </div>
          </div>

          {/* Role Persona Toggle */}
          <div className="flex items-center gap-2 bg-[#141414] border border-[#2A2A2A] p-1 rounded-sm">
            <span className="text-[11px] font-poppins text-[#B5B5B5] px-2">Preview Persona:</span>
            <button
              onClick={() => setActiveRole('customer')}
              className={`px-3 py-1 text-xs font-oswald uppercase tracking-wider rounded transition-all ${
                activeRole === 'customer'
                  ? 'bg-[#E50914] text-white font-semibold'
                  : 'text-[#B5B5B5] hover:text-white'
              }`}
            >
              Patron View
            </button>
            <button
              onClick={() => setActiveRole('producer')}
              className={`px-3 py-1 text-xs font-oswald uppercase tracking-wider rounded transition-all ${
                activeRole === 'producer'
                  ? 'bg-[#B48A3C] text-black font-semibold'
                  : 'text-[#B5B5B5] hover:text-white'
              }`}
            >
              Producer View
            </button>
            <button
              onClick={() => setActiveRole('admin')}
              className={`px-3 py-1 text-xs font-oswald uppercase tracking-wider rounded transition-all ${
                activeRole === 'admin'
                  ? 'bg-white text-black font-semibold'
                  : 'text-[#B5B5B5] hover:text-white'
              }`}
            >
              Admin View
            </button>
          </div>
        </div>
      </section>

      {/* Main Portal View */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Admin Metric Overview if Admin View */}
        {activeRole === 'admin' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm">
              <span className="text-[10px] font-poppins uppercase text-[#B5B5B5] block">Active Studio Queue</span>
              <span className="font-oswald text-3xl font-bold text-white">18 Orders</span>
            </div>
            <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm">
              <span className="text-[10px] font-poppins uppercase text-[#B5B5B5] block">MTD Gross Bookings</span>
              <span className="font-oswald text-3xl font-bold text-[#E50914]">$14,850 USD</span>
            </div>
            <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm">
              <span className="text-[10px] font-poppins uppercase text-[#B5B5B5] block">Average Turnaround</span>
              <span className="font-oswald text-3xl font-bold text-[#B48A3C]">3.8 Days</span>
            </div>
            <div className="p-5 bg-[#141414] border border-[#2A2A2A] rounded-sm">
              <span className="text-[10px] font-poppins uppercase text-[#B5B5B5] block">Patron CSAT Rating</span>
              <span className="font-oswald text-3xl font-bold text-emerald-400">4.98 / 5.0</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Orders Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-oswald text-base uppercase font-bold text-white tracking-wider">
                Production Queue ({orders.length})
              </h3>
              <Link to="/order/music" className="text-xs font-poppins text-[#E50914] hover:underline">
                + New Commission
              </Link>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => {
                const isSelected = ord.publicNumber === currentOrder.publicNumber;
                return (
                  <div
                    key={ord.publicNumber}
                    onClick={() => setSelectedOrderNumber(ord.publicNumber)}
                    className={`p-4 rounded-sm border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#181818] border-[#E50914] shadow-[0_0_15px_rgba(229,9,20,0.2)]'
                        : 'bg-[#141414] border-[#2A2A2A] hover:border-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-oswald text-xs tracking-wider text-[#E50914] font-bold">
                        {ord.publicNumber}
                      </span>
                      <span className="text-[10px] font-poppins text-[#B48A3C] bg-[#B48A3C]/10 px-2 py-0.5 rounded-sm">
                        {ord.fulfillmentStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-oswald text-base uppercase font-bold text-white leading-snug">
                      {ord.packageName}
                    </h4>
                    <p className="font-raleway text-xs text-[#B5B5B5] mt-1">
                      For: <strong className="text-white">{ord.recipientName}</strong>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Main Detail Screen (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Order Status Timeline Tracker */}
            <div className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#2A2A2A]">
                <div>
                  <span className="text-[10px] font-poppins uppercase tracking-widest text-[#B5B5B5] block">
                    Order Reference
                  </span>
                  <h2 className="font-oswald text-2xl uppercase font-bold text-white">
                    {currentOrder.publicNumber} — {currentOrder.packageName}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-poppins uppercase text-[#B5B5B5] block">
                    Target Delivery
                  </span>
                  <span className="font-oswald text-base text-[#B48A3C] font-semibold">
                    {currentOrder.estimatedDeliveryDate}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="relative">
                <div className="hidden sm:block absolute top-4 left-4 right-4 h-0.5 bg-[#2A2A2A] z-0" />
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone = currentStepIndex >= idx;
                    const isCurrent = currentOrder.fulfillmentStatus === step.status;
                    return (
                      <div key={step.status} className="flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-oswald text-xs mb-2 transition-all ${
                            isCurrent
                              ? 'bg-[#E50914] text-white ring-4 ring-[#E50914]/30'
                              : isDone
                              ? 'bg-white text-black'
                              : 'bg-[#1c1c1c] text-[#666] border border-[#2A2A2A]'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] font-poppins uppercase tracking-wider ${
                            isCurrent
                              ? 'text-[#E50914] font-bold'
                              : isDone
                              ? 'text-white'
                              : 'text-[#666]'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Producer Controls to advance status if in Producer/Admin mode */}
              {(activeRole === 'producer' || activeRole === 'admin') && (
                <div className="mt-8 pt-4 border-t border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3 bg-[#0D0D0D] p-3 rounded-sm">
                  <span className="text-xs font-poppins text-[#B48A3C] uppercase">
                    Producer Override Status:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_STEPS.map((s) => (
                      <button
                        key={s.status}
                        onClick={() => handleStatusChange(s.status)}
                        className={`px-2.5 py-1 text-[10px] font-oswald uppercase rounded border ${
                          currentOrder.fulfillmentStatus === s.status
                            ? 'bg-[#E50914] border-[#E50914] text-white'
                            : 'bg-[#141414] border-[#2A2A2A] text-[#B5B5B5] hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Screening Room / Audio Master Player */}
            <div className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#E50914]" />
                  <h3 className="font-oswald text-lg uppercase font-bold text-white tracking-wider">
                    Screening Room Master Preview (v1.2)
                  </h3>
                </div>
                <span className="text-[10px] font-poppins text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-sm">
                  Broadcast Spec • 24-Bit / 96kHz
                </span>
              </div>

              {/* Player UI */}
              <div className="p-6 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm space-y-4">
                <div className="flex items-center justify-between text-xs font-poppins text-[#B5B5B5]">
                  <span>Track: <strong>{currentOrder.recipientName} Anthem</strong> ({currentOrder.genre})</span>
                  <span>01:12 / 03:24</span>
                </div>

                {/* Animated Waveform bar */}
                <div className="flex items-end gap-1 h-14 py-2 cursor-pointer">
                  {[40, 65, 30, 85, 95, 60, 45, 75, 90, 50, 70, 80, 60, 40, 95, 100, 70, 55, 80, 90, 65, 45, 30, 60, 85, 90, 75, 50, 40, 70, 85, 95, 80, 65, 45, 35, 60, 75, 90, 55].map((h, i) => (
                    <div
                      key={i}
                      onClick={() => setAudioProgress((i / 40) * 100)}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        i <= (audioProgress / 100) * 40
                          ? 'bg-[#E50914]'
                          : 'bg-[#2A2A2A] hover:bg-[#B48A3C]'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                {/* Player Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 bg-[#E50914] hover:bg-[#ff1f2d] text-white px-5 py-2 rounded-sm text-xs font-oswald uppercase tracking-widest font-semibold transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isPlaying ? 'Pause Audio' : 'Play Master Preview'}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsRevisionModalOpen(true)}
                      className="btn-cinematic text-xs py-2 px-4 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request Revision</span>
                    </button>

                    <a
                      href="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                      download="LegacyPixels-Song-Master.mp3"
                      className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-sm text-xs font-oswald uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Masters</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Lyrics Draft & Story Card */}
            {currentOrder.lyricsDraft && (
              <div className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2A2A2A]">
                  <h3 className="font-oswald text-lg uppercase font-bold text-white tracking-wider">
                    Approved Lyrical Architecture
                  </h3>
                  <span className="text-xs font-poppins text-[#B48A3C]">Lead Vocalist: Duet Harmony</span>
                </div>

                <pre className="font-raleway text-xs sm:text-sm text-[#CCCCCC] whitespace-pre-wrap leading-relaxed bg-[#0A0A0A] p-5 rounded border border-[#2A2A2A]/40">
                  {currentOrder.lyricsDraft}
                </pre>
              </div>
            )}

            {/* Direct Producer Messaging Desk */}
            <div className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#E50914]" />
                  <h3 className="font-oswald text-lg uppercase font-bold text-white tracking-wider">
                    Direct Producer Message Thread
                  </h3>
                </div>
                <span className="text-[10px] font-poppins text-[#B5B5B5]">Encrypted Studio Feed</span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-4">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-sm text-xs font-raleway ${
                      m.sender === 'producer'
                        ? 'bg-[#1C1C1C] border border-[#2A2A2A]'
                        : 'bg-[#E50914]/10 border border-[#E50914]/30 ml-8'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-poppins text-[10px] uppercase font-bold text-[#B48A3C]">
                        {m.name}
                      </span>
                      <span className="text-[9px] text-[#777] font-poppins">{m.time}</span>
                    </div>
                    <p className="text-white/90 leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question or leave timing notes for the engineer..."
                  className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                />
                <button
                  type="submit"
                  className="btn-cinematic-red text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Revision Modal */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-sm max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="font-oswald text-xl uppercase font-bold text-white mb-2">
              Request Production Revision
            </h3>
            <p className="font-raleway text-xs text-[#B5B5B5] mb-4">
              Your order includes revision rounds. Please state specific lyric, tempo, or arrangement changes.
            </p>

            {revisionSuccess ? (
              <div className="py-6 text-center text-emerald-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <p className="font-oswald text-lg uppercase text-white">Revision Queue Updated</p>
                <p className="text-xs font-raleway text-[#B5B5B5]">The studio has shifted status to IN REVISION.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestRevision} className="space-y-4">
                <textarea
                  required
                  rows={4}
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="e.g. In the second verse, please change the lyric to specifically mention Lake Como instead of 'the lake'..."
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#E50914]"
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRevisionModalOpen(false)}
                    className="btn-cinematic text-xs py-2 px-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-cinematic-red text-xs py-2 px-4"
                  >
                    Transmit Revision
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
