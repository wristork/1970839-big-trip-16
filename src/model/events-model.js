import { UpdateType } from '../const';

import AbstractObservable from '../utils/abstract-observable';

export default class EventsModel extends AbstractObservable {
  #apiService = null

  #events = new Set();

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get events() {
    return Array.from(this.#events);
  }

  init = async () => {
    try {
      const events = await this.#apiService.events;
      this.#events = new Set(events.map(this.#adaptToClient));
    } catch(err) {
      this.#events = new Set();
    }

    this._notify(UpdateType.INIT);
  }

  addEvent = async (sourceEvent, newEvent, updateType) => {
    if (this.#events.has(sourceEvent)) {
      throw new Error('This trip event object already exist');
    }

    try {
      const response = await this.#apiService.addEvent(newEvent);
      this.#events.add(this.#adaptToClient(response));
      this._notify(updateType, newEvent);
    } catch(err) {
      throw new Error('Can\'t add new event.');
    }
  }

  updateEvent = async (sourceEvent, updatedEvent, updateType) => {
    if (!this.#events.has(sourceEvent)) {
      throw new Error('This trip event object does not exist in the model');
    }

    try {
      this.#updateEvent(sourceEvent, updatedEvent);

      const response = await this.#apiService.updateEvent(sourceEvent);

      this._notify(updateType, sourceEvent);

      return response;
    } catch(err) {
      throw new Error('Can\'t update event');
    }
  }

  deleteEvent = async (sourceEvent, updateType) => {
    if (!this.#events.has(sourceEvent)) {
      throw new Error('This trip event object does not exist in the model');
    }

    try {
      await this.#apiService.deleteEvent(sourceEvent);

      this.#events.delete(sourceEvent);

      this._notify(updateType, sourceEvent);
    } catch(err) {
      throw new Error('Can\'t delete event');
    }
  }

  #updateEvent = (target, donor) => {
    const keys = Object.keys(donor);

    for (const key of keys) {
      if (key in target) {
        target[key] = donor[key];
      }
    }
  }

  #adaptToClient = (event) => {
    const offers = [...event.offers].map((offer) => {
      const adaptedOffer = {...offer,
        isChecked: offer['is_checked'] || false
      };

      delete adaptedOffer['is_checked'];

      return adaptedOffer;
    });

    const adaptedEvent = {...event,
      price: event['base_price'],
      routeType: event['type'],
      date: {
        start: new Date(event['date_from']),
        end: new Date(event['date_to']),
      },
      isFavorite: event['is_favorite'],
      destination: {
        place: event.destination.name,
        description: event.destination.description,
        images: event.destination.pictures
      },
      offers: offers
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['type'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }
}
