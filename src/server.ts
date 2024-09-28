import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './utils/swaggerConfig.js';
import session from 'express-session';
import { cluster } from './libs/redis.js';
import cors from 'cors';
import RedisStore from 'connect-redis';
import crypto from 'crypto';

// Server configuration
const PORT = 3001;
const app = express();

// Routers
import indexRoutes from './routes/index.route.js'; 
import authRoutes from './routes/auth.route.js';
import questionRoute from './routes/questions.route.js';
import topicsRoute from './routes/topic.route.js'

// JSON middleware
app.use(express.json());

// CORS middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Session middleware
app.use(session({
    name: 'session-id',
    secret: process.env.SESSION_SECRET || 'default_secret', // Make sure to set this in your environment
    store: new RedisStore({ client: cluster }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // So only a server is able to access the cookie within request headers (no JS scripts)
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        maxAge: 1000 * 60 * 60 * 24 * 365 * 7,
    },
    genid: (req) => {
        const email = req.body.email || 'default_email'; // Use a default value if email is not provided
        const hmac = crypto.createHmac('sha256', process.env.SECRET_KEY || 'default');
        hmac.update(email);
        return hmac.digest('hex');
    }
}));

// Setup routing
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/questions', questionRoute);
app.use('/topics', topicsRoute)

// Route for api docs from Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
