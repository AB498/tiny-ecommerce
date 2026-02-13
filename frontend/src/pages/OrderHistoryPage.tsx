import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, ChevronRight, Loader2, ExternalLink, XCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const OrderHistoryPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/my-orders');
            setOrders(response.data.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId: string) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        setCancellingId(orderId);
        try {
            await api.patch(`/orders/${orderId}/cancel`);
            toast.success('Order cancelled successfully');
            fetchOrders();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5 text-amber-500" />;
            case 'shipped': return <Truck className="w-5 h-5 text-blue-500" />;
            case 'delivered': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-slate-400" />;
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">My Orders</h1>
                        <p className="text-slate-500 font-medium">History of your premium purchases</p>
                    </div>
                    <Link to="/products" className="flex items-center gap-2 text-primary-600 font-bold hover:underline underline-offset-4">
                        Continue Shopping <ExternalLink className="w-4 h-4" />
                    </Link>
                </header>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[40px] shadow-sm">
                        <Package className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
                        <p className="text-slate-500 mb-8">Ready to make your first purchase?</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
                            Browse Collection
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, idx) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-md transition-shadow"
                            >
                                <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-50 bg-slate-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                                            <Package className="w-6 h-6 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                                            <Link to={`/orders/${order._id}`} className="font-extrabold text-primary-600 hover:text-primary-700 transition-colors">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-8">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                            <p className="font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                                            <p className="font-bold text-slate-900">${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                            <div className={`flex items-center gap-2 px-3 py-1 border rounded-full shadow-sm ${getStatusStyles(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="text-sm font-bold capitalize">{order.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8">
                                    <div className="mb-6 flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Shipping to</p>
                                            <p className="text-slate-700 font-medium italic">{order.shippingAddress}</p>
                                        </div>
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                disabled={cancellingId === order._id}
                                                className="flex items-center gap-2 text-red-500 font-bold text-sm hover:text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                {cancellingId === order._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                Cancel Order
                                            </button>
                                        )}
                                        {order.status !== 'pending' && order.status !== 'cancelled' && (
                                            <Link to={`/orders/${order._id}`} className="hidden sm:flex items-center gap-2 text-primary-600 font-bold text-sm hover:gap-3 transition-all">
                                                View Details <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>

                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {order.items.map((item: any, i: number) => (
                                            <div key={i} className="flex-shrink-0 w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                                                <img src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'} className="w-full h-full object-cover" alt="product" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
