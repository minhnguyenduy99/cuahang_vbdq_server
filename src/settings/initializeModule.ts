import { initialize as initializeRole } from "@modules/roles/shared";
import { Dependency } from "@dep";

export default function initializeModule(dep: Dependency) {
  initializeRole(dep);
}