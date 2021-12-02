import { createElement } from "../render";

const createEmptyMessageTemplate = () => ('<p class="trip-events__msg">Click New Event to create your first point</p>');

export default class NoEventsComponent {
  #element = null;

  get element() {
    if (this.#element === null) {
      this.#element = createElement(this.template);
    }
  }

  get template() {
    return createEmptyMessageTemplate();
  }

  removeElement() {
    this.#element = null
  }
}
