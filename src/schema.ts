import { serial, text, timestamp, pgTable, boolean } from "drizzle-orm/pg-core";

// User table schema remains the same
export const user = pgTable("user", {
  email: text("email").notNull().primaryKey(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  isVerified: boolean("is_verified").notNull(),
  admin: boolean("admin").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),                
  body: text("body").notNull(),                  
  userId: text("user_id").references(() => user.email), 
  optionA: text("option_a").notNull(),            
  optionB: text("option_b").notNull(),          
  optionC: text("option_c").notNull(),            
  optionD: text("option_d").notNull(),           
  correctAnswer: text("correct_answer").notNull(), 
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
