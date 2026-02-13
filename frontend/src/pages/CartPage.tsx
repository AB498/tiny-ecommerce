import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Loader2, CreditCard, MapPin } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage: React.FC = () => {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const navigate = useNavigate();
    const { refreshCart } = useCart();

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            setCart(response.data.data.cart);
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (productId: string, currentQty: number, delta: number) => {
        const newQty = Math.max(1, currentQty + delta);
        if (newQty === currentQty) return;

        try {
            await api.post('/cart/add', { productId, quantity: delta });
            fetchCart();
            refreshCart();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    const removeItem = async (productId: string) => {
        try {
            await api.delete(`/cart/${productId}`);
            toast.info('Item removed from cart');
            fetchCart();
            refreshCart();
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shippingAddress) {
            toast.warning('Please provide a shipping address');
            return;
        }

        setCheckingOut(true);
        try {
            await api.post('/orders', { shippingAddress });
            toast.success('Order placed successfully!');
            refreshCart();
            navigate('/orders');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Checkout failed');
        } finally {
            setCheckingOut(false);
        }
    };

    const total = cart?.items.reduce((acc: number, item: any) =>
        acc + (item.product.price * item.quantity), 0) || 0;

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Shopping Bag</h1>
                    <p className="text-slate-500 font-medium">You have {cart?.items.length || 0} items in your bag</p>
                </header>

                {!cart || cart.items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white rounded-[40px] shadow-xl shadow-slate-200/50"
                    >
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <ShoppingBag className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your bag is empty</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything yet. Start exploring our premium collection.</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 premium-gradient text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-primary-500/30 transition-all">
                            Browse Products <ArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence>
                                {cart.items.map((item: any) => (
                                    <motion.div
                                        key={item.product._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        className="bg-white p-6 rounded-[32px] shadow-sm flex flex-col sm:flex-row gap-6 items-center group"
                                    >
                                        <div className="w-32 h-32 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="text-xl font-bold text-slate-900 mb-1">{item.product.name}</h3>
                                            <p className="text-slate-500 text-sm font-medium mb-4 uppercase tracking-wider">{item.product.category}</p>

                                            <div className="flex items-center justify-center sm:justify-start gap-4">
                                                <div className="flex items-center p-1 bg-slate-50 rounded-xl border border-slate-100">
                                                    <button onClick={() => updateQuantity(item.product._id, item.quantity, -1)} className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm">
                                                        <Minus className="w-4 h-4 text-slate-600" />
                                                    </button>
                                                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.product._id, item.quantity, 1)} className="p-1.5 hover:bg-white rounded-lg transition-all shadow-sm">
                                                        <Plus className="w-4 h-4 text-slate-600" />
                                                    </button>
                                                </div>
                                                <button onClick={() => removeItem(item.product._id)} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-sm text-slate-400 font-bold">${item.product.price} / unit</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Summary / Checkout */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 sticky top-28 border border-white">
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-primary-600" /> Summary
                                </h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Subtotal</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 font-medium">
                                        <span>Estimated Shipping</span>
                                        <span className="text-green-600 font-bold uppercase text-xs">Free</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between">
                                        <span className="text-xl font-bold text-slate-900">Total</span>
                                        <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <form onSubmit={handleCheckout} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Shipping Address</label>
                                        <div className="relative">
                                            <textarea
                                                required
                                                rows={3}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium text-sm"
                                                placeholder="Street, City, Country, Zip"
                                                value={shippingAddress}
                                                onChange={(e) => setShippingAddress(e.target.value)}
                                            />
                                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={checkingOut}
                                        className="w-full py-5 premium-gradient text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary-500/40 transition-all active:scale-95 disabled:opacity-70 group"
                                    >
                                        {checkingOut ? (
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        ) : (
                                            <>
                                                Confirm Order
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <p className="mt-6 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">Secure SSL Checkout</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
