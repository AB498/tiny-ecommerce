import jwt from 'jsonwebtoken';

export const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
};
