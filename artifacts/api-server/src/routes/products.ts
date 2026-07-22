import { Router } from "express";
import { db } from "@workspace/db";
import { products, shops } from "@workspace/db/schema";
import { eq, and, ilike, or, sql } from "drizzle-orm";

const router = Router();

/** GET /api/products
 * Query params: category, shop_id, search, trending, limit, offset
 */
router.get("/products", async (req, res) => {
  try {
    const { category, shop_id, search, trending, limit = "40", offset = "0" } = req.query as Record<string, string>;

    const conditions = [eq(products.status, "active")];

    if (category) conditions.push(eq(products.category, category));
    if (shop_id)  conditions.push(eq(products.shopId, shop_id));
    if (trending === "true") conditions.push(eq(products.trending, true));
    if (search) {
      conditions.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description ?? sql`''`, `%${search}%`),
        )!,
      );
    }

    const rows = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .limit(Math.min(Number(limit), 100))
      .offset(Number(offset));

    res.json({ data: rows, total: rows.length });
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/** GET /api/products/:id */
router.get("/products/:id", async (req, res) => {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, req.params.id))
      .limit(1);

    if (!product) return res.status(404).json({ error: "Product not found" });

    // Attach shop info
    const [shop] = await db
      .select({
        id: shops.id,
        shopName: shops.shopName,
        image: shops.image,
        isOpen: shops.isOpen,
        rating: shops.rating,
      })
      .from(shops)
      .where(eq(shops.id, product.shopId))
      .limit(1);

    res.json({ data: { ...product, shop: shop ?? null } });
  } catch (err) {
    console.error("GET /products/:id error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
