import knex from "knex";
import configs from "../../knexfile";

const knexConfig = configs[process.env.NODE_ENV || "development"];
export const knexInstance = knex(knexConfig);
