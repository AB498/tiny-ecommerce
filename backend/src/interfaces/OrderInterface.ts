import { Document, Types } from 'mongoose';

export enum OrderStatus {
    PENDING = 'pending',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export interface IOrderItem {
    product: Types.ObjectId | string;
    quantity: number;
    price: number; // Price at time of purchase
}

export interface IOrder extends Document {
    user: Types.ObjectId | string;
    items: IOrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: string;
    createdAt: Date;
    updatedAt: Date;
}
