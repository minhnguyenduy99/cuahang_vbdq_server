import Entity from "./Entity";
import IDomainEvent from "./IDomainEvent";
import DomainEvents from "./DomainEvents";

export default abstract class AggrerateRoot<T> extends Entity<T> {
  // A list of domain events that occurred on this aggregate
  // so far.
  private _domainEvents: IDomainEvent[] = [];

  constructor(props: T) {
    super(props);
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent (domainEvent: IDomainEvent): void {
    // Add the domain event to this aggregate's list of domain events
    this._domainEvents.push(domainEvent);
    
    // Add this aggregate instance to the DomainEventHandler's list of
    // 'dirtied' aggregates 
    DomainEvents.markAggregateForDispatch(this);
  }

  public clearEvents (): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }
}

