import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/UserModel';
import { AppError } from './errorMiddleware';
import { catchAsync } from '../utils/catchAsync';

export const protect = catchAsync(async (req: any, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new AppError('You are not logged in. Please log in to get access.', 401);
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
});

export const restrictTo = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            throw new AppError('You do not have permission to perform this action', 403);
        }
        next();
    };
};
