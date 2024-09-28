CREATE TABLE IF NOT EXISTS "post_topic" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "topic_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_topic_id_post_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."post_topic"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "post" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "topic_id_idx" ON "post" USING btree ("topic_id");