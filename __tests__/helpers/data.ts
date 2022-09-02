import { db } from "../../src/db";
import { readFile } from "fs/promises";

async function resetDB() {
  await db.query("DELETE FROM industries_companies");
  await db.query("DELETE FROM industries");
  await db.query("DELETE FROM companies");
  await db.query("DELETE FROM invoices");
  const sql = await readFile("./__tests__/test_data.sql", "utf8");
  await db.query(sql);
}

export { resetDB };
