/** Routes for companies */

import { Router } from "express";
import { db } from "../db";

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

export { companies };
