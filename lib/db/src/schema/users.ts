import { pgTable, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id:                       text("id").primaryKey(),
  name:                     text("name").notNull().default("User"),
  phone:                    text("phone"),
  email:                    text("email"),
  googleId:                 text("google_id"),
  role:                     text("role").notNull().default("customer"),
  status:                   text("status").notNull().default("active"),
  vendorStatus:             text("vendor_status").notNull().default("none"),
  pincode:                  text("pincode"),
  addresses:                jsonb("addresses").notNull().default([]),
  lastLoginAt:              timestamp("last_login_at"),
  createdAt:                timestamp("created_at").notNull().defaultNow(),
  updatedAt:                timestamp("updated_at").notNull().defaultNow(),
  tokenVersion:             integer("token_version").notNull().default(1),
  passwordHash:             text("password_hash"),
  authProvider:             text("auth_provider").notNull().default("email"),
  profilePhoto:             text("profile_photo"),
  passwordResetTokenHash:   text("password_reset_token_hash"),
  passwordResetExpires:     timestamp("password_reset_expires"),
  authUserId:               text("auth_user_id"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
