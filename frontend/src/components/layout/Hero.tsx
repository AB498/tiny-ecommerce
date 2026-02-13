import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, Zap, Shield, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
    return (
        <div className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-primary-100/30 blur-[120px] rounded-full translate-x-1/2 translate-y-[-20%]" />
            <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-full bg-indigo-100/40 blur-[120px] rounded-full translate-x-[-30%] translate-y-[20%]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-bold mb-6">
                                <Zap className="w-4 h-4 mr-2" />
                                Special Launch Offer: 20% Off Everything
                            </span>
                            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                                Elevate Your <br />
                                <span className="text-gradient">Shopping Experience</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                                Discover our curated collection of premium products. Built for speed, security, and a seamless checkout experience.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/products" className="px-8 py-4 premium-gradient text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-primary-500/40 transition-all active:scale-95 group">
                                    <ShoppingBag className="w-6 h-6" />
                                    Shop Collection
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/products" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                                    View Featured
                                </Link>
                            </div>

                            {/* Stats/Badges */}
                            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50">
                                        <Truck className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Free Shipping</p>
                                        <p className="text-sm text-slate-500">On orders over $99</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50">
                                        <Shield className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Secure Payment</p>
                                        <p className="text-sm text-slate-500">100% Encrypted</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex-1 relative"
                    >
                        <div className="relative z-10 w-full aspect-square max-w-[500px] mx-auto overflow-hidden rounded-[40px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] group">
                            <img
                                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
                                alt="Hero Product"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-8">
                                <p className="text-white font-bold text-xl">Limited Edition Watch • $299</p>
                            </div>
                        </div>

                        {/* Animated floating cards */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 glass p-4 rounded-3xl shadow-xl z-20 flex items-center gap-4 border-white/40"
                        >
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                                <Zap className="w-5 h-5 fill-current" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Stock Status</p>
                                <p className="text-sm font-bold text-slate-900">In Stock (Limited)</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 glass p-4 rounded-3xl shadow-xl z-20 flex items-center gap-4 border-white/40"
                        >
                            <div className="flex -space-x-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">12k+ Sales</p>
                                <div className="flex text-yellow-400">
                                    {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
