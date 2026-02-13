import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/OrderModel';
import Cart from '../models/CartModel';
import Product from '../models/ProductModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/errorMiddleware';

export const createOrder = catchAsync(async (req: any, res: Response) => {
    const { shippingAddress } = req.body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Get user's cart
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product').session(session);
        if (!cart || cart.items.length === 0) {
            throw new AppError('Your cart is empty', 400);
        }

        let totalAmount = 0;
        const orderItems = [];

        // 2. Validate stock and calculate total
        for (const item of cart.items) {
            const product = item.product as any;

            if (product.stock < item.quantity) {
                throw new AppError(`Not enough stock for ${product.name}`, 400);
            }

            // Deduct stock
            await Product.findByIdAndUpdate(
                product._id,
                { $inc: { stock: -item.quantity } },
                { session, new: true }
            );

            totalAmount += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });
        }

        // 3. Create order
        const order = await Order.create(
            [
                {
                    user: req.user.id,
                    items: orderItems,
                    totalAmount,
                    shippingAddress,
                },
            ],
            { session }
        );

        // 4. Clear cart
        await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] }, { session });

        await session.commitTransaction();

        res.status(201).json({
            status: 'success',
            data: { order: order[0] },
        });
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const getMyOrders = catchAsync(async (req: any, res: Response) => {
    const orders = await Order.find({ user: req.user.id })
        .populate('items.product')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: { orders },
    });
});

export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const orders = await Order.find()
        .populate('user', 'firstName lastName email')
        .populate('items.product')
        .sort('-createdAt');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: { orders },
    });
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: { order },
    });
});

export const cancelOrder = catchAsync(async (req: any, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Only allow cancellation if order is pending
    if (order.status !== 'pending') {
        throw new AppError('Only pending orders can be cancelled', 400);
    }

    // Only allow user to cancel their own order (unless admin)
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new AppError('You do not have permission to cancel this order', 403);
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // 1. Return stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: item.quantity } },
                { session }
            );
        }

        // 2. Set status to cancelled
        order.status = 'cancelled' as any;
        await order.save({ session });

        await session.commitTransaction();

        res.status(200).json({
            status: 'success',
            data: { order },
        });
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
});

export const getOrderDetails = catchAsync(async (req: any, res: Response) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'firstName lastName email')
        .populate('items.product');

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Authorization: User can see their own order, Admin can see all
    const orderUserId = (order.user as any)._id || order.user;
    if (orderUserId.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new AppError('You do not have permission to view this order', 403);
    }

    res.status(200).json({
        status: 'success',
        data: { order },
    });
});
