import { Request, Response } from 'express';
import User from '../models/UserModel';
import { generateToken } from '../utils/jwt';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../middleware/errorMiddleware';
import { registerSchema, loginSchema } from '../validators/authValidator';

export const register = catchAsync(async (req: Request, res: Response) => {
    // Validate input
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
        throw new AppError(validation.error.issues[0].message, 400);
    }

    const { firstName, lastName, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new AppError('User already exists with this email', 400);
    }

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
    });

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
        status: 'success',
        token: generateToken(user._id.toString()),
        data: { user },
    });
});

export const login = catchAsync(async (req: Request, res: Response) => {
    // Validate input
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        throw new AppError(validation.error.issues[0].message, 400);
    }

    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid email or password', 401);
    }

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
        status: 'success',
        token: generateToken(user._id.toString()),
        data: { user },
    });
});

export const getMe = catchAsync(async (req: any, res: Response) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        status: 'success',
        data: { user },
    });
});
