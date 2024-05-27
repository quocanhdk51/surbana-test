import { Router } from "express";
import { locationService } from "../services";
import { validateBody, validateParams, validateQuery } from "../middlewares";
import {
  locationCreateSchema,
  locationIdSchema,
  locationUpdateSchema,
  paginationRequestSchema,
} from "../zod";
import { PaginationUtils } from "../utils";

const locationRouter = Router();

locationRouter.get(
  "/",
  validateQuery(paginationRequestSchema),
  async (req, res, next) => {
    try {
      const locations = await locationService.getLocations(
        PaginationUtils.getPaginationRequest(req)
      );
      res.json(locations);
    } catch (e) {
      next(e);
    }
  }
);

locationRouter.get(
  "/:id",
  validateParams("id", locationIdSchema),
  async (req, res, next) => {
    try {
      const location = await locationService.getLocationById(+req.params.id);
      res.json(location);
    } catch (e) {
      next(e);
    }
  }
);

locationRouter.post(
  "/",
  validateBody(locationCreateSchema),
  async (req, res, next) => {
    try {
      const location = await locationService.createLocation(req.body);
      res.status(201).json(location);
    } catch (e) {
      next(e);
    }
  }
);

locationRouter.put(
  "/",
  validateBody(locationUpdateSchema),
  async (req, res, next) => {
    try {
      const location = await locationService.updateLocations(req.body);
      res.json(location);
    } catch (e) {
      next(e);
    }
  }
);

locationRouter.delete(
  "/:id",
  validateParams("id", locationIdSchema),
  async (req, res, next) => {
    try {
      const location = await locationService.deleteLocation(+req.params.id);
      res.json(location);
    } catch (e) {
      next(e);
    }
  }
);

export { locationRouter };
