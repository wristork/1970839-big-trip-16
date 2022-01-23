import AbstractView from './abstract-view';
import DestinationView from './destination-view';
import OffersView from './offers-view';

const createDetailsTemplate = (offers, destination, isDisabled) => {
  const offersTemplate = (offers !== null && offers.length)
    ? new OffersView(offers, isDisabled).template
    : '';

  return `<section class="event__details">
    ${offersTemplate}

    ${new DestinationView(destination).template}
  </section>`;
};

export default class DetailsView extends AbstractView {
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
