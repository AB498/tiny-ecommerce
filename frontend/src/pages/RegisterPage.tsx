import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/register', formData);
            login(response.data.token, response.data.data.user);
            toast.success('Account created! Welcome to SpeedrunShop.');
            navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[120px]" />
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
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
                    <p className="mt-3 text-slate-500 font-medium">Join us for a premium shopping experience.</p>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-white">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">First Name</label>
                                <div className="relative">
                                    <input
                                        name="firstName"
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Last Name</label>
                                <div className="relative">
                                    <input
                                        name="lastName"
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Email Address</label>
                            <div className="relative">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 transition-all outline-none font-medium"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 premium-gradient text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-primary-500/40 transition-all active:scale-95 disabled:opacity-70 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        Get Started
                                        <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-600 font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-bold hover:underline underline-offset-4 transition-all">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
