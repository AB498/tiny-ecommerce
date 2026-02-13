import { Document, Types } from 'mongoose';

export interface ICartItem {
    product: Types.ObjectId | string;
    quantity: number;
}

export interface ICart extends Document {
    user: Types.ObjectId | string;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}
