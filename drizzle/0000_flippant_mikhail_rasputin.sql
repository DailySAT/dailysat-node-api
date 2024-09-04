CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"name" text NOT NULL,
	"password" text,
	"isVerified" boolean NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
