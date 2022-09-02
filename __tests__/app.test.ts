import request from "supertest";

import app from "../src/app";

describe("Test app.ts", () => {
  test("404 route for unregistered", async () => {
    const res = await request(app).get("/invalid");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Resource not found" });
  });
});
