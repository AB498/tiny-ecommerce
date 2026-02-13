import { UserRole } from '../../interfaces/UserInterface';

export const userData = [
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'password123',
        role: UserRole.ADMIN,
    },
    {
        firstName: 'Demo',
        lastName: 'Customer',
        email: 'customer@example.com',
        password: 'password123',
        role: UserRole.CUSTOMER,
    }
];
