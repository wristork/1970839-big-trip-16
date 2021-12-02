import { createElement } from '../render';

const createControlsMainTemplate = () => '<div class="trip-main__trip-controls  trip-controls"></div>';

export default class ControlsMainComponent {
  #element = null;

  get element() {
    if (this.#element === null) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createControlsMainTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
