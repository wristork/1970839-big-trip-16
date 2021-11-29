import dayjs from 'dayjs';
import { ROUTES, DESTINATIONS } from '../const';
import { generateDescription, generateImages } from '../mock/destination';
import { generateOffers } from '../mock/offers';
import { getFormattedDate } from '../utils';

const createRoutesTemplate = () => {
  const routes = ROUTES;

  return Array.from(routes, (route) => {
    const routeLower = route.toLowerCase();

    return `<div class="event__type-item">
      <input id="event-type-${routeLower}-1" 
        class="event__type-input  visually-hidden" 
        type="radio" name="event-type" 
        value="${routeLower}">
      <label class="event__type-label  event__type-label--${routeLower}" for="event-type-${routeLower}-1">${route}</label>
    </div>`;
  }).join('');
};

const createOffersTemplate = (offers) => (
  Array.from(offers, (offer, index) => {
    const name = offer.name;
    const text = offer.text;
    const price = offer.price;

    const nameId = `${name}-${index + 1}`;

    const checked = offer.isChecked ? 'checked' : '';

    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${nameId}" type="checkbox" name="event-offer-${name}" ${checked}>
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

const createDestinationOptionsTemplate = (destinations) => (
  Array.from(destinations, (destination) => (`<option value="${destination}"></option>`)).join('')
);

const createDestinationSectionTemplate = ({description, images}) => {

  const imagesTemplate = (images && images.length)
    ? Array.from(images, (imageSrc) => (`<img class="event__photo" src="${imageSrc}" alt="Event photo">`)).join('')
    : '';

  const photosContainerTemplate = (images && images.length)
    ? `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${imagesTemplate}
      </div>
    </div>`
    : '';

  const isHaveDescription = Boolean(description);
  const isHavePhotos = Boolean(photosContainerTemplate);

  return (isHaveDescription || isHavePhotos)
    ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      ${photosContainerTemplate}
    </section>`
    : '';
};

const createDetailsTemplate = (offers, destination) => {
  const offerSectionTemplate = (offers !== null && offers.length)
    ? createOfferSectionTemplate(offers)
    : '';

  const destinationSectionTemplate = createDestinationSectionTemplate(destination);

  return `<section class="event__details">
    ${offerSectionTemplate}

    ${destinationSectionTemplate}
  </section>`;
};

export const createEditEventTemplate = (event = {}) => {
  const {
    date = {
      start: dayjs().toDate(),
      end: dayjs().add(1, 'day').toDate()
    },
    routeType = ROUTES[0],
    destination = {
      place: DESTINATIONS[0],
      description: generateDescription(),
      images: generateImages()
    },
    price = '',
    offers = generateOffers(),
  } = event;

  const iconName = routeType.toLowerCase();
  const routesTemplate = createRoutesTemplate();

  const destinationOptionsTemplate = createDestinationOptionsTemplate(DESTINATIONS);

  const isHaveDescription = Boolean(destination.description);
  const isHaveImages = Boolean(destination.images && destination.images.length);
  const isHaveOffers = Boolean(offers !== null && offers.length);

  const detailsTemplate = (isHaveDescription || isHaveImages || isHaveOffers)
    ? createDetailsTemplate(offers, destination)
    : '';

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${iconName}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${routesTemplate}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${routeType}
          </label>
          <input class="event__input  event__input--destination" 
            id="event-destination-1" type="text" 
            name="event-destination" 
            value="${destination.place}" 
            list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationOptionsTemplate}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" 
            id="event-start-time-1" type="text" 
            name="event-start-time" 
            value="${getFormattedDate(date.start, 'DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" 
            id="event-end-time-1" type="text" 
            name="event-end-time" 
            value="${getFormattedDate(date.end, 'DD/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      ${detailsTemplate}
    </form>
  </li>`;
};
