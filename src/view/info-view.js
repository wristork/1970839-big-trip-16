import dayjs from 'dayjs';
import { getFormattedDate } from '../utils/date';
import AbstractView from './abstract-view';

const isSameMonth = (dateA, dateB) => {
  const monthA = dayjs(dateA).month();
  const monthB = dayjs(dateB).month();

  return monthA === monthB;
};

const calcCost = (events) => {
  const mainCost = events.map((event) => event.price).reduce((acc, value) => Number(acc) + Number(value), 0);

  const offersCost = events.map((event) => {
    if (event.offers === null) {
      return 0;
    }

    const checkedOffers = event.offers.filter((offer) => offer.isChecked);

    return checkedOffers.map((offer) => offer.price).reduce((acc, value) => Number(acc) + Number(value), 0);
  }).reduce((acc, value) => Number(acc) + Number(value), 0);

  return mainCost + offersCost;
};

const getTripPath = (events) => {
  const places = events.map((event) => event.destination.place);
  const uniquePlaces = Array.from(new Set(places));

  const path = uniquePlaces.length > 3
    ? `${places[0]} &mdash; ... &mdash; ${places[places.length - 1]}`
    : uniquePlaces.join(' &mdash; ');

  return path;
};

const createTripInfoTemplate = (events) => {
  const startDate = events.length ? events[0].date.start : new Date();
  const endDate = events.length ? events[events.length - 1].date.end : new Date();

  const startDateFormatted = getFormattedDate(startDate, 'MMM DD');

  const endDateFormatted = isSameMonth(startDate, endDate)
    ? getFormattedDate(endDate, 'DD')
    : getFormattedDate(endDate, 'MMM DD');

  const path = getTripPath(events);
  const totalCost = calcCost(events);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${path}</h1>

      <p class="trip-info__dates">${startDateFormatted}&nbsp;&mdash;&nbsp;${endDateFormatted}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
    </p>
  </section>`;
};

export default class InfoView extends AbstractView {
  #events = [];

  get template() {
    return createTripInfoTemplate(this.#events);
  }

  get events() {
    return this.#events;
  }

  set events(value) {
    this.#events = value;
  }
}
