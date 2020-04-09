import * as _repo from "./repos";
import DatabaseService from "./DatabaseService";
export { default as DbConfigObjectConnection } from "./DbConfigObjectConnection";
export { default as DBConnectionManager } from "./DBConnectionManager";
export { default as DatabaseService } from "./DatabaseService";
export { default as DBConnectionString } from "./DbConnectionString";
export * from "./DatabaseError";
export const repo = _repo;

export const knexDBService = new DatabaseService()