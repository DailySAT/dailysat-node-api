import { serial, text, timestamp, pgTable, integer, index } from "drizzle-orm/pg-core";

// user table schema remains the same
export const user = pgTable("user", {
  email: text("email").primaryKey(), // make email the primary key
  name: text("name").notNull(),
  googleid: text("googleid").notNull(),
});


export const questions = pgTable("questions", {
  id: serial("id").primaryKey(), // id field here is the primary key (sql reference to this field when creating one-to-one or one-to-many relationships)
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
    topicIDIndex: index("topic_id_idx").on(table.topicID), // Create index for topicID (faster db retriveal O(nlogn))
  };
});


export const editorial = pgTable("editorial", {
  id: serial("id").primaryKey(),
  // Foriegn key that connects the question to the editorial
  questionId: integer("question_id").notNull().references(() => questions.id),
  body: text("body").notNull(),

  // Is optional so not .notNull()
  reasoning: text("reasoning")
});