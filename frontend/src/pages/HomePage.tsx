import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/layout/Hero';
import { motion } from 'framer-motion';
import { ChevronRight, Star, ShoppingCart, Loader2, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const HomePage: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const { refreshCart } = useCart();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await api.get('/products');
                // Slice top 4 for featured section
                setFeaturedProducts(response.data.data.products.slice(0, 4));
            } catch (error) {
                console.error('Error fetching featured products:', error);
                // Fallback for static demo if API fails
                setFeaturedProducts([
                    { _id: '1', name: 'Premium Noise Cancelling Headphones', price: 299, category: 'Electronics', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'] },
                    { _id: '2', name: 'Minimalist Mechanical Keyboard', price: 159, category: 'Electronics', images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop'] },
                    { _id: '3', name: 'Ultra-Slim Smart Watch Pro', price: 349, category: 'Electronics', images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'] },
                    { _id: '4', name: 'Portable Wireless Speaker S2', price: 89, category: 'Electronics', images: ['https://images.unsplash.com/photo-1572536147748-ae512df4f82e?q=80&w=1000&auto=format&fit=crop'] },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

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
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Hero />

            {/* Categories Section */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Shop by Category</h2>
                        <p className="text-slate-500 max-w-lg">Browse our wide range of categories to find exactly what you're looking for.</p>
                    </div>
                    <Link to="/products" className="hidden sm:flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
                        See All Categories <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: 'Electronics', path: '/images/categories/electronics.svg', color: 'bg-blue-50 text-blue-600' },
                        { name: 'Fashion', path: '/images/categories/fashion.svg', color: 'bg-purple-50 text-purple-600' },
                        { name: 'Home & Living', path: '/images/categories/home.svg', color: 'bg-orange-50 text-orange-600' },
                        { name: 'Accessories', path: '/images/categories/accessories.svg', color: 'bg-emerald-50 text-emerald-600' }
                    ].map((cat) => (
                        <motion.div
                            key={cat.name}
                            whileHover={{ y: -10 }}
                            className="group relative h-48 rounded-[32px] overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col items-center justify-center p-6"
                        >
                            <Link to={`/products?category=${encodeURIComponent(cat.name)}`} className="flex flex-col items-center gap-4">
                                <div className={`w-20 h-20 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <img
                                        src={cat.path}
                                        alt={cat.name}
                                        className="w-12 h-12"
                                    />
                                </div>
                                <h3 className="text-slate-900 text-xl font-bold group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Hot Pick Products</h2>
                        <p className="text-slate-500">Our most popular items chosen by thousands of customers worldwide.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="bg-slate-200 animate-pulse h-80 rounded-[40px]" />
                            ))
                        ) : (
                            featuredProducts.map((product) => (
                                <motion.div
                                    key={product._id}
                                    whileHover={{ y: -5 }}
                                    className="group bg-slate-50 rounded-[40px] p-4 border border-slate-100 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="relative aspect-square rounded-[32px] overflow-hidden mb-6 bg-white">
                                        <Link to={`/products/${product._id}`}>
                                            <img
                                                src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </Link>
                                        <button
                                            onClick={() => toast.info('Wishlist is not implemented yet!', { position: 'bottom-right' })}
                                            className="absolute top-4 right-4 w-12 h-12 glass rounded-full flex items-center justify-center text-slate-700 hover:text-primary-600 transition-colors"
                                        >
                                            <Star className="w-5 h-5 fill-current text-yellow-500 border-none" />
                                        </button>
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
                                        <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">{product.category || 'New Arrival'}</span>
                                        <Link to={`/products/${product._id}`}>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 truncate hover:text-primary-600 transition-colors cursor-pointer">{product.name}</h3>
                                        </Link>
                                        <div className="flex justify-between items-center">
                                            <p className="text-2xl font-black text-slate-900">${product.price}</p>
                                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span>{product.rating || '4.8'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Footer Simulation */}
            <footer className="bg-slate-900 text-white py-20 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/images/logo.svg" alt="Logo" className="h-10 w-auto" />
                            <h3 className="text-2xl font-black">SpeedrunShop</h3>
                        </div>
                        <p className="text-slate-400 mb-6">Premium e-commerce experience built in under 2 hours.</p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: '#' },
                                { Icon: Twitter, href: '#' },
                                { Icon: Instagram, href: '#' },
                                { Icon: Linkedin, href: '#' }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer group"
                                >
                                    <social.Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">Featured Items</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Newsletter</h4>
                        <p className="text-slate-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Email address" className="bg-slate-800 border-none rounded-xl px-4 py-2 flex-grow outline-none focus:ring-2 focus:ring-primary-600" />
                            <button className="premium-gradient px-4 py-2 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-primary-500/20 flex items-center justify-center">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
