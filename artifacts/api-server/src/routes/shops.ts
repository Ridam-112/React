import { Router } from "express";
import { db } from "@workspace/db";
import { shops, products } from "@workspace/db/schema";
import { eq, and, ilike, sql } from "drizzle-orm";

const router = Router();

/** GET /api/shops
 * Query params: category, shop_type, pincode, status, search, limit, offset
 */
router.get("/shops", async (req, res) => {
  try {
    const { category, shop_type, search, limit = "40", offset = "0" } = req.query as Record<string, string>;

    const conditions = [eq(shops.status, "approved")];

    if (category)  conditions.push(eq(shops.category, category));
    if (shop_type) conditions.push(eq(shops.shopType, shop_type));
    if (search)    conditions.push(ilike(shops.shopName, `%${search}%`));

    const rows = await db
      .select({
        id: shops.id,
        shopName: shops.shopName,
        ownerName: shops.ownerName,
        shopType: shops.shopType,
        category: shops.category,
        description: shops.description,
        image: shops.image,
        banner: shops.banner,
        address: shops.address,
        isOpen: shops.isOpen,
        rating: shops.rating,
        totalOrders: shops.totalOrders,
        timings: shops.timings,
        createdAt: shops.createdAt,
      })
      .from(shops)
      .where(and(...conditions))
      .limit(Math.min(Number(limit), 100))
      .offset(Number(offset));

    res.json({ data: rows, total: rows.length });
  } catch (err) {
    console.error("GET /shops error:", err);
    res.status(500).json({ error: "Failed to fetch shops" });
  }
});

/** GET /api/shops/:id */
router.get("/shops/:id", async (req, res) => {
  try {
    const [shop] = await db
      .select()
      .from(shops)
      .where(eq(shops.id, req.params.id))
      .limit(1);

    if (!shop) return res.status(404).json({ error: "Shop not found" });

    // Product count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(and(eq(products.shopId, shop.id), eq(products.status, "active")));

    res.json({ data: { ...shop, productCount: count } });
  } catch (err) {
    console.error("GET /shops/:id error:", err);
    res.status(500).json({ error: "Failed to fetch shop" });
  }
});

export default router;
