import AbstractObservable from '../utils/abstract-observable';

export default class EventsModel extends AbstractObservable {
  #events = null;

  get events() {
    return Array.from(this.#events);
  }

  set events(value) {
    this.#events = new Set(value);
  }

  addEvent(sourceEvent, event, updateType) {
    if (this.#events.has(sourceEvent)) {
      throw new Error('This trip event object already exist');
    }

    this.#events.add(event);

    this._notify(updateType, event);
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

  deleteEvent(sourceEvent, updateType) {
    if (!this.#events.has(sourceEvent)) {
      throw new Error('This trip event object does not exist in the model');
    }

    this.#events.delete(sourceEvent);

    this._notify(updateType, sourceEvent);
  }
}
