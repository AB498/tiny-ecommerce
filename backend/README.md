# Mini E-Commerce API - Backend (TypeScript)

This is a production-grade backend for the Mini E-Commerce platform, built with Node.js, Express, MongoDB, and TypeScript.

## Features

- **MVC Architecture**: Clear separation of concerns.
- **Role-Based Access Control (RBAC)**: Admin and Customer roles.
- **Authentication**: JWT-based login and registration.
- **Validation**: Request validation using Zod schemas.
- **Error Handling**: Centralized global error handling middleware.
- **Security**: Security headers with Helmet, CORS enabled.
- **Database**: Mongoose for data modeling.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **Validation**: Zod
- **Auth**: JWT & BcryptJS

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mini-ecommerce
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

### Running the App

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Production**: `npm start`

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (Private)

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product (Admin only)
- `PATCH /api/v1/products/:id` - Update product (Admin only)
- `DELETE /api/v1/products/:id` - Delete product (Admin only)
