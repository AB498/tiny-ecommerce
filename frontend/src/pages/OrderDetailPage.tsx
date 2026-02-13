import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    ChevronLeft,
    MapPin,
    Calendar,
    CreditCard,
    Loader2,
    ShoppingBag
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

const OrderDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data.data.order);
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to load order details');
                navigate('/orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, navigate]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'shipped': return <Truck className="w-5 h-5" />;
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'cancelled': return <XCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back to Orders
                    </button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 mb-2">Order Details</h1>
                            <p className="text-slate-500 font-medium">Order ID: <span className="text-slate-900">#{order._id.toUpperCase()}</span></p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 border rounded-2xl shadow-sm w-fit ${getStatusStyles(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="font-bold capitalize">{order.status}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Items Section */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-slate-400" />
                                <h2 className="font-bold text-slate-900">Order Items</h2>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {order.items.map((item: any) => (
                                    <div key={item._id} className="p-6 flex items-center gap-6 group">
                                        <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                                            <img
                                                src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 truncate mb-1">{item.product?.name || 'Product Removed'}</h3>
                                            <p className="text-sm font-bold text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-xs font-bold text-slate-400">${item.price} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Customer & Shipping Section for Admin */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-slate-400" />
                                <h2 className="font-bold text-slate-900">Shipping Details</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Customer Information</p>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-900">{order.user?.firstName} {order.user?.lastName}</p>
                                            <p className="text-sm text-slate-500 font-medium">{order.user?.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Delivery Address</p>
                                        <p className="text-slate-700 font-medium leading-relaxed italic">
                                            {order.shippingAddress}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-6">
                            <h2 className="text-xl font-black text-slate-900 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600">FREE</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 font-medium">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-slate-900 font-black">Total</span>
                                    <span className="text-2xl font-black text-primary-600">${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                <CreditCard className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Method</p>
                                    <p className="text-sm font-bold text-slate-900">Cash on Delivery</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-6">
                            <h2 className="text-xl font-black text-slate-900 mb-4">Timeline</h2>
                            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-slate-50">
                                <div className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-100 border-4 border-white shadow-sm flex items-center justify-center">
                                        <Calendar className="w-3 h-3 text-primary-600" />
                                    </div>
                                    <p className="text-sm font-black text-slate-900">Order Placed</p>
                                    <p className="text-xs text-slate-400 font-bold">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div className={`relative pl-10 ${['shipped', 'delivered'].includes(order.status) ? '' : 'opacity-50'}`}>
                                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${['shipped', 'delivered'].includes(order.status) ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                        <Truck className={`w-3 h-3 ${['shipped', 'delivered'].includes(order.status) ? 'text-blue-600' : 'text-slate-400'}`} />
                                    </div>
                                    <p className="text-sm font-black text-slate-900">Order Shipped</p>
                                    <p className="text-xs text-slate-400 font-bold">
                                        {['shipped', 'delivered'].includes(order.status) ? 'Completed' : 'Pending...'}
                                    </p>
                                </div>
                                <div className={`relative pl-10 ${order.status === 'delivered' ? '' : 'opacity-50'}`}>
                                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${order.status === 'delivered' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                        <CheckCircle className={`w-3 h-3 ${order.status === 'delivered' ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    </div>
                                    <p className="text-sm font-black text-slate-900">Delivered</p>
                                    <p className="text-xs text-slate-400 font-bold">
                                        {order.status === 'delivered' ? 'Arrived' : 'Pending...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
