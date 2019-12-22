export function EventEmitter() {
  const observers = [];

  this.subscribe = observer => {
    if (typeof observer !== "function")
      throw "error => observer needs to be a function";

    observers.push(observer);
    return this;
  };

  this.emit = value => {
    observers.forEach(observer => observer(value));
    return this;
  };
}

export function EventManager(event_types = []) {
  const events = {};

  this.add = type => {
    if (events[type]) throw `error => type ${type} already added`;

    events[type] = new EventEmitter();
    return this;
  };

  this.listen = (type, handler) => {
    if (!events[type]) throw `error => type ${type} not exists`;

    events[type].subscribe(handler);
    return this;
  };

  this.dispatch = (type, data) => {
    if (!events[type]) throw `error => type ${type} not exists`;

    events[type].emit({
      type,
      data
    });
    return this;
  };

  event_types.forEach(type => this.add(type));
}
