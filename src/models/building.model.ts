import { z } from "zod";
import { buildingCreateSchema, buildingUpdateSchema } from "../zod";
import { Location } from "./location.model";

export interface Building {
  id: number;
  name: string;
  key: string;
  created_at: string;
  updated_at: string;
}

export type BuildingCreateRequest = z.infer<typeof buildingCreateSchema>;
export type BuildingUpdateRequest = z.infer<typeof buildingUpdateSchema>;

export interface BuildingLocationTreeNode extends Omit<Location, "parent_id"> {
  nodes: BuildingLocationTreeNode[];
}

export interface BuildingLocationTree extends Building {
  nodes: BuildingLocationTreeNode[];
}
