import dotenv from 'dotenv';
dotenv.config();

import { User } from './types/User.js';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './utils/swaggerConfig.js';
import session from 'express-session';
import { cluster } from './libs/redis.js';
import cors from 'cors';
import RedisStore from 'connect-redis';
import crypto from 'crypto';
import passport from 'passport'

import {Strategy as GoogleStrategy} from 'passport-google-oauth2'
import { db } from './utils/db.js';
import { user } from './schema.js';
import { eq } from 'drizzle-orm';

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
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Session middleware (config)
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

// this allows passport to do its magic 
app.use(passport.initialize())

// this method is used to ensure that passport knows we are using sessions
app.use(passport.session());

// making sure that we are using the correct http method when building our callback url
const apiUrl = process.env.API_URL || "";
const protocol = apiUrl.startsWith('https://') ? 'https' : 'http';

const callbackURL = `${protocol}://${apiUrl}/auth/callback`;

// this ensures that we can use the google sso login as it is now configured for use
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: callbackURL,
    passReqToCallback: true
  },
  async (
    // even though we are not using these
    // we need to declare them because these are the arugments for those values
    accessToken: string,
    refreshToken: string,
    profile: {
      id: string;
      displayName: string;
      emails: { value: string }[];
    },
    done: (error: any, user?: User | null) => void
  ) => {
    try {
      const existingUser = await db
        .select()
        .from(user)
        .where(eq(user.googleId, profile.id))
        .limit(1)
        .execute();

      if (existingUser.length > 0) {
        return done(null, existingUser[0]);
      } else {
        const newUserData: User = {
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        };

        // building a new db entry into our sql db 
        await db
            .insert(user)
            .values(newUserData)
            .execute()

        // returning the existing user gotten from the google function
        return done(null, existingUser[0]);
      }
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
    return done(null, user)
})

passport.deserializeUser((user, done) => {
    return done(null, user as User);
})
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
