/** BizTime express application. */

import express from "express";

import { companies } from "./routes/companies";

const app = express();
const ExpressError = require("./expressError");

app.use(express.json());

app.use("/companies", companies);

/** 404 handler */

// app.use(function (req, res, next) {
//   const err = new ExpressError("Not Found", 404);
//   return next(err);
// });

/** general error handler */

app.use((err: ExpressError, req: any, res: any, next: unknown) => {
  /* For some reason this doesn't pull in the types */
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message,
  });
});

module.exports = app;
