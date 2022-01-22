import { createElement } from '../render';

export default class AbstractView {
  #element = null;

  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`Can't create instance of the abstract class: ${this.constructor.name}`);
    }
  }

  get element() {
    if (this.#element === null) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error(`The getter "template" should be overwritten in inheritor class: ${this.constructor.name}`);
  }

  removeElement() {
    this.#element = null;
  }
}
