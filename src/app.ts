/** BizTime express application. */

import express from "express";

import { companies } from "./routes/companies";
import { invoices } from "./routes/invoices";
import { industries } from "./routes/industries";

const app = express();
const ExpressError = require("./expressError");

app.use(express.json());

app.use("/companies", companies);
app.use("/invoices", invoices);
app.use("/industries", industries);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Resource not found", 404);
  return next(err);
});

/** general error handler */

app.use((err: ExpressError, req: any, res: any, next: unknown) => {
  /* For some reason this doesn't pull in the types */
  res.status(err.status || 500);

  return res.json({
    //error: err,
    //message: err.message,
    error: err.message,
  });
});

export default app;
