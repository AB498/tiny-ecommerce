import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
    cartCount: number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const { user } = useAuth();

    const refreshCart = async () => {
        if (!user) {
            setCartCount(0);
            return;
        }
        try {
            const response = await api.get('/cart');
            const cart = response.data.data.cart;
            const count = cart ? cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0) : 0;
            setCartCount(count);
        } catch (error) {
            console.error('Failed to fetch cart count', error);
        }
    };

    useEffect(() => {
        refreshCart();
    }, [user]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
