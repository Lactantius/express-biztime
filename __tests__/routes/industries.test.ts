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

describe("POST industries routes", () => {
  test("POST a new industry", async () => {
    const res = await request(app)
      .post("/industries")
      .send({ name: "Widget Sales" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      industry: {
        name: "Widget Sales",
        code: "widget-sales",
      },
    });
  });

  test("Add a company to an industry", async () => {
    const res = await request(app)
      .post("/industries/oil")
      .send({ company: "ibm" });
    //expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ status: "added ibm to oil industry" });
  });
});
