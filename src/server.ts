import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './utils/swaggerConfig.js';
import session from 'express-session';
import { redisClient } from './libs/redis.js';
import cors from 'cors';
import RedisStore from 'connect-redis';

// Server configuration
const PORT = 3001;
const app = express();

// Routers
import indexRoutes from './routes/index.route.js'; 
import authRoutes from './routes/auth.route.js';
import questionRoutes from './routes/question.route.js'

// JSON middleware
app.use(express.json());

// CORS middleware
app.use(cors({

    // credentials must be true so cookies can be sent to the frontend endpoint (for session based auth) 
    credentials: true
}));

// Session middleware (config)
app.use(session({
    name: 'session-id',
    secret: process.env.SESSION_SECRET || 'default_secret', // Make sure to set this in your environment
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // So only a server is able to access the cookie within request headers (no JS scripts)
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        maxAge: 1000 * 60 * 60 * 24 * 365 * 7,
    }
}));


// Setup routing
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/questions', questionRoutes);

// Route for api docs from Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
