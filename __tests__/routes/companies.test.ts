import request from "supertest";
import { readFile } from "fs/promises";

import app from "../../src/app";
import { db } from "../../src/db";

const testCompany = {
  code: "test",
  name: "Test Company",
  description: "For testing purposes",
};

beforeAll(async function () {
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM invoices");
  const sql = await readFile("./__tests__/test_data.sql", "utf8");
  await db.query(sql);
});

afterAll(async function () {
  // close db connection
  await db.end();
});

describe("GET Company routes", () => {
  test("Get all companies", async () => {
    const res = await request(app).get("/companies");
    expect(res.body).toEqual({
      companies: [
        { code: "apple", description: "Maker of OSX.", name: "Apple Computer" },
        { code: "ibm", description: "Big blue.", name: "IBM" },
      ],
    });
  });

  test("Get one company", async () => {
    const res = await request(app).get("/companies/ibm");
    expect(res.body).toEqual({
      company: {
        code: "ibm",
        description: "Big blue.",
        name: "IBM",
        invoices: [
          {
            amt: 400,
            id: 4,
          },
        ],
      },
    });
  });
});

describe("POST company routes", () => {
  test("Add a company", async () => {
    const res = await request(app).post("/companies").send(testCompany);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ company: testCompany });
  });
});

describe("PUT company routes", () => {
  test("Modify a company", async () => {
    const res = await request(app)
      .put("/companies/ibm")
      .send({ name: "IBM", description: "I've been moved" });
    expect(res.body).toEqual({
      company: {
        code: "ibm",
        name: "IBM",
        description: "I've been moved",
      },
    });
  });
});

describe("DELETE company routes", () => {
  test("Delete a company", async () => {
    const res = await request(app).delete("/companies/ibm");
    expect(res.body).toEqual({ status: "deleted" });
  });
});
