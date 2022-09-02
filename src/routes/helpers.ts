import { QueryResult } from "pg";
const ExpressError = require("../expressError");

function checkRowsNotEmpty(result: QueryResult, entry: string): any {
  if (result.rows.length !== 0) {
    return result.rows;
  } else {
    throw new ExpressError(`${entry} not found`, 404);
  }
}

/*
 * Ideally this would check types as well
 */
function checkValidJSON(keys: any[]): void {
  if (keys.some((key) => key === null)) {
    throw new ExpressError("Invalid JSON", 400);
  }
}

export { checkRowsNotEmpty, checkValidJSON };
