import { Request, Response } from 'express';
import Cart from '../models/CartModel';
import Product from '../models/ProductModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/errorMiddleware';

export const getCart = catchAsync(async (req: any, res: Response) => {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
        status: 'success',
        data: { cart },
    });
});

export const addToCart = catchAsync(async (req: any, res: Response) => {
    const { productId, quantity } = req.body;

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
        throw new AppError('Insufficient stock available', 400);
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        cart = await Cart.create({
            user: req.user.id,
            items: [{ product: productId, quantity }],
        });
    } else {
        // Check if product already in cart
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Check combined quantity against stock
            const newTotalQuantity = cart.items[itemIndex].quantity + quantity;
            if (product.stock < newTotalQuantity) {
                throw new AppError(`Cannot add more. Only ${product.stock} units available in total.`, 400);
            }
            cart.items[itemIndex].quantity = newTotalQuantity;
        } else {
            // For new items, initial quantity check is enough (handled above), but double checking doesn't hurt
            if (product.stock < quantity) {
                throw new AppError('Insufficient stock available', 400);
            }
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    }

    res.status(200).json({
        status: 'success',
        data: { cart },
    });
});

export const removeFromCart = catchAsync(async (req: any, res: Response) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({
        status: 'success',
        data: { cart },
    });
});
