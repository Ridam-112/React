import { Router } from "express";
import { db } from "@workspace/db";
import { homepageSections, products, shops, categories } from "@workspace/db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";

const router = Router();

/**
 * GET /api/homepage
 * Returns all enabled sections in sort order, with their resolved data inline.
 */
router.get("/homepage", async (_req, res) => {
  try {
    const sections = await db
      .select()
      .from(homepageSections)
      .where(eq(homepageSections.enabled, true))
      .orderBy(homepageSections.sortOrder);

    const enriched = await Promise.all(
      sections.map(async (section) => {
        const cfg = (section.config ?? {}) as Record<string, unknown>;
        const limit = Math.min(Number(cfg.limit ?? 20), 100);

        if (section.type === "category") {
          const slug = cfg.categorySlug as string | undefined;
          if (!slug) return { ...section, items: [] };

          const [cat] = await db
            .select()
            .from(categories)
            .where(eq(categories.slug, slug))
            .limit(1);

          const items = await db
            .select()
            .from(products)
            .where(
              and(
                eq(products.category, slug),
                eq(products.status, "active"),
              ),
            )
            .orderBy(desc(products.createdAt))
            .limit(limit);

          return { ...section, category: cat ?? null, items };
        }

        if (section.type === "shop_type") {
          const shopType = cfg.shopType as string | undefined;
          if (!shopType) return { ...section, items: [] };

          const items = await db
            .select({
              id: shops.id,
              shopName: shops.shopName,
              image: shops.image,
              shopType: shops.shopType,
              isOpen: shops.isOpen,
              rating: shops.rating,
              address: shops.address,
            })
            .from(shops)
            .where(
              and(
                eq(shops.shopType, shopType),
                eq(shops.status, "approved"),
              ),
            )
            .limit(limit);

          return { ...section, items };
        }

        if (section.type === "trending") {
          const items = await db
            .select()
            .from(products)
            .where(
              and(eq(products.trending, true), eq(products.status, "active")),
            )
            .orderBy(desc(products.createdAt))
            .limit(limit);

          return { ...section, items };
        }

        return { ...section, items: [] };
      }),
    );

    res.json({ data: enriched });
  } catch (err) {
    console.error("GET /homepage error:", err);
    res.status(500).json({ error: "Failed to fetch homepage" });
  }
});

export default router;
