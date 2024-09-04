import 'dotenv/config';

import {defineConfig} from 'drizzle-kit'

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "postgres://hemitpatel:hemitpatel@localhost:5432/hemitpatel"
  },
  
});