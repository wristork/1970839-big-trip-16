import AbstractView from './abstract-view';

const createOffersTemplate = (offers) => (
  Array.from(offers, (offer, index) => {
    const name = offer.name;
    const text = offer.text;
    const price = offer.price;

    const nameId = `${name}-${index + 1}`;

    const checked = offer.isChecked ? 'checked' : '';

    return `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${nameId}"
        type="checkbox"
        name="event-offer-${name}"
        data-index="${index}"
        ${checked}
      >
      <label class="event__offer-label" for="event-offer-${nameId}">
        <span class="event__offer-title">${text}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`;
  }).join('')
);

const createOfferSectionTemplate = (offers) => {
  const offersTemplate = createOffersTemplate(offers);

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offersTemplate}
    </div>
  </section>`;
};

export default class OffersComponent extends AbstractView {
  #offers = null;

  constructor(offers) {
    super();

    this.#offers = offers;
  }

  get template() {
    return createOfferSectionTemplate(this.#offers);
  }
}
