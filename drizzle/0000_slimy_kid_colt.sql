CREATE TABLE IF NOT EXISTS "post" (
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
	"password" text NOT NULL,
	"is_verified" boolean NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_id_idx" ON "post" USING btree ("topic");