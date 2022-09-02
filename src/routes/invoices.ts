import { Router } from "express";
import { QueryResult } from "pg";

import { db } from "../db";
const ExpressError = require("../expressError");
import { checkRowsNotEmpty, checkValidJSON } from "./helpers";

const invoices = Router();

invoices.get("/", async (req, res, next) => {
  try {
    const invoices = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date
        FROM invoices`
    );
    return res.json({ invoices: invoices.rows });
  } catch (e) {
    return next(e);
  }
});

invoices.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const invoice = await db.query(
      `SELECT id, comp_code, amt, paid, add_date, paid_date
        FROM invoices
        WHERE id=$1`,
      [id]
    );
    const rows = checkRowsNotEmpty(invoice, "invoice");
    return res.json({ invoice: rows[0] });
  } catch (e) {
    return next(e);
  }
});

invoices.post("/", async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    checkValidJSON([comp_code, amt]);
    const invoice: QueryResult<any> = await db.query(
      `INSERT INTO invoices (comp_code, amt)
        VALUES ($1, $2)
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: invoice.rows[0] });
  } catch (e) {
    return next(e);
  }
});

invoices.put("/:id", async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const { amt } = req.body;
    checkValidJSON([amt]);
    const invoice: QueryResult<any> = await db.query(
      `UPDATE invoices SET amt=$2
        WHERE id=$1
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [id, amt]
    );
    const rows = checkRowsNotEmpty(invoice, "invoice");
    return res.json({ invoice: rows[0] });
  } catch (e) {
    return next(e);
  }
});

invoices.delete("/:id", async (req, res, next) => {
  try {
    const id: string = req.params.id;
    const invoice = await db.query(
      `DELETE FROM invoices
        WHERE id=$1
        RETURNING id`,
      [id]
    );
    checkRowsNotEmpty(invoice, "invoice");
    return res.json({ status: "deleted" });
  } catch (e) {
    return next(e);
  }
});

export { invoices };
