import { serial, text, timestamp, pgTable, boolean, integer, index } from "drizzle-orm/pg-core";

// User table schema remains the same
export const user = pgTable("user", {
  email: text("email").primaryKey(), // Make email the primary key
  name: text("name").notNull(),
  password: text("password").notNull(),
  isVerified: boolean("is_verified").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});


export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  topicID: text("topic").notNull()
}, (table) => {
  return {
    topicIDIndex: index("topic_id_idx").on(table.topicID), // Create index for topicID (faster db retriveal)
  };
});
