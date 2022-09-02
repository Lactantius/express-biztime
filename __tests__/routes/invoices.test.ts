import request from "supertest";

import app from "../../src/app";
import { db } from "../../src/db";
import { resetDB } from "../helpers/data";

beforeAll(resetDB);

afterAll(async function () {
  // close db connection
  await db.end();
});

const testInvoice = {
  comp_code: "ibm",
  amt: 500,
};

const today = new Date(new Date().setUTCHours(5, 0, 0, 0)).toISOString(); // This is way to complicated

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
    expect(res.body).toEqual({
      invoice: {
        add_date: today,
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
  test("Pay an invoice", async () => {
    const res = await request(app)
      .put("/invoices/1")
      .send({ amt: 200, paid: true });
    expect(res.body).toEqual({
      invoice: {
        add_date: today,
        id: 1,
        comp_code: "apple",
        amt: 200,
        paid: true,
        paid_date: today,
      },
    });
  });
  test("Cancel payment on an invoice", async () => {
    const res = await request(app)
      .put("/invoices/1")
      .send({ amt: 200, paid: false });
    expect(res.body).toEqual({
      invoice: {
        add_date: today,
        id: 1,
        comp_code: "apple",
        amt: 200,
        paid: false,
        paid_date: null,
      },
    });
  });
  test("Update invoice without payment", async () => {
    const res = await request(app)
      .put("/invoices/1")
      .send({ amt: 75, paid: false });
    expect(res.body).toEqual({
      invoice: {
        add_date: today,
        id: 1,
        comp_code: "apple",
        amt: 75,
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
