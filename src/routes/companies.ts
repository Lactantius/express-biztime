/** Routes for companies */

import { Router } from "express";
import { db } from "../db";

const router = Router();

router.get("/", async (req, res, next) => {
  const companies = await db.query(
    `SELECT code, name, description FROM companies`
  );
  return res.json({ companies: companies.rows });
});
