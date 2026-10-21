import { Router, type Request, type Response } from "express";
import type { Pool } from "pg";
import { getReputationLeaderboard } from "@linkora/reputation";

export function createReputationRouter(pool: Pool): Router {
  const router = Router();
  router.get("/leaderboard", async (req: Request, res: Response): Promise<void> => {
    const limit = req.query.limit === undefined ? 50 : Number(req.query.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      res.status(400).json({ error: "limit must be an integer between 1 and 100" });
      return;
    }
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
    try {
      const page = await getReputationLeaderboard(pool, limit, cursor);
      res.json(page);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      if (message === "cursor is invalid") {
        res.status(400).json({ error: message });
        return;
      }
      res.status(500).json({ error: "failed to fetch reputation leaderboard" });
    }
  });
  return router;
}
