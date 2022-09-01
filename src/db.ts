/** Database setup for BizTime. */

import { Client } from "pg";

const db = connectDB(process.env.NODE_ENV);

export { db };

/*
 * Helpers
 */

function connectDB(env: string | undefined) {
  const prefix = "postgresql:///";
  const DB_URI = env === "test" ? prefix + "bizime_test" : prefix + "biztime";
  const db = new Client({ connectionString: DB_URI });
  db.connect();
  return db;
}
