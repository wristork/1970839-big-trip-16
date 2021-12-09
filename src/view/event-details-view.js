import AbstractView from './abstract-view';

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

export default class DetailsComponent extends AbstractView {
  #offers = null;
  #destination = null;

  constructor(offers, destination) {
    super();

    this.#offers = offers;
    this.#destination = destination;
  }

  get template() {
    return createDetailsTemplate(this.#offers, this.#destination);
  }
}
