import { ErrorRequestHandler } from "express";
import { RequestError } from "../models";
import { HttpStatus } from "../constants";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof RequestError) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: err });
};
