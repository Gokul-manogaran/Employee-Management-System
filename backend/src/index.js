const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config({ path: './config.env' });

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { authenticateToken, authorizeRole } = require('./middleware/auth');
const { initializeDatabase } = require('./database/schema');

const app = express();
const PORT = process.env.PORT || 4000;

// Performance optimizations and security middleware
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));

// Rate limiting for API protection
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/graphql', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom authentication context for GraphQL
const context = async ({ req }) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const jwt = require('jsonwebtoken');
            const user = jwt.verify(token, process.env.JWT_SECRET);
            return { user };
        } catch (error) {
            // Token is invalid, but we don't throw here
            // Let individual resolvers handle authentication
        }
    }
    return { user: null };
};

// Create Apollo Server with performance optimizations
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
    formatError: (error) => {
        // Log errors for debugging
        console.error('GraphQL Error:', error);

        // Return sanitized error messages
        return {
            message: error.message,
            path: error.path,
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        };
    },
    plugins: [
        {
            requestDidStart: async (requestContext) => {
                const start = Date.now();

                return {
                    willSendResponse: async (requestContext) => {
                        const duration = Date.now() - start;
                        console.log(`GraphQL ${requestContext.operation?.operation || 'query'} completed in ${duration}ms`);
                    },
                };
            },
        },
    ],
});



// Apply middleware to Apollo Server
async function startServer() {
    await server.start();

    // Apply Apollo Server middleware to Express
    server.applyMiddleware({
        app,
        path: '/graphql',
        cors: false // We handle CORS with express-cors
    });
}

// REST endpoints for authentication (alternative to GraphQL mutations)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const { login } = require('./middleware/auth');
        const result = await login(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Express Error:', err);
    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function initializeApp() {
    try {
        console.log('Initializing database...');
        await initializeDatabase();
        console.log('Database initialized successfully');

        console.log('Starting Apollo Server...');
        await startServer();
        console.log('Apollo Server started successfully');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
            console.log(`🔐 Health check: http://localhost:${PORT}/health`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

            if (process.env.NODE_ENV !== 'production') {
                console.log('\n📝 Default admin credentials:');
                console.log('Username: admin');
                console.log('Password: admin123');
                console.log('\n🔗 GraphQL Playground: http://localhost:${PORT}/graphql');
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the application
initializeApp(); 