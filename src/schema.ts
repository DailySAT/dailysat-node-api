import { serial, text, timestamp, pgTable, boolean, integer, index } from "drizzle-orm/pg-core";

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

// Post Table
export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  userId: text("user_id").references(() => user.email), // Foreign key to user
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  topicID: integer("topic_id").references(() => postTopic.id), // Foreign key to topic
}, (table) => {
  return {
    userIdIndex: index("user_id_idx").on(table.userId),  // Create index for userId
    topicIDIndex: index("topic_id_idx").on(table.topicID), // Create index for topicID
  };
});

// Post Topics Table
export const postTopic = pgTable("post_topic", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});
