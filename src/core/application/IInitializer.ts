import { Dependency } from "@dep";


export default interface IInitializer {

  initialize(dep: Dependency): Promise<void>;
}