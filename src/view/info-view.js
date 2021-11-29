import { getFormattedDate, isSameMonth } from '../utils';

const calcCost = (events) => {
  const mainCost = events.map((event) => event.price).reduce((acc, value) => acc + value, 0);

  const offersCost = events.map((event) => {
    if (event.offers === null) {
      return 0;
    }

    const checkedOffers = event.offers.filter((offer) => offer.isChecked);

    return checkedOffers.map((offer) => offer.price).reduce((acc, value) => acc + value, 0);
  }).reduce((acc, value) => acc + value, 0);

  return mainCost + offersCost;
};

const getTripPath = (events) => {
  const places = events.map((event) => event.destination.place);
  const uniquePlaces = new Set(places);

  const path = uniquePlaces.size > 3
    ? `${places[0]} &mdash; ... &mdash; ${places[places.length - 1]}`
    : Array.from(uniquePlaces).join( ' &mdash; ');

  return path;
};

export const createTripInfoTemplate = (events) => {
  const startDate = events[0].date.start;
  const endDate = events[events.length - 1].date.end;

  const startDateFormatted = getFormattedDate(startDate, 'MMM DD');
  const endDateFormatted = (isSameMonth(startDate, endDate))
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
