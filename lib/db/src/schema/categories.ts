import { pgTable, text, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id:               text("id").primaryKey(),
  name:             text("name").notNull(),
  slug:             text("slug").notNull(),
  shopTypes:        jsonb("shop_types").notNull().default([]),
  isActive:         boolean("is_active").notNull().default(true),
  commissionRate:   real("commission_rate"),
  emoji:            text("emoji"),
  color:            text("color"),
  createdAt:        timestamp("created_at").notNull().defaultNow(),
  updatedAt:        timestamp("updated_at").notNull().defaultNow(),
  subcategories:    jsonb("subcategories").notNull().default([]),
});

export type Category = typeof categories.$inferSelect;
