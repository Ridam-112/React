import { pgTable, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const homepageSections = pgTable("homepage_sections", {
  id:         text("id").primaryKey(),
  title:      text("title").notNull(),
  type:       text("type").notNull(),
  enabled:    boolean("enabled").notNull().default(true),
  sortOrder:  integer("sort_order").notNull().default(0),
  config:     jsonb("config").notNull().default({}),
  createdAt:  timestamp("created_at").notNull().defaultNow(),
  updatedAt:  timestamp("updated_at").notNull().defaultNow(),
});

export type HomepageSection = typeof homepageSections.$inferSelect;
