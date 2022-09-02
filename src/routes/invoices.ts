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
    const company = await db.query(
      `SELECT code, name, description
        FROM companies
        WHERE code=$1`,
      [rows[0].comp_code]
    );
    rows[0]["company"] = company.rows[0];
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
    const id = Number(req.params.id);
    const paidStatus = await isInvoicePaid(id);
    const { amt, paid } = req.body;
    checkValidJSON([amt, paid]);

    const invoice = await updateInvoice(id, amt, paid, paidStatus);
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

/*
 * Helpers
 */

async function isInvoicePaid(id: number): Promise<boolean> {
  const invoice = await db.query(
    `SELECT paid
       FROM invoices
       WHERE id=$1`,
    [id]
  );
  const paid = checkRowsNotEmpty(invoice, "invoice")[0].paid;
  return paid as boolean;
}

async function updateInvoice(
  id: number,
  amt: number,
  paid: boolean,
  paidStatus: boolean
): Promise<QueryResult<any>> {
  if (paidStatus === paid) {
    /* Ignore paid if not updating */
    return db.query(
      `UPDATE invoices SET amt=$2
        WHERE id=$1
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [id, amt]
    );
  } else if (paid) {
    /* Update paid_date if newly paid */
    return db.query(
      `UPDATE invoices SET amt=$2, paid=$3, paid_date=$4
        WHERE id=$1
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [id, amt, paid, new Date()]
    );
  } else {
    /* Clear paid_date if cancelling payment */
    return db.query(
      `UPDATE invoices SET amt=$2, paid=$3, paid_date=$4
        WHERE id=$1
        RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [id, amt, paid, null]
    );
  }
}
