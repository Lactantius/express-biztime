import request from "supertest";

import app from "../../src/app";
import { db } from "../../src/db";
import { resetDB } from "../helpers/data";

beforeAll(resetDB);

afterAll(async function () {
  // close db connection
  await db.end();
});

describe("GET industries routes", () => {
  test("GET all industries", async () => {
    const res = await request(app).get("/industries");
    expect(res.body).toEqual({
      industries: [
        { name: "Business IT", companies: ["IBM"] },
        { name: "Software", companies: ["IBM", "Apple Computer"] },
        { name: "Oil", companies: null },
      ],
    });
  });
});
