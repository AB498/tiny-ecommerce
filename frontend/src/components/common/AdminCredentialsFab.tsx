import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, type PanInfo } from 'framer-motion';
import { Lock, Copy, Check, X, ShieldCheck, User } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCredentialsFab: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const fabRef = useRef<HTMLButtonElement>(null);
    const controls = useAnimation();
    // Track dragging state to prevent click event on drag release
    const isDragging = useRef(false);

    // Ensure initial visibility and position
    useEffect(() => {
        controls.set({ x: 0, y: 0, opacity: 1, scale: 1 });
    }, [controls]);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success(`${field} copied to clipboard!`, { autoClose: 1500, position: 'bottom-left' });
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleDragStart = () => {
        isDragging.current = true;
    };

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, _info: PanInfo) => {
        // We delay resetting the flag slightly so the onClick handler can check it
        setTimeout(() => {
            isDragging.current = false;
        }, 100);

        if (!fabRef.current) return;

        const rect = fabRef.current.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const padding = 24; // 24px margin

        // Determine which corner is closest
        const isLeft = rect.left + rect.width / 2 < winW / 2;
        const isTop = rect.top + rect.height / 2 < winH / 2;

        // Calculate target screen coordinates
        // The button's CSS is fixed at bottom: 24px, left: 24px (bottom-6 left-6)
        // So its mathematical "origin" (x=0, y=0) is at that position.

        const originLeft = 24;
        const originTop = winH - rect.height - 24;

        let targetLeft = isLeft ? padding : winW - rect.width - padding;
        let targetTop = isTop ? padding : winH - rect.height - padding;

        const deltaX = targetLeft - originLeft;
        const deltaY = targetTop - originTop;

        controls.start({
            x: deltaX,
            y: deltaY,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        });
    };

    const credentialsList = [
        {
            role: 'Admin',
            email: 'admin@example.com',
            password: 'password123',
            icon: ShieldCheck,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            ring: 'ring-indigo-50/50'
        },
        {
            role: 'Customer',
            email: 'customer@example.com',
            password: 'password123',
            icon: User,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            ring: 'ring-emerald-50/50'
        }
    ];

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        ref={fabRef}
                        drag
                        dragMomentum={false}
                        dragElastic={0} // Remove elasticity for cleaner feel
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        animate={controls}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ touchAction: "none" }}
                        className="fixed bottom-6 left-6 z-[9999] flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm text-slate-800 rounded-full shadow-2xl shadow-indigo-500/30 border border-white/50 group cursor-move hover:shadow-indigo-500/40 transition-shadow"
                        onClick={() => {
                            // Only open if NOT dragging
                            if (!isDragging.current) {
                                setIsOpen(true);
                            }
                        }}
                    >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 pointer-events-none">
                            <Lock className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-sm pr-1 pointer-events-none text-slate-700">Demo Access</span>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999]"
                            onClick={() => setIsOpen(false)}
                        />
                        {/* Centered Modal Container */}
                        <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="w-full max-w-sm bg-white rounded-[32px] shadow-2xl shadow-slate-900/40 border border-slate-100 overflow-hidden pointer-events-auto mx-4"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 ring-4 ring-indigo-50/50">
                                                <Lock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 leading-tight">Demo Access</h3>
                                                <p className="text-sm text-slate-500 font-medium mt-1">Select a role to login</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {credentialsList.map((cred, idx) => (
                                            <div key={idx} className="group relative bg-slate-50/80 hover:bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 rounded-2xl p-4 transition-all duration-300">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`w-6 h-6 rounded-lg ${cred.bg} ${cred.color} flex items-center justify-center`}>
                                                        <cred.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-bold text-slate-700">{cred.role}</span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center bg-white/50 rounded-lg px-2 py-1.5 border border-slate-100">
                                                        <code className="text-slate-600 font-mono text-xs">{cred.email}</code>
                                                        <button
                                                            onClick={() => copyToClipboard(cred.email, `${cred.role} Email`)}
                                                            className={`p-1.5 rounded-md transition-all duration-300 ${copiedField === `${cred.role} Email`
                                                                ? 'bg-green-100 text-green-600'
                                                                : 'bg-transparent text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                                                                }`}
                                                        >
                                                            {copiedField === `${cred.role} Email` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>

                                                    <div className="flex justify-between items-center bg-white/50 rounded-lg px-2 py-1.5 border border-slate-100">
                                                        <code className="text-slate-600 font-mono text-xs">{cred.password}</code>
                                                        <button
                                                            onClick={() => copyToClipboard(cred.password, `${cred.role} Password`)}
                                                            className={`p-1.5 rounded-md transition-all duration-300 ${copiedField === `${cred.role} Password`
                                                                ? 'bg-green-100 text-green-600'
                                                                : 'bg-transparent text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                                                                }`}
                                                        >
                                                            {copiedField === `${cred.role} Password` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-100 rounded-lg">Quick Copy</span>
                                    <button
                                        onClick={() => window.location.href = '/login'}
                                        className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
                                    >
                                        Go to Login <span aria-hidden="true">&rarr;</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminCredentialsFab;
