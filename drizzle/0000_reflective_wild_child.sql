CREATE TABLE IF NOT EXISTS "editorial" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"body" text NOT NULL,
	"reasoning" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"option_a" text NOT NULL,
	"option_b" text NOT NULL,
	"option_c" text NOT NULL,
	"option_d" text NOT NULL,
	"correct_answer" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"topic" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"email" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"googleid" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "editorial" ADD CONSTRAINT "editorial_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_id_idx" ON "questions" USING btree ("topic");