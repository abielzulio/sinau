ALTER TABLE "chat" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chat" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "module" ALTER COLUMN "order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "module" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subject" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subject" ALTER COLUMN "cover" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subject" ALTER COLUMN "last_active_module_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "subject" ALTER COLUMN "last_selected_module_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ALTER COLUMN "cover" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ALTER COLUMN "url" SET NOT NULL;