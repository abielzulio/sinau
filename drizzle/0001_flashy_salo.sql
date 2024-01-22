CREATE TABLE IF NOT EXISTS "chat" (
	"id" varchar PRIMARY KEY NOT NULL,
	"role" varchar,
	"content" text,
	"module_id" varchar,
	"created_at" time DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "subject" DROP CONSTRAINT "subject_modules_module_id_fk";
--> statement-breakpoint
ALTER TABLE "module" ADD COLUMN "subject_id" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "module" ADD CONSTRAINT "module_subject_id_subject_id_fk" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "subject" DROP COLUMN IF EXISTS "modules";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chat" ADD CONSTRAINT "chat_module_id_module_id_fk" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
