import { FilterTypes } from '../const';

import AbstractView from './abstract-view';

const noEventMessages = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PAST]: 'There are no past events now'
};

const createNoEventsTemplate = (text) => `<p class="trip-events__msg">${text}</p>`;

export default class NoEventsView extends AbstractView {
  #filterType = null;

  constructor(filterType = FilterTypes.EVERYTHING) {
    super();

    this.#filterType = filterType;
  }

  get template() {
    return createNoEventsTemplate(noEventMessages[this.#filterType] || noEventMessages[FilterTypes.EVERYTHING]);
  }
}
