export default interface IRoleRepository {
  createResourceAccess(userId: string, resource: string, resourceIds: string[] | "*"): Promise<void>;

  updateResource(userId: string, oldResourceId: string, newResourceId: string): Promise<void>;

  doesUserHasAccessResource(userId: string, resourceId: string): Promise<boolean>;

  findAccessResource(userId: string, resource: string): Promise<string[] | "*">;
}