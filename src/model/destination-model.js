import { UpdateType } from '../const';

import AbstractObservable from '../utils/abstract-observable';

export default class DestinationsModel extends AbstractObservable {
  #apiService = null

  #destinations = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get destinations() {
    return [...this.#destinations];
  }

  init = async () => {
    try {
      const destinations = await this.#apiService.destinations;
      this.#destinations = new Set(destinations.map(this.#adaptToClient));
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

  #adaptToClient = (destination) => {
    const adaptedDestination = {...destination,
      place: destination.name,
      images: destination.pictures
    };

    delete adaptedDestination['name'];
    delete adaptedDestination['pictures'];

    return adaptedDestination;
  }
}
