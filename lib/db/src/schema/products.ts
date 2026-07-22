import { pgTable, text, real, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id:               text("id").primaryKey(),
  name:             text("name").notNull(),
  description:      text("description"),
  price:            real("price").notNull(),
  discountedPrice:  real("discounted_price"),
  category:         text("category").notNull(),
  subcategory:      text("subcategory"),
  shopId:           text("shop_id").notNull(),
  images:           jsonb("images").notNull().default([]),
  stock:            integer("stock").notNull().default(0),
  sku:              text("sku"),
  unit:             text("unit").notNull().default("Piece"),
  rating:           real("rating").notNull().default(0),
  commissionRate:   real("commission_rate"),
  status:           text("status").notNull().default("active"),
  rejectionReason:  text("rejection_reason"),
  trending:         boolean("trending").notNull().default(false),
  createdAt:        timestamp("created_at").notNull().defaultNow(),
  updatedAt:        timestamp("updated_at").notNull().defaultNow(),
  colors:           jsonb("colors"),
  sizes:            jsonb("sizes"),
  colorImages:      jsonb("color_images"),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
