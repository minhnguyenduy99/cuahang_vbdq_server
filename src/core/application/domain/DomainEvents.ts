import IDomainEvent from "./IDomainEvent";
import AggregateRoot from "./AggrerateRoot";
import UniqueEntityID from "./UniqueEntityID";

type EventCallback = (event: IDomainEvent) => void;

export default class DomainEvents {
  private static handlersMap: { [eventName: string]: EventCallback[] } = {};
  private static markedAggregates: AggregateRoot<any>[] = [];

  /**
   * @static
   * @desc Called by aggregate root objects that have created domain
   * events to eventually be dispatched when the infrastructure commits
   * the unit of work. 
   */

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.entityId);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  /**
   * @static
   * @private 
   * @desc Call all of the handlers for any domain events on this aggregate.
   */

  private static dispatchAggregateEvents (aggregate: AggregateRoot<any>): void {
    aggregate.domainEvents.forEach((event: IDomainEvent) => this.dispatch(event));
  }

  /**
   * @method removeAggregateFromMarkedDispatchList
   * @static
   * @desc Removes an aggregate from the marked list.
   */

  private static removeAggregateFromMarkedDispatchList (aggregate: AggregateRoot<any>): void {
    const index = this.markedAggregates
      .findIndex((a) => a.equals(aggregate));

    this.markedAggregates.splice(index, 1);
  }

  /**
   * @method findMarkedAggregateByID
   * @static
   * @desc Finds an aggregate within the list of marked aggregates.
   */

  private static findMarkedAggregateByID (id: UniqueEntityID): AggregateRoot<any> {
    let found: AggregateRoot<any> = null;
    for (let aggregate of this.markedAggregates) {
      if (aggregate.entityId.equals(id)) {
        found = aggregate;
      }
    }

    return found;
  }

  /**
   * @static
   * @desc When all we know is the ID of the aggregate, call this
   * in order to dispatch any handlers subscribed to events on the
   * aggregate.
   */

  public static dispatchEventsForAggregate (id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  /**
   * @static
   * @desc Register a handler to a domain event.
   */

  public static register(
    callback: EventCallback,
    eventClassName: string
  ): void {

    if (!this.handlersMap[eventClassName]) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(callback);
  }

  /**
   * @method clearHandlers
   * @static
   * @desc Useful for testing.
   */

  public static clearHandlers(): void {
    this.handlersMap = {};
  }

  /**
   * @method clearMarkedAggregates
   * @static
   * @desc Useful for testing.
   */

  public static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }

  /**
   * @method dispatch
   * @static
   * @desc Invokes all of the subscribers to a particular domain event.
   */

  public static dispatch (event: IDomainEvent): void {
    const eventClassName: string = event.constructor.name;

    if (this.handlersMap[eventClassName]) {
      const handlers: EventCallback[] = this.handlersMap[eventClassName];
      for (let handler of handlers) {
        handler(event);
      }
    }
    this.handlersMap[eventClassName] = [];
  }
}