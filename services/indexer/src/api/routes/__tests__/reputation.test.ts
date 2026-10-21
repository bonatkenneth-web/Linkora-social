import express from "express";
import request from "supertest";
import { createReputationRouter } from "../reputation";

describe("GET /reputation/leaderboard", () => {
  const query = jest.fn();
  const app = express().use("/reputation", createReputationRouter({ query } as never));

  beforeEach(() => query.mockReset());

  it("returns ranked entries and a pagination cursor", async () => {
    query.mockResolvedValue({ rows: [
      { user_address: "G1", username: "alice", score: 9000 },
      { user_address: "G2", username: "bob", score: 8000 },
    ] });

    const response = await request(app).get("/reputation/leaderboard?limit=1").expect(200);
    expect(response.body.entries).toEqual([
      { address: "G1", username: "alice", score: 9000, tier: "legendary" },
    ]);
    expect(response.body.nextCursor).toBeTruthy();
  });

  it("rejects invalid limits and cursors", async () => {
    await request(app).get("/reputation/leaderboard?limit=101").expect(400);
    await request(app).get("/reputation/leaderboard?cursor=bad").expect(400);
    expect(query).not.toHaveBeenCalled();
  });
});
