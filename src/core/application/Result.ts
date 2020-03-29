

export class Result<T, E> {

  public readonly isSuccess: boolean;
  public readonly isFailure: boolean
  public readonly error: E;
  private _value: T;

  protected constructor (isSuccess: boolean, error?: E, value?: T) {
    if (isSuccess && error) {
      throw new Error("The successful result cannot have error");
    }
    if (!isSuccess && value) {
      throw new Error("The failed result cannot have value");
    }
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error!;
    this._value = value!;

    Object.freeze(this);
  }

  public getValue () : T {
    if (!this.isSuccess) {
      throw new Error(`Cant retrieve the value from a failed result.`)
    }

    return this._value;
  }

  public static ok<T> (value: T) : SuccessResult<T> {
    return SuccessResult.ok(value);
  }

  public static fail<E> (error: E): FailResult<E> {
    return FailResult.fail(error)
  }

  public static combine (results: Result<any, any>[]) : Result<any[], any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<any>(results.map(result => result.getValue()));
  }

  public static combineSame<T, E>(results: Result<T, E>[]): Result<T[], E> {
    return this.combine(results);
  }
}

export class SuccessResult<T> extends Result<T, null> {

  protected constructor(value: T) {
    super(true, undefined, value)
  }

  public static ok<T>(value: T): SuccessResult<T> {
    return new SuccessResult(value);
  }

  public static fail<E>(error: E): FailResult<E> {
    throw new Error("Cannot cal fail() method on SuccessResult type")
  }
}

export class FailResult<E> extends Result<null, E> {

  protected constructor(error: E) {
    super(false, error, null)
  }

  public static ok<T>(value: T): SuccessResult<T> {
    throw new Error("Cannot cal fail() method on ErrorResult type")
  }

  public static fail<E>(error: E): FailResult<E> {
    return new FailResult(error);
  }
}