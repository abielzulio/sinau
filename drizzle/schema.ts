import { type InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  time,
  varchar,
} from "drizzle-orm/pg-core";

export const subject = pgTable("subject", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  cover: varchar("cover").notNull(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: time("created_at").defaultNow(),
  updatedAt: time("updated_at"),
  lastActiveModuleId: varchar("last_active_module_id").notNull(),
  lastSelectedModuleId: varchar("last_selected_module_id").notNull(),
  userId: varchar("user_id").notNull(),
});

export const subjectRelations = relations(subject, ({ many }) => ({
  modules: many(subjectModule),
}));

export const subjectModule = pgTable("module", {
  id: varchar("id").primaryKey(),
  order: integer("order").notNull(),
  runId: varchar("run_id"),
  notes: text("notes"),
  title: varchar("title").notNull(),
  overview: text("overview"),
  reading: text("reading"),
  references: text("references"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: time("created_at").defaultNow(),
  updatedAt: time("updated_at"),
  videoId: varchar("video_id").references(() => video.id),
  subjectId: varchar("subject_id").references(() => subject.id),
});

export const subjectModuleRelations = relations(
  subjectModule,
  ({ one, many }) => ({
    subject: one(subject, {
      fields: [subjectModule.subjectId],
      references: [subject.id],
    }),
    video: one(video, {
      fields: [subjectModule.videoId],
      references: [video.id],
    }),
    chats: many(chat),
  }),
);

export interface ModuleWithVideoAndChats
  extends InferSelectModel<typeof subjectModule> {
  video: InferSelectModel<typeof video>;
  chats: InferSelectModel<typeof chat>;
}

export interface SubjectWithModulesWithVideoAndChats
  extends InferSelectModel<typeof subject> {
  modules: ModuleWithVideoAndChats[];
}

export const video = pgTable("video", {
  id: varchar("id").primaryKey(),
  title: varchar("title").notNull(),
  cover: varchar("cover").notNull(),
  url: varchar("url").notNull(),
  transcript: text("transcript"),
  createdAt: time("created_at").defaultNow(),
  updatedAt: time("updated_at"),
});

export const chat = pgTable("chat", {
  id: varchar("id").primaryKey(),
  role: varchar("role").notNull(),
  content: text("content").notNull(),
  moduleId: varchar("module_id").references(() => subjectModule.id),
  createdAt: time("created_at").defaultNow(),
});

export const chatRelations = relations(chat, ({ one }) => ({
  module: one(subjectModule, {
    fields: [chat.moduleId],
    references: [subjectModule.id],
  }),
}));
