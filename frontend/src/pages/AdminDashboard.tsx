import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    TrendingUp,
    ShoppingBag,
    Users,
    Plus,
    Edit2,
    Trash2,
    X,
    Loader2,
    Search,
    ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state for Product
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'Electronics',
        images: ['']
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'products') {
                const res = await api.get('/products');
                setProducts(res.data.data.products);
            } else {
                const res = await api.get('/orders/all');
                setOrders(res.data.data.orders);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                ...productForm,
                price: Number(productForm.price),
                stock: Number(productForm.stock)
            };

            if (editingProduct) {
                await api.patch(`/products/${editingProduct._id}`, data);
                toast.success('Product updated!');
            } else {
                await api.post('/products', data);
                toast.success('Product created!');
            }
            setIsProductModalOpen(false);
            setEditingProduct(null);
            setProductForm({ name: '', description: '', price: '', stock: '', category: 'Electronics', images: [''] });
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const deleteProduct = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted');
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status });
            toast.success(`Order status updated to ${status}`);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-slate-50 pt-24">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Admin Dashboard</h1>
                        <p className="text-slate-500 font-medium">Manage your products, orders, and business growth.</p>
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Products', value: products.length, icon: Package, color: 'blue' },
                        { label: 'Active Orders', value: orders.filter(o => o.status === 'pending').length, icon: ShoppingBag, color: 'indigo' },
                        { label: 'Revenue', value: `$${orders.reduce((acc, o) => acc + o.totalAmount, 0).toLocaleString()}`, icon: TrendingUp, color: 'green' },
                        { label: 'Customers', value: 12, icon: Users, color: 'orange' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center`}>
                                <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl w-fit mb-8">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Orders
                    </button>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    </div>
                    {activeTab === 'products' && (
                        <button
                            onClick={() => {
                                setEditingProduct(null);
                                setProductForm({ name: '', description: '', price: '', stock: '', category: 'Electronics', images: [''] });
                                setIsProductModalOpen(true);
                            }}
                            className="w-full md:w-auto px-6 py-3 premium-gradient text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                        >
                            <Plus className="w-5 h-5" /> Add Product
                        </button>
                    )}
                </div>

                {/* Main Table Area */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="w-12 h-12 animate-spin mb-4" />
                            <p className="font-bold">Loading dashboard data...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        {activeTab === 'products' ? (
                                            <>
                                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase">Product</th>
                                                <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase">Category</th>
                                                <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase">Price</th>
                                                <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase">Stock</th>
                                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase text-right">Actions</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase">Order ID</th>
                                                <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase">Customer</th>
                                                <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase">Amount</th>
                                                <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase">Status</th>
                                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase text-right">Update Status</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeTab === 'products' ? (
                                        filteredProducts.map(p => (
                                            <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                                            <img src={p.images?.[0]} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                        <p className="font-bold text-slate-900 truncate max-w-[200px]">{p.name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-medium text-slate-600">{p.category}</td>
                                                <td className="px-6 py-6 font-black text-slate-900">${p.price}</td>
                                                <td className="px-6 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                        {p.stock} in stock
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingProduct(p);
                                                                setProductForm({
                                                                    name: p.name,
                                                                    description: p.description,
                                                                    price: p.price.toString(),
                                                                    stock: p.stock.toString(),
                                                                    category: p.category,
                                                                    images: p.images || ['']
                                                                });
                                                                setIsProductModalOpen(true);
                                                            }}
                                                            className="p-2 hover:bg-white hover:text-primary-600 rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400"
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProduct(p._id)}
                                                            className="p-2 hover:bg-white hover:text-red-600 rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        orders.map(o => (
                                            <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6 font-mono text-sm font-bold text-slate-500">
                                                    <Link to={`/orders/${o._id}`} className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-bold group">
                                                        #{o._id.slice(-8).toUpperCase()}
                                                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <p className="font-bold text-slate-900">{o.user?.firstName} {o.user?.lastName}</p>
                                                    <p className="text-xs text-slate-400">{o.user?.email}</p>
                                                </td>
                                                <td className="px-6 py-6 font-black text-slate-900">${o.totalAmount}</td>
                                                <td className="px-6 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${o.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        o.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                            o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <select
                                                        onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                                                        value={o.status}
                                                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {isProductModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsProductModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-black text-slate-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleProductSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={productForm.name}
                                            onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={productForm.price}
                                            onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Stock Quantity</label>
                                        <input
                                            required
                                            type="number"
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={productForm.stock}
                                            onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                                        <select
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={productForm.category}
                                            onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                        >
                                            <option value="Electronics">Electronics</option>
                                            <option value="Fashion">Fashion</option>
                                            <option value="Home & Living">Home & Living</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                        <textarea
                                            required
                                            rows={3}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                                            value={productForm.description}
                                            onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Image URL</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                                            value={productForm.images[0]}
                                            onChange={e => setProductForm({ ...productForm, images: [e.target.value] })}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-5 premium-gradient text-white rounded-[24px] font-black text-lg shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">
                                    {editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
