
class TransformationType {

  private groups = {
    createNew: "CREATE_NEW",
    loadFromPersistence: "LOAD_FROM_PERSISTENCE",
    toPersistence: "TO_PERSISTENCE",
    toAppRespone: "TO_APP_RESPONE",
    exposeAll: "EXPOSE_ALL",
    update: "UPDATE"
  }

  private allGroupsValues = Object.values(this.groups);

  constructor() {
    Object.freeze(this.groups);
  }

  getGroups() {
    return this.groups;
  }

  getAllGroupKeys() {
    return Object.keys(this.groups);
  }

  getAllGroups() {
    return this.allGroupsValues;
  }

  getAllGroupsExcept(excludeGroupKey: string) {
    const allGroupKey = this.getAllGroupKeys();
    const excludeGroupIndex = allGroupKey.indexOf(excludeGroupKey);
    const allGroups = Object.values(this.groups);
    allGroups.splice(excludeGroupIndex, 1);
    return allGroups
  }
}

const CreateType = new TransformationType();
export default CreateType;
