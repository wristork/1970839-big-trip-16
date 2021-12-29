import AbstractObservable from "../utils/abstract-observable";

export default class EventsModel extends AbstractObservable {
  #events = null;

  get events() {
    return Array.from(this.#events);
  }

  set events(value) {
    this.#events = new Set(value);
  }

  updateEvent() {

  }

  deleteEvent() {
    
  }
}
