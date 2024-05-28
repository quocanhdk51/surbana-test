# Projects contain 2 table which is Buildings and Locations.
# The relation ship is one Building is related to many Locations through foreign key building_id
# Location can be related to another parent Location through foreign key parent_id

# Each of entity will provide API for basic CRUD
# For Building Entity, There will be 2 special APIs to acquire building location tree

# Common Model
interface Pagination<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
}

# Location Entity Model
interface Location {
  id: number;
  name: string;
  key: string;
  location_id: number | null;
  building_id: number;
  area: number;
  created_at: string;
  updated_at: string;
}

interface LocationCreateRequest {
  name: string;
  key: string;
  area: number;
  location_id: number | null;
  building_id: number;
}

interface LocationUpdateRequest {
  id: number;
  name: string;
  key: string;
  area: number;
  location_id: number | null;
  building_id: number;
}

# Building Entity Model
interface Building {
  id: number;
  name: string;
  key: string;
  created_at: string;
  updated_at: string;
};

interface BuildingCreateRequest {
  name: string;
  key: string;
}

interface BuildingUpdateRequest {
  id: number;
  name: string;
  key: string;
}

interface BuildingLocationTreeNode extends Omit<Location, "parent_id"> {
  nodes: BuildingLocationTreeNode[];
}

interface BuildingLocationTree extends Building {
  nodes: BuildingLocationTreeNode[];
}

# Building Entity API
- GET api/buildings?offset=$1&limit=$2 => Pagination<Building>
- GET api/buildings/location-trees?offset=$1&limit=$2 => Pagination<BuildingLocationTree>
- GET api/buildings/:id => Building
- GET api/buildings/:id/location-trees => BuildingLocationTree
- POST api/buildings body: BuildingCreateRequest => Building
- PUT api/buildings body: BuildingUpdateRequest => Building
- DELETE api/buildings/:id => { success: boolean }

# Location Entity API
- GET api/locations?offset=$1&limit=$2 => Pagination<Location>
- GET api/locations/:id => Location
- POST api/locations body: LocationCreateRequest => Location
- PUT api/locations body: LocationUpdateRequest => Location
- DELETE api/locations/:id => { success: boolean }

# Install & Run
- Setup Postgres DB with table name as postgres, user as postgres and password as postgres
- Postgres DB should be serving on PORT 5432
- For customization, Please have a look at knexfile.ts for configuration
- Run npm i and npm i knex -g
- Run knex migrate:latest
- Run npm run dev to start server

