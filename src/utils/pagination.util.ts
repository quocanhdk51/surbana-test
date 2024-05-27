import { Request } from "express";
import { PaginationRequest } from "../models";
import { PaginationConstants } from "../constants";

export class PaginationUtils {
  static getPaginationRequest(request: Request): PaginationRequest {
    const { offset, limit } = request.query;

    return {
      offset: offset ? +offset : PaginationConstants.DEFAULT_OFFSET,
      limit: limit ? +limit : PaginationConstants.DEFAULT_LIMIT,
    };
  }
}
