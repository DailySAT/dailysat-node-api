import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Since pg may still support module.exports syntax
const { Pool } = pkg;

import * as schema from '../schema.js';

// Using pg's connection pooling so the API does not have to keep creating new connections to the db instance (adds to performance)

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

// { schema } is used for relational queries
export const db = drizzle(pool, { schema });
