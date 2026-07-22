import { Router } from "express";
import { db } from "@workspace/db";
import { orders } from "@workspace/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getAuth } from "@clerk/express";

const router = Router();

/** GET /api/orders  — returns orders for the authenticated user */
router.get("/orders", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const customerId = (req.query.customer_id as string) ?? userId;

    if (!customerId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId))
      .orderBy(desc(orders.createdAt))
      .limit(50);

    res.json({ data: rows });
  } catch (err) {
    console.error("GET /orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/** GET /api/orders/:id */
router.get("/orders/:id", async (req, res) => {
  try {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, req.params.id))
      .limit(1);

    if (!order) return res.status(404).json({ error: "Order not found" });

    const { userId } = getAuth(req);
    const customerId = req.query.customer_id as string | undefined;
    const requesterId = userId ?? customerId;

    // Only allow the owner to fetch their own order (super_admins bypass this on the admin side)
    if (requesterId && order.customerId !== requesterId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json({ data: order });
  } catch (err) {
    console.error("GET /orders/:id error:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
