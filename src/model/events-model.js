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

  #adaptToClient = (event) => {
    const adaptedOffers = event.offers.map((offer) => {
      const adaptedOffer = {...offer,
        name: offer.id,
        text: offer.title
      };

      delete adaptedOffer['id'];
      delete adaptedOffer['title'];

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
      offers: adaptedOffers,
      destination: {
        place: event.destination.name,
        description: event.destination.description,
        images: event.destination.pictures
      }
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['type'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }
}
