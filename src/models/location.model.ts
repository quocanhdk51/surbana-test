import { z } from "zod";
import { locationCreateSchema, locationUpdateSchema } from "./../zod";

export interface Location {
  id: number;
  name: string;
  key: string;
  location_id: number | null;
  building_id: number;
  area: number;
  created_at: string;
  updated_at: string;
}

export type LocationCreateRequest = z.infer<typeof locationCreateSchema>;
export type LocationUpdateRequest = z.infer<typeof locationUpdateSchema>;
