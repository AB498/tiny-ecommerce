import { Document } from 'mongoose';

export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
