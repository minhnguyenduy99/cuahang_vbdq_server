

class EntityCreateType {

  private groups = {
    createNew: "CREATE_NEW",
    loadFromPersistence: "LOAD_FROM_PERSISTENCE",
  }

  private allGroupsValues = Object.values(this.groups);
  private allGroupKeys = Object.keys(this.groups);

  constructor() {
    Object.freeze(this.groups);
  }

  getGroups() {
    return this.groups;
  }

  getAllGroups() {
    return Object.keys(this.groups);
  }

  getAllGroupsExcept(excludeGroup: string) {
    const allGroups = this.getAllGroups();
    const excludeGroupIndex = allGroups.indexOf(excludeGroup);
    allGroups.splice(excludeGroupIndex, 1);
    return allGroups
  }
}

const CreateType = new EntityCreateType();
export default CreateType;
