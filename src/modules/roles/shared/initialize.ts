import { Dependency, DEPConsts } from "@dep";


export default async function initialize(dep: Dependency) {
  let authorize = dep.getApplicationSerivce(DEPConsts.AuthorizationService);
  return dep.getDomainService(DEPConsts.RoleService, authorize).initialize();
}