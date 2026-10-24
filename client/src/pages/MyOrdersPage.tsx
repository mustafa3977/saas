import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import {
  ShoppingBag,
  Clock,
  Eye,
  X,
  FileText,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Music,
} from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  serviceSlug: string;
  packageName: string;
  totalAmount: number;
  currency: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  payload?: any;
}

export const MyOrdersPage: React.FC = () => {
  const { isCustomerAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    if (!isCustomerAuthenticated) return;

    let isMounted = true;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await apiFetch('/api/orders/mine');
        const data = await res.json();
        if (isMounted) {
          if (res.ok && data.success && Array.isArray(data.data)) {
            setOrders(data.data);
          } else {
            setError(data.error || 'Failed to load your orders.');
          }
        }
      } catch {
        if (isMounted) {
          setError('Unable to load orders. Please check your connection.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, [isCustomerAuthenticated]);

  if (!authLoading && !isCustomerAuthenticated) {
    return <Navigate to="/login" state={{ from: '/my-orders' }} replace />;
  }

  const getStatusBadge = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-poppins uppercase tracking-wider font-semibold rounded-sm bg-amber-950/50 text-amber-300 border border-amber-800">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-poppins uppercase tracking-wider font-semibold rounded-sm bg-blue-950/50 text-blue-300 border border-blue-800">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'in_production':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-poppins uppercase tracking-wider font-semibold rounded-sm bg-purple-950/50 text-purple-300 border border-purple-800">
            <Sparkles className="w-3 h-3" /> In Production
          </span>
        );
      case 'quality_review':
      case 'customer_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-poppins uppercase tracking-wider font-semibold rounded-sm bg-cyan-950/50 text-cyan-300 border border-cyan-800">
            <Eye className="w-3 h-3" /> In Review
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-poppins uppercase tracking-wider font-semibold rounded-sm bg-emerald-950/50 text-emerald-300 border border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-poppins uppercase tracking-wider font-semibold rounded-sm bg-red-950/50 text-red-300 border border-red-800">
            <AlertCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-poppins uppercase tracking-wider font-semibold rounded-sm bg-gray-900 text-gray-300 border border-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-poppins uppercase tracking-[0.2em] text-[#B48A3C] mb-1">
              <ShoppingBag className="w-4 h-4 text-[#E50914]" />
              Patron Account
            </div>
            <h1 className="font-oswald text-3xl sm:text-4xl font-bold uppercase tracking-wider text-white">
              My <span className="text-[#E50914]">Orders</span>
            </h1>
            <p className="text-xs font-raleway text-[#B5B5B5] mt-1">
              Track the live studio production and delivery milestones of your bespoke projects.
            </p>
          </div>

          <Link
            to="/order/music"
            className="btn-cinematic-red self-start sm:self-center flex items-center gap-2 py-3 px-5 text-xs font-oswald tracking-widest uppercase font-semibold"
          >
            <span>Commission New Work</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-[#E50914]/10 border border-[#E50914]/40 rounded-sm text-xs font-raleway text-[#FF6B6B] flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-[#E50914] flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Orders List */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-8 h-8 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-poppins uppercase tracking-wider text-[#B5B5B5]">
              Retrieving commissions from production vault...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-sm p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#2A2A2A] flex items-center justify-center mx-auto text-[#B5B5B5]">
              <ShoppingBag className="w-8 h-8 text-[#E50914]" />
            </div>
            <h3 className="font-oswald text-xl uppercase font-bold text-white tracking-wider">
              No Commissions Found
            </h3>
            <p className="text-xs font-raleway text-[#B5B5B5] leading-relaxed">
              You have not initialized any studio orders yet. Create an original song or request a feature brief to begin.
            </p>
            <div className="pt-2">
              <Link to="/order/music" className="btn-cinematic-red inline-block py-2.5 px-6 text-xs uppercase font-oswald">
                Start Song Commission
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isPending = (order.status || '').toLowerCase() === 'pending';
              const createdDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recently';

              return (
                <div
                  key={order.id || order.orderNumber}
                  className="bg-[#0D0D0D] border border-[#2A2A2A] hover:border-[#B48A3C]/60 rounded-sm p-6 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-[#141414] border border-[#2A2A2A] flex items-center justify-center text-[#E50914]">
                        <Music className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-oswald text-lg font-bold text-white tracking-wider">
                            {order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <span className="text-xs font-poppins text-[#B48A3C] uppercase tracking-wider block">
                          {order.packageName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[10px] font-poppins uppercase tracking-wider text-[#777] block">
                          Total Amount
                        </span>
                        <span className="font-oswald text-lg font-bold text-white">
                          ${order.totalAmount} {order.currency}
                        </span>
                      </div>
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] font-poppins uppercase tracking-wider text-[#777] block">
                          Commissioned
                        </span>
                        <span className="text-xs font-poppins text-[#B5B5B5] flex items-center gap-1 justify-end">
                          <Calendar className="w-3 h-3 text-[#B48A3C]" />
                          {createdDate}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-cinematic flex items-center gap-1.5 py-2 px-3 text-xs uppercase font-oswald tracking-wider"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Status explanation notice */}
                  {isPending && (
                    <div className="p-3 bg-[#141414] border border-[#B48A3C]/30 rounded-sm flex items-start gap-3 text-xs font-raleway text-[#CCCCCC]">
                      <Clock className="w-4 h-4 text-[#B48A3C] flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block font-poppins uppercase tracking-wider text-[11px] mb-0.5">
                          Order Status: Pending
                        </strong>
                        <p className="text-[#B5B5B5] leading-relaxed">
                          We received your order. Our team will contact you to confirm details and payment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0D0D0D] border border-[#2A2A2A] rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                <div>
                  <span className="text-[10px] font-poppins uppercase tracking-widest text-[#B48A3C] block">
                    Commission Specification
                  </span>
                  <h3 className="font-oswald text-2xl font-bold uppercase text-white tracking-wider">
                    {selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-[#B5B5B5] hover:text-white rounded border border-[#2A2A2A] hover:border-[#E50914] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#141414] border border-[#222] rounded-sm text-xs font-raleway">
                <div>
                  <span className="text-[10px] uppercase font-poppins text-[#777] block">Status</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-poppins text-[#777] block">Total</span>
                  <strong className="text-white font-oswald text-base">
                    ${selectedOrder.totalAmount} {selectedOrder.currency}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-poppins text-[#777] block">Service</span>
                  <strong className="text-white truncate block">{selectedOrder.serviceSlug}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-poppins text-[#777] block">Date</span>
                  <strong className="text-white truncate block">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}
                  </strong>
                </div>
              </div>

              {selectedOrder.payload && (
                <div className="space-y-4">
                  {selectedOrder.payload.brief && (
                    <div className="space-y-2">
                      <h4 className="font-oswald text-sm uppercase text-white font-bold tracking-wider">
                        Creative Brief Details
                      </h4>
                      <div className="p-4 bg-[#141414] border border-[#222] rounded-sm text-xs font-raleway space-y-2">
                        {selectedOrder.payload.brief.recipientName && (
                          <div className="flex justify-between">
                            <span className="text-[#777]">Recipient:</span>
                            <span className="text-white font-semibold">
                              {selectedOrder.payload.brief.recipientName}
                            </span>
                          </div>
                        )}
                        {selectedOrder.payload.brief.occasion && (
                          <div className="flex justify-between">
                            <span className="text-[#777]">Occasion:</span>
                            <span className="text-white capitalize">
                              {selectedOrder.payload.brief.occasion}
                            </span>
                          </div>
                        )}
                        {selectedOrder.payload.brief.genre && (
                          <div className="flex justify-between">
                            <span className="text-[#777]">Genre / Style:</span>
                            <span className="text-white">{selectedOrder.payload.brief.genre}</span>
                          </div>
                        )}
                        {selectedOrder.payload.brief.mood && (
                          <div className="flex justify-between">
                            <span className="text-[#777]">Mood:</span>
                            <span className="text-white">{selectedOrder.payload.brief.mood}</span>
                          </div>
                        )}
                        {selectedOrder.payload.brief.songLanguage && (
                          <div className="flex justify-between">
                            <span className="text-[#777]">Language:</span>
                            <span className="text-white">{selectedOrder.payload.brief.songLanguage}</span>
                          </div>
                        )}
                        {selectedOrder.payload.brief.storyDetails && (
                          <div className="pt-2 border-t border-[#222]">
                            <span className="text-[#777] block mb-1">Story & Memory Details:</span>
                            <p className="text-[#B5B5B5] whitespace-pre-wrap leading-relaxed">
                              {selectedOrder.payload.brief.storyDetails}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedOrder.payload.customer && (
                    <div className="space-y-2">
                      <h4 className="font-oswald text-sm uppercase text-white font-bold tracking-wider">
                        Delivery Contact
                      </h4>
                      <div className="p-4 bg-[#141414] border border-[#222] rounded-sm text-xs font-raleway space-y-1 text-[#B5B5B5]">
                        <p>
                          <strong className="text-white">Name:</strong> {selectedOrder.payload.customer.name}
                        </p>
                        <p>
                          <strong className="text-white">Email:</strong> {selectedOrder.payload.customer.email}
                        </p>
                        {selectedOrder.payload.customer.phone && (
                          <p>
                            <strong className="text-white">Phone:</strong> {selectedOrder.payload.customer.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="btn-cinematic py-2.5 px-6 text-xs uppercase font-oswald"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
