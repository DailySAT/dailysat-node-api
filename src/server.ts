// Main imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './utils/swaggerConfig.js';
import session from 'express-session'
import { cluster } from './libs/redis.js';
import cors from 'cors';


const PORT = 3001;
const app = express();

// Routers that have to be imported to serve the base route
import indexRoutes from './routes/index.route.js'; 
import authRoutes from './routes/auth.route.js'
import RedisStore from 'connect-redis';

// Middleware for the Swagger documentation which is generated with comments (see README for more info)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


// JSON middleware so that we can pass JSON data from frontend
app.use(express.json());

// Dotenv added so env can be accessed
dotenv.configDotenv()

// CORS so API can be accessed
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true
}));
// Session middleware to allow us to use Session-based auth
app.use(session({
    name: "session-id",
    secret: process.env.SESSION_SECRET || '',
    store: new RedisStore({ client: cluster }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 365 * 7,
    },
}))

// Middlewares to set up routing to a base route like / or /auth
app.use('/', indexRoutes);
app.use('/auth', authRoutes)

// Run app
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
