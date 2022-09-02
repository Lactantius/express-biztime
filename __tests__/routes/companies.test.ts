import request from "supertest";
import { readFile } from "fs/promises";

import app from "../../src/app";
import { db } from "../../src/db";

beforeEach(async function () {
  const sql = await readFile("./__tests__/test_data.sql", "utf8");
  await db.query(sql);
});

afterEach(async function () {
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM invoices");
  return;
});

afterAll(async function () {
  // close db connection
  await db.end();
});

describe("Company routes", () => {
  test("Get all companies", async () => {
    const res = await request(app).get("/companies");
    expect(res.body).toEqual({
      companies: [
        { code: "apple", description: "Maker of OSX.", name: "Apple Computer" },
        { code: "ibm", description: "Big blue.", name: "IBM" },
      ],
    });
  });
});
