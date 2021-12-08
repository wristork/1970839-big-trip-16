import dayjs from 'dayjs';

import AbstractView from './abstract-view';

import { getFormattedDate } from '../utils';

const getEventDuration = (startDate, endDate) => {
  startDate = dayjs(startDate);
  endDate = dayjs(endDate);

  const dayDiff = endDate.diff(startDate, 'day');
  const hourDiff = endDate.diff(startDate, 'hour');
  const minuteDiff = endDate.diff(startDate, 'minute');

  const day = String(dayDiff).padStart(2, '0');
  const hour = String(hourDiff - (dayDiff * 24)).padStart(2, '0');
  const minute = String(minuteDiff - (hourDiff * 60)).padStart(2, '0');

  if (dayDiff) {
    return `${day}D ${hour}H ${minute}M`;
  } else if (hourDiff) {
    return `${hour}H ${minute}M`;
  } else {
    return `${minute}M`;
  }
};

const createOffersTemplate = (offers) => (
  offers.map(({text, price}) => (
    `<li class="event__offer">
      <span class="event__offer-title">${text}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`
  )).join('')
);

const createEventTemplate = (event = {}) => {
  const {
    date,
    routeType,
    destination,
    price,
    offers,
    isFavorite
  } = event;

  const offersTemplate = offers
    ? createOffersTemplate(offers.filter((offer) => offer.isChecked))
    : '';

  const duration = getEventDuration(date.start, date.end);

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${getFormattedDate(date.start, 'YYYY-MM-DD')}">${getFormattedDate(date.start, 'MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${routeType.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${routeType} ${destination.place}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time
            class="event__start-time"
            datetime="${getFormattedDate(date.start, 'YYYY-MM-DDTHH:mm')}">
            ${getFormattedDate(date.start, 'HH:mm')}
          </time>
          &mdash;
          <time
            class="event__end-time"
            datetime="${getFormattedDate(date.end, 'YYYY-MM-DDTHH:mm')}">
            ${getFormattedDate(date.end, 'HH:mm')}
          </time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersTemplate}
      </ul>
      <button class="${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class EventComponent extends AbstractView {
  #events = null;
  #callbacks = {};

  constructor(events) {
    super();

    this.#events = events;
  }

  get template() {
    return createEventTemplate(this.#events);
  }

  addEditStateClickHandler(cb) {
    if (this.#callbacks['click'] === undefined) {
      this.#callbacks['click'] = cb;
    }

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickEditButtonHandler);
  }

  removeElement() {
    super.removeElement();

    this.#callbacks = {};
  }

  #clickEditButtonHandler = () => {
    this.#callbacks['click']();
  }
}
