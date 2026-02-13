import { Request, Response } from 'express';
import Product from '../models/ProductModel';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/errorMiddleware';

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const { category, search } = req.query;
    let query: any = {};

    if (category && category !== 'All Products') {
        query.category = category;
    }

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query);

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products },
    });
});

export const getProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

export const createProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { product },
    });
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});
