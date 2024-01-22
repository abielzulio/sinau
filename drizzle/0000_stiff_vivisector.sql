CREATE TABLE IF NOT EXISTS "module" (
	"id" varchar PRIMARY KEY NOT NULL,
	"order" integer,
	"run_id" varchar,
	"notes" text,
	"title" varchar,
	"overview" text,
	"reading" text,
	"references" text,
	"is_completed" boolean DEFAULT false,
	"created_at" time DEFAULT now(),
	"updated_at" time,
	"video_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subject" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"cover" varchar,
	"is_completed" boolean DEFAULT false,
	"created_at" time DEFAULT now(),
	"updated_at" time,
	"modules" varchar,
	"last_active_module_id" varchar,
	"last_selected_module_id" varchar,
	"user_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "video" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" varchar,
	"cover" varchar,
	"url" varchar,
	"transcript" text,
	"created_at" time DEFAULT now(),
	"updated_at" time
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "module" ADD CONSTRAINT "module_video_id_video_id_fk" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subject" ADD CONSTRAINT "subject_modules_module_id_fk" FOREIGN KEY ("modules") REFERENCES "module"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
