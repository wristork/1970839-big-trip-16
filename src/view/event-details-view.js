import AbstractView from './abstract-view';

import DestinationComponent from './destination-view';
import OffersComponent from './offers-view';

const createDetailsTemplate = (offers, destination, isDisabled) => {
  const offerSectionTemplate = (offers !== null && offers.length)
    ? new OffersComponent(offers, isDisabled).template
    : '';

  const destinationSectionTemplate = new DestinationComponent(destination).template;

  return `<section class="event__details">
    ${offerSectionTemplate}

    ${destinationSectionTemplate}
  </section>`;
};

export default class DetailsComponent extends AbstractView {
  #offers = null;
  #destination = null;
  #isDisabled = null;

  constructor(offers, destination, isDisabled) {
    super();

    this.#offers = offers;
    this.#destination = destination;
    this.#isDisabled = isDisabled;
  }

  get template() {
    return createDetailsTemplate(this.#offers, this.#destination, this.#isDisabled);
  }
}
