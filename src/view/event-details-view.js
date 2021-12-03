import { createElement } from '../render';

import DestinationComponent from './destination-view';
import OffersComponent from './offers-view';

const createDetailsTemplate = (offers, destination) => {
  const offerSectionTemplate = (offers !== null && offers.length)
    ? new OffersComponent(offers).template
    : '';

  const destinationSectionTemplate = new DestinationComponent(destination).template;

  return `<section class="event__details">
    ${offerSectionTemplate}

    ${destinationSectionTemplate}
  </section>`;
};

export default class DetailsComponent {
  #element = null;
  #offers = null;
  #destination = null;

  constructor(offers, destination) {
    this.#offers = offers;
    this.#destination = destination;
  }

  get element() {
    if (this.#element === null) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createDetailsTemplate(this.#offers, this.#destination);
  }

  removeElement() {
    this.#element = null;
  }
}
