import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck, Truck, RefreshCcw, Star, ChevronLeft, Loader2, Minus, Plus } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

import { useCart } from '../context/CartContext';

const ProductDetailPage: React.FC = () => {
    const { refreshCart } = useCart();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data.data.product);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Product not found');
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            await api.post('/cart/add', {
                productId: product._id,
                quantity: quantity
            });
            await refreshCart();
            toast.success(`${product.name} added to cart!`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb / Back button */}
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 font-medium transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" /> Back to Products
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="aspect-square bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200/50 border border-white">
                            <img
                                src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="aspect-square bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary-500 cursor-pointer transition-all">
                                    <img src={product.images?.[0]} className="w-full h-full object-cover opacity-50 hover:opacity-100" />
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <div className="mb-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-bold mb-4 uppercase tracking-wider">
                                {product.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{product.name}</h1>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                    <span className="ml-2 text-slate-600 font-bold">4.8 (124 reviews)</span>
                                </div>
                                <span className="text-slate-300">|</span>
                                <span className={`font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <div className="mb-10">
                            <p className="text-4xl font-black text-slate-900">${product.price}</p>
                            <p className="mt-6 text-slate-600 text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6 mb-12">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center p-2 bg-white border border-slate-200 rounded-2xl">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        <Minus className="w-5 h-5 text-slate-600" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                                    >
                                        <Plus className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                                <p className="text-sm font-bold text-slate-500">Max. {product.stock} reachable</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart || product.stock === 0}
                                    className="flex-grow py-5 premium-gradient text-white rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary-500/40 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {addingToCart ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShoppingCart className="w-6 h-6" />}
                                    Add to Cart
                                </button>
                                <button className="p-5 bg-white border border-slate-200 rounded-[24px] text-slate-600 hover:text-red-500 hover:bg-red-50 transition-all">
                                    <Heart className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">2 Year Warranty</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                                    <RefreshCcw className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">30 Day Returns</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
