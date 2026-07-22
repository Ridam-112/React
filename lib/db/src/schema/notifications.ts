import { pgTable, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const notifications = pgTable("notifications", {
  id:         text("id").primaryKey(),
  userId:     text("user_id").notNull(),
  title:      text("title").notNull(),
  body:       text("body").notNull(),
  type:       text("type").notNull().default("general"),
  isRead:     boolean("is_read").notNull().default(false),
  data:       jsonb("data"),
  createdAt:  timestamp("created_at").notNull().defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
