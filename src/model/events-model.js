import AbstractObservable from "../utils/abstract-observable";

export default class EventsModel extends AbstractObservable {
  #events = null;

  get events() {
    return Array.from(this.#events);
  }

  set events(value) {
    this.#events = new Set(value);
  }

  addEvent() {

  }

  updateEvent(sourceEvent, updatedEvent, updateType) {
    if (!this.#events.has(sourceEvent)) {
      throw new Error('This trip event object does not exist in the model');
    }

    const keysOfUpdatedEvent = Object.keys(updatedEvent);

    for (const key of keysOfUpdatedEvent) {
      if (key in sourceEvent) {
        sourceEvent[key] = updatedEvent[key];
      }
    }

    this._notify(updateType, sourceEvent);
  }

  deleteEvent() {

  }
}
