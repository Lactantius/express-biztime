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

const testInvoice = {
  comp_code: "ibm",
  amt: 500,
};

describe("GET invoice routes", () => {
  test("Get all invoices", async () => {
    const res = await request(app).get("/invoices");
    expect(res.body.invoices.length).toEqual(4);
  });

  test("Get one invoice", async () => {
    const res = await request(app).get("/invoices/1");
    expect(res.body.invoice.company).toEqual({
      code: "apple",
      description: "Maker of OSX.",
      name: "Apple Computer",
    });
  });
});

describe("POST invoice routes", () => {
  test("Add an invoice", async () => {
    const res = await request(app).post("/invoices").send(testInvoice);
    expect(res.statusCode).toBe(201);
    res.body.invoice.add_date = null;
    expect(res.body).toEqual({
      invoice: {
        add_date: null,
        comp_code: "ibm",
        amt: 500,
        paid: false,
        paid_date: null,
        id: 5,
      },
    });
  });
});

describe("PUT invoice routes", () => {
  test("Modify an invoice", async () => {
    const res = await request(app).put("/invoices/1").send({ amt: 200 });
    res.body.invoice.add_date = null;
    expect(res.body).toEqual({
      invoice: {
        add_date: null,
        id: 1,
        comp_code: "apple",
        amt: 200,
        paid: false,
        paid_date: null,
      },
    });
  });
});

describe("DELETE invoice routes", () => {
  test("Delete an invoice", async () => {
    const res = await request(app).delete("/invoices/1");
    expect(res.body).toEqual({ status: "deleted" });
  });
});
