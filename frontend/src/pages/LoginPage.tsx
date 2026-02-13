import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token, response.data.data.user);
            toast.success('Welcome back to SpeedrunShop!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20 group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-2xl">S</span>
                        </div>
                        <span className="text-3xl font-black text-gradient">SpeedrunShop</span>
                    </Link>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="mt-3 text-slate-500 font-medium">Please enter your details to sign in.</p>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 px-1">
                                <label className="block text-sm font-bold text-slate-700">Password</label>
                                <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 premium-gradient text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-primary-500/40 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 group"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 font-medium italic mb-4 text-xs">Test Credentials: admin@example.com / password123</p>
                        <p className="text-slate-600 font-medium">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-bold hover:underline underline-offset-4">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="mt-12 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 text-primary-500" /> Secure Encryption
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Sparkles className="w-4 h-4 text-primary-500" /> Instant Access
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
