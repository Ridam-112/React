import { Router } from "express";
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";

const router = Router();

// Columns safe to return to the client (never return password hashes or reset tokens)
const PUBLIC_COLS = {
  id:           users.id,
  name:         users.name,
  phone:        users.phone,
  email:        users.email,
  role:         users.role,
  status:       users.status,
  vendorStatus: users.vendorStatus,
  pincode:      users.pincode,
  addresses:    users.addresses,
  profilePhoto: users.profilePhoto,
  authProvider: users.authProvider,
  lastLoginAt:  users.lastLoginAt,
  createdAt:    users.createdAt,
};

/** GET /api/users/me */
router.get("/users/me", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const lookupId = (req.query.user_id as string) ?? userId;

    if (!lookupId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const [user] = await db
      .select(PUBLIC_COLS)
      .from(users)
      .where(eq(users.id, lookupId))
      .limit(1);

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ data: user });
  } catch (err) {
    console.error("GET /users/me error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
