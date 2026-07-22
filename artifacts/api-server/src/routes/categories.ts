import { Router } from "express";
import { db } from "@workspace/db";
import { categories } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

/** GET /api/categories */
router.get("/categories", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.name);

    res.json({ data: rows });
  } catch (err) {
    console.error("GET /categories error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

/** GET /api/categories/:slug */
router.get("/categories/:slug", async (req, res) => {
  try {
    const [cat] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, req.params.slug))
      .limit(1);

    if (!cat) return res.status(404).json({ error: "Category not found" });
    res.json({ data: cat });
  } catch (err) {
    console.error("GET /categories/:slug error:", err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

export default router;
