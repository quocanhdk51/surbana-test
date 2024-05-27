import { z } from "zod";
import { PaginationConstants } from "../constants";

export const paginationRequestSchema = z.object({
  offset: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(PaginationConstants.DEFAULT_OFFSET),
  limit: z.coerce
    .number()
    .int()
    .nonnegative()
    .default(PaginationConstants.DEFAULT_LIMIT),
});
