import AbstractView from './abstract-view';

const createOffersTemplate = (offers, isDisabled) => (
  Array.from(offers, (offer, index) => {
    const id = offer.id;
    const text = offer.title;
    const price = offer.price;

    const checked = offer.isChecked ? 'checked' : '';

    return `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${id}"
        type="checkbox"
        name="event-offer-${id}"
        data-index="${index}"
        ${checked}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="event__offer-label" for="event-offer-${id}">
        <span class="event__offer-title">${text}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;
  }).join('')
);

const createOfferSectionTemplate = (offers, isDisabled) => {
  const offersTemplate = createOffersTemplate(offers, isDisabled);

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offersTemplate}
    </div>
  </section>`;
};

export default class OffersComponent extends AbstractView {
  #offers = null;
  #isDisabled = null;

  constructor(offers, isDisabled) {
    super();

    this.#offers = offers;
    this.#isDisabled = isDisabled;
  }

  get template() {
    return createOfferSectionTemplate(this.#offers, this.#isDisabled);
  }
}
