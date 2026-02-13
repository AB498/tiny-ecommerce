import { version } from '../../package.json';

const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Mini E-Commerce API Documentation',
        version: version || '1.0.0',
        description: 'API documentation for the Mini E-Commerce platform including Auth, Products, Cart, and Orders.',
        contact: {
            name: 'API Support',
        },
    },
    servers: [
        {
            url: '/api/v1',
            description: 'V1 API Server (Relative)',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    role: { type: 'string', enum: ['admin', 'customer'] },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            RegisterRequest: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'password'],
                properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    role: { type: 'string', enum: ['admin', 'customer'] },
                },
            },
            AuthRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                },
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string' },
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' },
                },
            },
            Product: {
                type: 'object',
                required: ['name', 'description', 'price', 'category'],
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    stock: { type: 'number' },
                    category: { type: 'string' },
                    images: { type: 'array', items: { type: 'string' } },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            CartItem: {
                type: 'object',
                properties: {
                    product: { $ref: '#/components/schemas/Product' },
                    quantity: { type: 'number' },
                },
            },
            Cart: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    user: { type: 'string' },
                    items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            OrderItem: {
                type: 'object',
                properties: {
                    product: { $ref: '#/components/schemas/Product' },
                    quantity: { type: 'number' },
                    price: { type: 'number' },
                },
            },
            Order: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    user: { type: 'string' },
                    items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
                    totalAmount: { type: 'number' },
                    status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
                    shippingAddress: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    paths: {
        '/auth/register': {
            post: {
                summary: 'Register a new user',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
                },
                responses: {
                    201: { description: 'User registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
                },
            },
        },
        '/auth/login': {
            post: {
                summary: 'Login a user',
                tags: ['Auth'],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthRequest' } } },
                },
                responses: {
                    200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
                },
            },
        },
        '/auth/me': {
            get: {
                summary: 'Get current user profile',
                tags: ['Auth'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                },
            },
        },
        '/products': {
            get: {
                summary: 'Get all products',
                tags: ['Products'],
                responses: {
                    200: { description: 'List of products', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } },
                },
            },
            post: {
                summary: 'Create product (Admin)',
                tags: ['Products'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } },
                },
                responses: { 201: { description: 'Product created' } },
            },
        },
        '/products/{id}': {
            get: {
                summary: 'Get product by ID',
                tags: ['Products'],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Product details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
                },
            },
            patch: {
                summary: 'Update product (Admin)',
                tags: ['Products'],
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
                responses: { 200: { description: 'Product updated' } },
            },
            delete: {
                summary: 'Delete product (Admin)',
                tags: ['Products'],
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: { 204: { description: 'Product deleted' } },
            },
        },
        '/cart': {
            get: {
                summary: 'Get user cart',
                tags: ['Cart'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'User cart', content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } } },
                },
            },
        },
        '/cart/add': {
            post: {
                summary: 'Add to cart',
                tags: ['Cart'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['productId', 'quantity'], properties: { productId: { type: 'string' }, quantity: { type: 'number' } } } } },
                },
                responses: {
                    200: { description: 'Added', content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } } },
                },
            },
        },
        '/cart/{productId}': {
            delete: {
                summary: 'Remove from cart',
                tags: ['Cart'],
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'productId', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Removed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } } },
                },
            },
        },
        '/orders': {
            post: {
                summary: 'Create order',
                tags: ['Orders'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', required: ['shippingAddress'], properties: { shippingAddress: { type: 'string' } } } } },
                },
                responses: {
                    201: { description: 'Order created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
                },
            },
        },
        '/orders/my-orders': {
            get: {
                summary: 'My orders',
                tags: ['Orders'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Orders list', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
                },
            },
        },
        '/orders/all': {
            get: {
                summary: 'All orders (Admin)',
                tags: ['Orders'],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'All orders', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
                },
            },
        },
        '/orders/{id}/status': {
            patch: {
                summary: 'Update order status (Admin)',
                tags: ['Orders'],
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] } } } } },
                },
                responses: { 200: { description: 'Status updated' } },
            },
        },
        '/orders/{id}': {
            get: {
                summary: 'Order details',
                tags: ['Orders'],
                security: [{ bearerAuth: [] }],
                parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Order details', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
                },
            },
        },
    },
};

export default swaggerSpec;
