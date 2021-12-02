import { createElement } from '../render';

const createEventListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class EventListComponent {
  #element = null;

  get element() {
    if (this.#element === null) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEventListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
