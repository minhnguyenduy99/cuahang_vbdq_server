
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

  getAllGroupsExcept(...excludeGroupKey: string[]) {
    let newGroups: { [key: string]: string } = { ...this.groups };
    excludeGroupKey.forEach(group => {
      delete newGroups[group];
    })
    return Object.values(newGroups);
  }
}

const CreateType = new TransformationType();
export default CreateType;
