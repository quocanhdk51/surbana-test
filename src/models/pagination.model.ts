import { z } from "zod";
import { paginationRequestSchema } from "../zod";

export interface Pagination<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

export type PaginationRequest = z.infer<typeof paginationRequestSchema>;
