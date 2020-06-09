import { IInitializer } from "@core";
import { Dependency, DEPConsts } from "@dep";


export default class KhachHangInitializer implements IInitializer {
  
  async initialize(dep: Dependency): Promise<void> {
    dep.registerDomainService(DEPConsts.KhachHangService);  
  }
}