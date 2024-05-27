import { Request, RequestHandler } from "express";
import { z } from "zod";
import { HttpStatus } from "../constants";

function validateBy<T, K extends keyof Request, S extends keyof Request[K]>(
  key: K,
  schema: z.ZodType<T>,
  subKey?: S
): RequestHandler {
  return (req, res, next) => {
    const data = subKey ? req[key][subKey] : req[key];
    if (!data) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid payload" });
      return;
    }

    try {
      schema.parse(data);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: "Invalid data", details: errorMessages });
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: "Internal Server Error" });
      }
    }
  };
}

export function validateBody<T>(schema: z.ZodType<T>): RequestHandler {
  return validateBy("body", schema);
}

export function validateQuery<T>(schema: z.ZodType<T>): RequestHandler {
  return validateBy("query", schema);
}

export function validateParams<T>(
  key: keyof Request["params"],
  schema: z.ZodType<T>
): RequestHandler {
  return validateBy("params", schema, key);
}
