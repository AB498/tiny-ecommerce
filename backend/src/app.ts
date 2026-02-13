import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorMiddleware';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';

const app: Application = express();

// 1. Database Connection Middleware (First priority)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        next(error);
    }
});

// 2. Swagger Documentation (Fail-proof CDN setup for Vercel)
app.get('/api-docs', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Mini E-Commerce API Docs</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.css" />
    <link rel="icon" type="image/png" href="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=32&auto=format&fit=crop" />
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin: 0; background: #fafafa; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js" charset="UTF-8"> </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
    <script>
    window.onload = function() {
        const ui = SwaggerUIBundle({
            spec: ${JSON.stringify(swaggerSpec)},
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
            ],
            plugins: [
                SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
        });
        window.ui = ui;
    };
    </script>
</body>
</html>`;
    res.send(html);
});

// Route to get the swagger spec as JSON (useful for Postman)
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});


// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://i.pravatar.cc"],
            connectSrc: ["'self'", "http://localhost:5000", "https://*.vercel.app"], // Allow connections to API
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"], // Allow Swagger UI scripts
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"], // Allow Swagger UI styles
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
        },
    },
}));
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Data Sanitization against NoSQL query injection
app.use((req, res, next) => {
    req.body = mongoSanitize.sanitize(req.body);
    req.params = mongoSanitize.sanitize(req.params);

    // Fix for Express 5: req.query is read-only, so we mutate it instead of reassigning
    if (req.query) {
        const sanitizedQuery = mongoSanitize.sanitize(req.query);
        // Clear existing query keys
        for (const key in req.query) {
            delete (req.query as any)[key];
        }
        // Assign sanitized values
        Object.assign(req.query, sanitizedQuery);
    }
    next();
});

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route


// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);


// Error Handling
app.use(errorHandler);

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(process.cwd(), 'public')));

    // Handle React routing, return all requests to React app
    app.get('/*splat', (req, res) => {
        // Don't serve React app for API or documentation routes
        if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
            res.status(404).json({
                status: 'fail',
                message: `Can't find ${req.originalUrl} on this server!`
            });
            return;
        }
        res.sendFile(path.join(process.cwd(), 'public/index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'Mini E-Commerce API is running in development mode...',
        });
    });
}

export default app;
