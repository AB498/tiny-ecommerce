import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, LayoutDashboard, ChevronDown, Package, UserCircle, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNotImplemented = (feature: string) => {
        toast.info(`${feature} is not implemented yet!`, {
            position: "bottom-right",
            autoClose: 3000,
        });
        setIsDropdownOpen(false);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/images/logo.svg" alt="Logo" className="h-10 w-10 group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold text-gradient tracking-tight">SpeedrunShop</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/products" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Products</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-lg transition-all">
                                <LayoutDashboard className="w-4 h-4" />
                                Admin Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => handleNotImplemented('Wishlist')}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative"
                        >
                            <Heart className="w-6 h-6" />
                        </button>
                        <Link to="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors group">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-slate-200" ref={dropdownRef}>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200">
                                            <User className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div className="text-left hidden lg:block">
                                            <p className="text-xs font-bold text-slate-400 leading-tight">Welcome,</p>
                                            <p className="text-sm font-black text-slate-900 leading-tight">{user.firstName}</p>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden"
                                            >
                                                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                                                    <p className="text-sm font-black text-slate-900 truncate">{user.email}</p>
                                                </div>

                                                <Link to="/orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all group">
                                                    <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    <span className="font-bold">My Orders</span>
                                                </Link>

                                                <button
                                                    onClick={() => handleNotImplemented('Profile Settings')}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all group"
                                                >
                                                    <UserCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                    <span className="font-bold">Account Profile</span>
                                                </button>

                                                <div className="mt-1 pt-1 border-t border-slate-50">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                                                    >
                                                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                        <span className="font-bold">Sign Out</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="px-6 py-2 premium-gradient text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary-500/40 transition-all active:scale-95">
                                Sign In
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        <Link to="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link to="/products" className="block px-3 py-4 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Products</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="block px-3 py-4 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                        )}
                        {user ? (
                            <>
                                <Link to="/orders" className="block px-3 py-4 text-slate-700 font-medium hover:bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>My Orders</Link>
                                <button
                                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                    className="w-full text-left px-3 py-4 text-red-500 font-medium hover:bg-red-50 rounded-xl"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="block px-3 py-4 text-primary-600 font-bold hover:bg-slate-50 rounded-xl" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
