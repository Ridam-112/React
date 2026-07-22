import { pgTable, text, real, timestamp, jsonb } from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id:                 text("id").primaryKey(),
  customerId:         text("customer_id").notNull(),
  customerName:       text("customer_name").notNull(),
  customerPhone:      text("customer_phone").notNull(),
  shopId:             text("shop_id").notNull(),
  shopName:           text("shop_name").notNull(),
  items:              jsonb("items").notNull(),
  subtotal:           real("subtotal").notNull(),
  deliveryCharge:     real("delivery_charge").notNull(),
  couponDiscount:     real("coupon_discount").notNull(),
  netAmount:          real("net_amount").notNull(),
  commissionRate:     real("commission_rate").notNull(),
  commissionAmount:   real("commission_amount").notNull(),
  vendorPayable:      real("vendor_payable").notNull(),
  platformRevenue:    real("platform_revenue").notNull(),
  status:             text("status").notNull(),
  paymentMethod:      text("payment_method").notNull(),
  paymentStatus:      text("payment_status").notNull(),
  deliveryPartnerId:  text("delivery_partner_id"),
  address:            jsonb("address").notNull(),
  couponCode:         text("coupon_code"),
  razorpayOrderId:    text("razorpay_order_id"),
  razorpayPaymentId:  text("razorpay_payment_id"),
  refundedAt:         timestamp("refunded_at"),
  cancelReason:       text("cancel_reason"),
  createdAt:          timestamp("created_at").notNull().defaultNow(),
  updatedAt:          timestamp("updated_at").notNull().defaultNow(),
  deliveryType:       text("delivery_type").notNull(),
  deliveryOtp:        text("delivery_otp"),
  packagingFee:       real("packaging_fee").notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
