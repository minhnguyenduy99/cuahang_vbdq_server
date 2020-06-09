import { initialize as initializeRole } from "@modules/roles/shared";
import { initializer as khachhangInitializer } from "@modules/khachhang/shared";
import { initializer as nhanvienInitializer } from "@modules/nhanvien/shared";

import { Dependency } from "@dep";

export default async function initializeModule(dep: Dependency) {
  await Promise.all([
    initializeRole(dep),
    khachhangInitializer.initialize(dep),
    nhanvienInitializer.initialize(dep)
  ])
}