import { Router } from "express";
import { buildingService } from "../services";
import { validateBody, validateParams, validateQuery } from "../middlewares";
import {
  buildingCreateSchema,
  buildingIdSchema,
  buildingUpdateSchema,
  paginationRequestSchema,
} from "../zod";
import { PaginationUtils } from "../utils";
import { HttpStatus } from "../constants";

const buildingRouter = Router();

buildingRouter.post(
  "/",
  validateBody(buildingCreateSchema),
  async (req, res, next) => {
    try {
      const building = await buildingService.createBuilding(req.body);
      res.status(HttpStatus.CREATED).json(building);
    } catch (e) {
      next(e);
    }
  }
);

buildingRouter.get(
  "/",
  validateQuery(paginationRequestSchema),
  async (req, res, next) => {
    try {
      const buildings = await buildingService.getBuildings(
        PaginationUtils.getPaginationRequest(req)
      );
      res.json(buildings);
    } catch (e) {
      next(e);
    }
  }
);

buildingRouter.get(
  "/location-trees",
  validateQuery(paginationRequestSchema),
  async (req, res, next) => {
    try {
      const locationTrees = await buildingService.getBuildingLocationTrees(
        PaginationUtils.getPaginationRequest(req)
      );
      res.json(locationTrees);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
);

buildingRouter.get(
  "/:id",
  validateParams("id", buildingIdSchema),
  async (req, res, next) => {
    try {
      const building = await buildingService.getBuildingById(+req.params);
      res.json(building);
    } catch (e) {
      next(e);
    }
  }
);

buildingRouter.get(
  "/:id/location-trees",
  validateParams("id", buildingIdSchema),
  async (req, res, next) => {
    try {
      const locationTree = await buildingService.getLocationTree(
        +req.params.id
      );
      res.json(locationTree);
    } catch (e) {
      next(e);
    }
  }
);

buildingRouter.put(
  "/",
  validateBody(buildingUpdateSchema),
  async (req, res, next) => {
    try {
      const building = await buildingService.updateBuilding(req.body);
      res.json(building);
    } catch (e) {
      next(e);
    }
  }
);

buildingRouter.delete(
  "/:id",
  validateParams("id", buildingIdSchema),
  async (req, res, next) => {
    try {
      await buildingService.deleteBuilding(+req.params.id);
      res.status(HttpStatus.DELETE).json({ success: true });
    } catch (e) {
      next(e);
    }
  }
);

export { buildingRouter };
