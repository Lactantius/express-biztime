/** Routes for companies */

import { Router } from "express";
import { QueryResult } from "pg";

import { db } from "../db";
const ExpressError = require("../expressError");

const companies = Router();

companies.get("/", async (req, res, next) => {
  try {
    const companies = await db.query(
      `SELECT code, name, description FROM companies`
    );
    return res.json({ companies: companies.rows });
  } catch (e) {
    return next(e);
  }
});

companies.get("/:code", async (req, res, next) => {
  try {
    const code = req.params.code;
    const company = await db.query(
      `SELECT code, name, description
        FROM companies
        WHERE code=$1`,
      [code]
    );
    const rows = checkResult(company);
    return res.json({ company: rows[0] });
  } catch (e) {
    return next(e);
  }
});

companies.post("/", async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const company = await db.query(
      `INSERT INTO companies (code, name, description)
        VALUES ($1, $2, $3)
        RETURNING code, name, description`,
      [code, name, description]
    );
    return res.status(201).json({ company: company.rows[0] });
  } catch (e) {
    return next(e);
  }
});

export { companies };

/*
 * Helpers
 */

function checkResult(result: QueryResult): any {
  if (result.rows.length !== 0) {
    return result.rows;
  } else {
    throw new ExpressError("Entry not found", 404);
  }
}
