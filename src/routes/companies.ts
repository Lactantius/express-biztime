/** Routes for companies */

import { Router } from "express";
import { QueryResult } from "pg";

import { db } from "../db";
const ExpressError = require("../expressError");
import { checkRowsNotEmpty, checkValidJSON } from "./helpers";

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
    const rows = checkRowsNotEmpty(company, "company");
    return res.json({ company: rows[0] });
  } catch (e) {
    return next(e);
  }
});

companies.post("/", async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    checkValidJSON([code, name, description]);
    const company: QueryResult<any> = await db.query(
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

companies.put("/:code", async (req, res, next) => {
  try {
    const code: string = req.params.code;
    const { name, description } = req.body;
    checkValidJSON([name, description]);
    const company: QueryResult<any> = await db.query(
      `UPDATE companies SET name=$2, description=$3
        WHERE code=$1
        RETURNING code, name, description`,
      [code, name, description]
    );
    const rows = checkRowsNotEmpty(company, "company");
    return res.json({ company: rows[0] });
  } catch (e) {
    return next(e);
  }
});

companies.delete("/:code", async (req, res, next) => {
  try {
    const code: string = req.params.code;
    const company = await db.query(
      `DELETE FROM companies
        WHERE code=$1
        RETURNING code`,
      [code]
    );
    checkRowsNotEmpty(company, "company");
    return res.json({ status: "deleted" });
  } catch (e) {
    return next(e);
  }
});

export { companies };
