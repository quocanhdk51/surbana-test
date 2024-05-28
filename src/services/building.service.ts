import { knexInstance } from "../knex";
import {
  Building,
  BuildingCreateRequest,
  BuildingLocationTree,
  BuildingLocationTreeNode,
  BuildingUpdateRequest,
  Location,
  Pagination,
  PaginationRequest,
} from "../models";

type LocationChildrenMap = Record<number, Location[]>;

function buildLocationTree(
  node: BuildingLocationTreeNode,
  locationChildrenMap: LocationChildrenMap
) {
  const children = locationChildrenMap[node.id] || [];

  for (const child of children) {
    const childNode: BuildingLocationTreeNode = {
      ...child,
      nodes: [],
    };

    buildLocationTree(childNode, locationChildrenMap);
    node.nodes.push(childNode);
  }
}

export class BuildingService {
  async createBuilding(request: BuildingCreateRequest): Promise<Building> {
    const [building] = await knexInstance("buildings")
      .insert(request)
      .returning<Building[]>("*");

    return building;
  }

  async getBuildings(
    request: PaginationRequest
  ): Promise<Pagination<Building>> {
    const buildings = await knexInstance
      .select("*")
      .from<Building>("buildings")
      .limit(request.limit)
      .offset(request.offset);

    const [{ count }] = await knexInstance("buildings").count();

    return {
      data: buildings,
      total: +count,
      offset: request.offset,
      limit: request.limit,
    };
  }

  getBuildingById(id: number): Promise<Building> {
    return knexInstance.select("*").from("buildings").where({ id }).first();
  }

  async updateBuilding(request: BuildingUpdateRequest): Promise<Building> {
    const { id, ...rest } = request;

    const [building] = await knexInstance("buildings")
      .where({ id })
      .update({ ...rest, updated_at: knexInstance.fn.now() })
      .returning<Building[]>("*");

    return building;
  }

  deleteBuilding(id: number): Promise<Building> {
    return knexInstance("buildings").where({ id }).delete();
  }

  async getLocationTree(id: number): Promise<BuildingLocationTree> {
    const building = await this.getBuildingById(id);
    const locations = await this._getBuildingLocationById(id);

    const locationTree: BuildingLocationTree = {
      ...building,
      nodes: [],
    };

    const locationChildrenMap: Record<number, Location[]> = {};

    for (const location of locations) {
      if (location.location_id) {
        if (!locationChildrenMap[location.location_id]) {
          locationChildrenMap[location.location_id] = [];
        }

        locationChildrenMap[location.location_id].push(location);
      } else {
        locationTree.nodes.push({
          ...location,
          nodes: [],
        });
      }
    }

    for (const node of locationTree.nodes) {
      buildLocationTree(node, locationChildrenMap);
    }

    return locationTree;
  }

  async getBuildingLocationTrees(
    request: PaginationRequest
  ): Promise<Pagination<BuildingLocationTree>> {
    const {
      data: buildings,
      total,
      limit,
      offset,
    } = await this.getBuildings(request);
    const locations = await this._getBuildingLocations(
      buildings.map((b) => b.id)
    );

    const locationChildrenMap: Record<number, Location[]> = {};
    const rootLocationChildrenMap: Record<number, Location[]> = {};
    const mapLocationChildren = (
      key: number,
      location: Location,
      map: Record<number, Location[]>
    ) => {
      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(location);
    };

    for (const location of locations) {
      const mapKey = location.location_id || location.building_id;
      const map = !location.location_id
        ? rootLocationChildrenMap
        : locationChildrenMap;

      mapLocationChildren(mapKey, location, map);
    }

    return {
      data: buildings.map((building) => {
        const children = rootLocationChildrenMap[building.id] || [];
        const nodes = children.map((child) => {
          const node: BuildingLocationTreeNode = {
            ...child,
            nodes: [],
          };

          buildLocationTree(node, locationChildrenMap);

          return node;
        });

        const locationTree: BuildingLocationTree = {
          ...building,
          nodes,
        };

        return locationTree;
      }),
      total,
      limit,
      offset,
    };
  }

  private async _getBuildingLocations(
    building_ids: number[]
  ): Promise<Location[]> {
    return knexInstance
      .select("*")
      .from("locations")
      .whereIn("building_id", building_ids);
  }

  private async _getBuildingLocationById(id: number): Promise<Location[]> {
    return knexInstance
      .select("*")
      .from("locations")
      .where({ building_id: id });
  }
}

export const buildingService = new BuildingService();
