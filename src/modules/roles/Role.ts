import { Entity, SuccessResult, FailResult } from "@core";
import RoleProps from "./RoleProps";
import { classToPlain, plainToClass } from "class-transformer";
import RoleDTO from "./shared/RoleDTO";
import { validate } from "class-validator";

export default class Role extends Entity<RoleProps> {

  protected roles: string[];

  constructor(props: RoleProps) {
    super(props);

    this.roles = props.roles.split(',');
  }

  get Roles() {
    return this.roles;
  }
  
  serialize(type?: string) {
    this.props.roles = this.roles.reduce((pre, cur) => pre + ',' + cur)
    return classToPlain(this.props);
  }

  addRoles(...roles: string[]) {
    this.roles.push(...roles);
  }

  public static async create(roleDTO: RoleDTO) {
    const roleProps = plainToClass(RoleProps, roleDTO);
    const errors = await validate(roleProps);
    if (errors.length === 0) {
      return SuccessResult.ok(new Role(roleProps));
    }
    return FailResult.fail(errors);
  }
}