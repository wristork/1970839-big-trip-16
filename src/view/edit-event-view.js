import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/material_blue.css';

import SmartView from './smart-view';
import DetailsComponent from './event-details-view';

import { ROUTES, DESTINATIONS } from '../const';
import { generateDescription, generateDestination, generateImages } from '../mock/destination';
import { generateOffers } from '../mock/offers';
import { getFormattedDate } from '../utils/date';

const createRoutesTemplate = () => (
  Array.from(ROUTES, (route) => {
    const routeLower = route.toLowerCase();

    return `<div class="event__type-item">
      <input id="event-type-${routeLower}-1"
        class="event__type-input  visually-hidden"
        type="radio" name="event-type"
        value="${route}">
      <label class="event__type-label  event__type-label--${routeLower}" for="event-type-${routeLower}-1">${route}</label>
    </div>`;
  }).join('')
);

const createDestinationOptionsTemplate = (destinations) => (
  Array.from(destinations, (destination) => (`<option value="${destination}"></option>`)).join('')
);

const createEditEventTemplate = (data) => {
  const {
    date,
    routeType,
    destination,
    price,
    offers,
    isHaveDescription,
    isHaveImages,
    isHaveOffers
  } = data;

  const iconName = routeType.toLowerCase();
  const routesTemplate = createRoutesTemplate();
  const destinationOptionsTemplate = createDestinationOptionsTemplate(DESTINATIONS);

  const detailsTemplate = (isHaveDescription || isHaveImages || isHaveOffers)
    ? new DetailsComponent(offers, destination).template
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

const BLANK_EVENT = {
  date: {
    start: dayjs().toDate(),
    end: dayjs().add(1, 'day').toDate()
  },
  routeType: ROUTES[0],
  destination:  {
    place: DESTINATIONS[0],
    description: generateDescription(),
    images: generateImages()
  },
  price: '',
  offers: generateOffers(ROUTES[0])
};

export default class EditEventComponent extends SmartView {
  #callbacks = {};
  #startDatePicker = null;
  #endDatePicker = null;

  constructor(event = BLANK_EVENT) {
    super();

    this._data = EditEventComponent.parseEventToData(event);

    this.#setInnerHandlers();
  }

  get template() {
    return createEditEventTemplate(this._data);
  }

  addNormalStateClickHandler(cb) {
    if (this.#callbacks['click'] === undefined) {
      this.#callbacks['click'] = cb;
    }

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onClickToChangeViewMode);
  }

  addFormSubmitHandler(cb) {
    if (this.#callbacks['submit'] === undefined) {
      this.#callbacks['submit'] = cb;
    }

    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);
  }

  removeElement() {
    super.removeElement();
  }

  restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onClickToChangeViewMode);
    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);

    this.#setInnerHandlers();
  }

  resetState(event) {
    this._data = EditEventComponent.parseEventToData(event);

    this.updateElement();
  }

  setDatePicker() {
    this.#initDatePicker();
  }

  removeDatePicker() {
    this.#startDatePicker.destroy();
    this.#endDatePicker.destroy();

    this.#startDatePicker = null;
    this.#endDatePicker = null;
  }

  #initDatePicker = () => {
    const startDatePicker = this.element.querySelector('#event-start-time-1');
    const endDatePicker = this.element.querySelector('#event-end-time-1');

    const commonConfig = {
      dateFormat: 'd/m/Y H:i',
      enableTime: true,
      ['time_24hr']: true
    };

    this.#startDatePicker = flatpickr(startDatePicker, {...commonConfig,
      onChange: (selectedDates) => {
        this.updateData({date: {
          start: selectedDates[0],
          end: this._data.date.end
        }}, true);

        this.#endDatePicker.set('minDate', selectedDates[0]);
      }
    });

    this.#endDatePicker = flatpickr(endDatePicker, {...commonConfig,
      minDate: this._data.date.start,
      onChange: (selectedDates) => {
        this.updateData({date: {
          start: this._data.date.start,
          end: selectedDates[0]
        }}, true);
      }
    });
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#onChangeEventType);
    this.element.querySelector('.event__field-group--destination').addEventListener('change', this.#onChangeDestination);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onInputPrice);

    const offerContainer = this.element.querySelector('.event__available-offers');

    if (offerContainer) {
      offerContainer.addEventListener('click', this.#onOfferClick);
    }
  }

  #onClickToChangeViewMode = () => {
    this.#callbacks['click']();
  }

  #onFormSubmit = (evt) => {
    evt.preventDefault();

    this.#callbacks['submit'](EditEventComponent.parseDataToEvent(this._data));
  };

  #onInputPrice = (evt) => {
    const { target } = evt;

    if (evt.data && /\D+/.test(evt.data)) {
      target.value = target.value.slice(0, target.value.length - 1);
    }

    if (evt.data && target.value.length) {
      target.value = parseInt(target.value, 10);
    }

    this.updateData({ price: target.value }, true);
  };

  #onChangeDestination = (evt) => {
    const { target } = evt;

    if (target.tagName !== 'INPUT') {
      return;
    }

    if (!~DESTINATIONS.indexOf(target.value)) {
      target.value = '';
      target.style.outlineColor = 'red';
      target.style.border = '1px solid orangered';
    } else {
      target.style = null;

      this.updateData({ destination: generateDestination(target.value) });
    }
  };

  #onChangeEventType = (evt) => {
    const { target } = evt;

    if (target.tagName !== 'INPUT') {
      return;
    }

    const offers = generateOffers(target.value);
    offers.forEach((offer) => {
      offer.isChecked = false;
    });

    this.updateData({
      routeType: target.value,
      offers: offers
    });

    if (typeof this.#callbacks.clickEventType === 'function') {
      this.#callbacks.clickEventType();
    }
  };

  #onOfferClick = (evt) => {
    const { target } = evt;

    if (target.tagName !== 'INPUT') {
      return;
    }

    if (target.hasAttribute('checked')) {
      target.removeAttribute('checked');
    } else {
      target.setAttribute('checked', '');
    }

    const offers = [...this._data.offers];
    offers[target.dataset.index].isChecked = target.checked;

    this.updateData({offers}, true);
  }

  static parseEventToData = (event) => ({
    ...event,
    offers: [...event.offers].map((offer) => ({...offer})),
    isHaveDescription: Boolean(event.destination.description),
    isHaveImages: Boolean(event.destination.images && event.destination.images.length),
    isHaveOffers: Boolean(event.offers !== null && event.offers.length)
  });

  static parseDataToEvent = (data) => {
    const event = {...data};

    if (!event.isHaveDescription) {
      event.destination.description = null;
    }

    if (!event.isHaveImages) {
      event.destination.images = null;
    }

    if (!event.isHaveOffers) {
      event.offers = null;
    }

    delete event.isHaveDescription;
    delete event.isHaveImages;
    delete event.isHaveOffers;

    return event;
  };
}
