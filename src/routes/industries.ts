/** Routes for industries */

import { Router } from "express";
import { QueryResult } from "pg";
import slugify from "slugify";

import { db } from "../db";
const ExpressError = require("../expressError");
import { checkRowsNotEmpty, checkValidJSON } from "./helpers";

const industries = Router();

industries.get("/", async (req, res, next) => {
  try {
    const industriesRes = await db.query(
      /* Thanks to https://dba.stackexchange.com/a/173879 */
      `SELECT i.name, c.comp_array AS companies
        FROM industries AS i
          LEFT JOIN (
            SELECT ic.ind_code as code, array_agg(c.name) AS comp_array
            FROM industries_companies AS ic
            JOIN companies AS c ON c.code = ic.comp_code
            GROUP BY ic.ind_code
            ) c USING (code);
        `
    );
    return res.json({ industries: industriesRes.rows });
  } catch (e) {
    return next(e);
  }
});

industries.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    checkValidJSON([name]);
    const code = slugify(name, { strict: true, lower: true });
    const industryRes = await db.query(
      `INSERT INTO industries (code, name)
        VALUES ($1, $2)
        RETURNING code, name`,
      [code, name]
    );
    return res.status(201).json({ industry: industryRes.rows[0] });
  } catch (e) {
    return next(e);
  }
});

export { industries };
