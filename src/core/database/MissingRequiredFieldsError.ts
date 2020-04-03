import { DatabaseError } from ".";

export default class MissingRequiredFieldsError extends DatabaseError {

  private fields: string[];

  constructor(fields: string[]) {
    super("MISSING_REQUIRED_FIELDS");
    this.fields = fields;
  }

  get missingFields() {
    return this.fields;
  }
}