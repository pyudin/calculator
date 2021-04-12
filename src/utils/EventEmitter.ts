export class EventEmitter {
  _events: any;
  constructor() {
    this._events = {};
  }

  on(name: string, listener: Function) {
    if (!this._events[name]) {
      this._events[name] = [];
    }

    this._events[name].push(listener);
  }

  removeListener(name: string, listenerToRemove: Function) {
    if (!this._events[name]) {
      throw new Error(
        `Can't remove a listener. Event "${name}" doesn't exits.`
      );
    }

    this._events[name] = this._events[name].filter(
      (listener: Function) => listener !== listenerToRemove
    );
  }

  emit(name: string, data: any) {
    if (!this._events[name]) {
      throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`);
    }

    this._events[name].forEach((callback: Function) => {
      callback(data);
    });
  }
}
