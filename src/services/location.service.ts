import { knexInstance } from "../knex";
import {
  Location,
  LocationCreateRequest,
  LocationUpdateRequest,
  Pagination,
  PaginationRequest,
} from "../models";

export class LocationService {
  async createLocation(request: LocationCreateRequest): Promise<Location> {
    const [location] = await knexInstance("locations")
      .insert(request)
      .returning<Location[]>("*");

    return location;
  }

  async getLocations(
    request: PaginationRequest
  ): Promise<Pagination<Location>> {
    const locations = await knexInstance
      .select("*")
      .from<Location>("locations")
      .limit(request.limit)
      .offset(request.offset);

    const [{ count }] = await knexInstance("locations").count();

    return {
      data: locations,
      total: +count,
      offset: request.offset,
      limit: request.limit,
    };
  }

  getLocationById(id: number): Promise<Location> {
    return knexInstance.select("*").from("locations").where({ id }).first();
  }

  async updateLocations(request: LocationUpdateRequest): Promise<Location> {
    const { id, ...rest } = request;

    const [location] = await knexInstance("locations")
      .where({ id })
      .update({ ...rest, updated_at: knexInstance.fn.now() })
      .returning<Location[]>("*");

    return location;
  }

  async deleteLocation(id: number): Promise<Location> {
    const [location] = await knexInstance("locations")
      .where({ id })
      .delete()
      .returning<Location[]>("*");

    return location;
  }
}

export const locationService = new LocationService();
