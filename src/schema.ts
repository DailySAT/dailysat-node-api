import { serial, text, timestamp, pgTable, boolean } from "drizzle-orm/pg-core";

// Defined a schema that includes all the columns within our api

export const user = pgTable("user", {
  id: serial('id').primaryKey(),
  email: text("email"),
  name: text("name").notNull(),
  password: text("password"),
  isVerified: boolean('isVerified').notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});