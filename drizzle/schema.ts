import {
  pgTable,
  varchar,
  pgEnum,
  time,
  uuid,
  numeric,
  boolean,
  date,
  integer,
  text,
} from "drizzle-orm/pg-core";

export const Subject = pgTable("subject", {
  id: varchar("id").primaryKey(),
  name: varchar("name"),
  cover: varchar("cover"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: time("created_at").defaultNow(),
  updatedAt: time("updated_at"),
  modules: varchar("modules").references(() => Module.id),
  lastActiveModuleId: varchar("last_active_module_id"),
  lastSelectedModuleId: varchar("last_selected_module_id"),
  userId: varchar("user_id"),
});

export const Video = pgTable("video", {
  id: varchar("id").primaryKey(),
  title: varchar("title"),
  cover: varchar("cover"),
  url: varchar("url"),
  transcript: text("transcript"),
  createdAt: time("created_at").defaultNow(),
  updatedAt: time("updated_at"),
});

export const Module = pgTable("module", {
  id: varchar("id").primaryKey(),
  order: integer("order"),
  runId: varchar("run_id"),
  notes: text("notes"),
  title: varchar("title"),
  overview: text("overview"),
  reading: text("reading"),
  references: text("references"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: time("created_at").defaultNow(),
  updatedAt: time("updated_at"),
  videoId: varchar("video_id").references(() => Video.id),
});
