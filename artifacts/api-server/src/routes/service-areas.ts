import { Router } from "express";
import { db } from "@workspace/db";
import { servicePincodes } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

/** GET /api/service-areas  — list all active pincodes */
router.get("/service-areas", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(servicePincodes)
      .where(eq(servicePincodes.isActive, true));

    res.json({ data: rows });
  } catch (err) {
    console.error("GET /service-areas error:", err);
    res.status(500).json({ error: "Failed to fetch service areas" });
  }
});

/** GET /api/service-areas/check?pincode=733101 */
router.get("/service-areas/check", async (req, res) => {
  try {
    const pincode = req.query.pincode as string;
    if (!pincode) return res.status(400).json({ error: "pincode is required" });

    const [row] = await db
      .select()
      .from(servicePincodes)
      .where(eq(servicePincodes.pincode, pincode))
      .limit(1);

    res.json({
      serviceable: !!(row?.isActive),
      area: row?.area ?? null,
      state: row?.state ?? null,
    });
  } catch (err) {
    console.error("GET /service-areas/check error:", err);
    res.status(500).json({ error: "Failed to check pincode" });
  }
});

export default router;
