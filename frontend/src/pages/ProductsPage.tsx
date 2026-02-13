import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Filter, Search, ShoppingCart, Star, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

import { useCart } from '../context/CartContext';

const ProductsPage: React.FC = () => {
    const { refreshCart } = useCart();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Products');

    const categories = ['All Products', 'Electronics', 'Fashion', 'Home & Living', 'Accessories'];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params: any = {};
                if (selectedCategory !== 'All Products') params.category = selectedCategory;
                if (searchTerm) params.search = searchTerm;

                const response = await api.get('/products', { params });
                setProducts(response.data.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchProducts();
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [searchTerm, selectedCategory]);

    const handleAddToCart = async (productId: string, productName: string) => {
        setAddingToCart(productId);
        try {
            await api.post('/cart/add', { productId, quantity: 1 });
            await refreshCart();
            toast.success(`${productName} added to cart!`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        } finally {
            setAddingToCart(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Explore Products</h1>
                        <p className="text-slate-500">Discover {products.length} premium products ready for you.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-64 space-y-8">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Categories
                            </h3>
                            <div className="space-y-3">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center gap-3 group cursor-pointer" onClick={() => setSelectedCategory(cat)}>
                                        <div className={`w-5 h-5 rounded-md border-2 transition-all ${selectedCategory === cat ? 'bg-primary-500 border-primary-500' : 'border-slate-200 group-hover:border-primary-500'}`} />
                                        <span className={`transition-colors ${selectedCategory === cat ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 mb-4">Price Range</h3>
                            <div className="px-2">
                                <div className="h-1.5 bg-slate-200 rounded-full relative">
                                    <div className="absolute inset-x-0 h-full bg-primary-500 rounded-full" />
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary-500 rounded-full cursor-pointer shadow-md" />
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary-500 rounded-full cursor-pointer shadow-md" />
                                </div>
                                <div className="flex justify-between mt-4 text-sm font-bold text-slate-600">
                                    <span>$0</span>
                                    <span>$1000+</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-slate-200 animate-pulse h-80 rounded-[40px]" />
                                ))
                            ) : products.length === 0 ? (
                                <div className="col-span-full text-center py-20">
                                    <Search className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-slate-900">No products found</h2>
                                    <p className="text-slate-500">Try adjusting your search or category filters.</p>
                                </div>
                            ) : (
                                products.map((product) => (
                                    <motion.div
                                        key={product._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        whileHover={{ y: -5 }}
                                        className="group bg-white rounded-[40px] p-4 border border-slate-100 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="relative aspect-square rounded-[32px] overflow-hidden mb-6 bg-slate-100">
                                            <Link to={`/products/${product._id}`}>
                                                <img
                                                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </Link>
                                            <div className="absolute inset-x-4 bottom-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-300">
                                                <button
                                                    onClick={() => handleAddToCart(product._id, product.name)}
                                                    disabled={addingToCart === product._id}
                                                    className="w-full py-3 premium-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary-500/30 active:scale-95 transition-transform disabled:opacity-70"
                                                >
                                                    {addingToCart === product._id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <ShoppingCart className="w-5 h-5" />
                                                    )}
                                                    {addingToCart === product._id ? 'Adding...' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="px-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{product.category || 'General'}</span>
                                                <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                    <span>4.8</span>
                                                </div>
                                            </div>
                                            <Link to={`/products/${product._id}`}>
                                                <h3 className="text-lg font-bold text-slate-900 mb-2 truncate hover:text-primary-600 transition-colors uppercase cursor-pointer">{product.name}</h3>
                                            </Link>
                                            <p className="text-2xl font-black text-slate-900">${product.price}</p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
