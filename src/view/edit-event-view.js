import flatpickr from 'flatpickr';
import he from 'he';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import '../../node_modules/flatpickr/dist/themes/material_blue.css';

import SmartView from './smart-view';
import DetailsView from './event-details-view';

import { getFormattedDate } from '../utils/date';

const createRoutesTemplate = (offerTypes) => (
  offerTypes.map((type) => {
    const typeLowerCase = type.toLowerCase();

    return `<div class="event__type-item">
      <input id="event-type-${typeLowerCase}-1"
        class="event__type-input  visually-hidden"
        type="radio" name="event-type"
        value="${type}">
      <label
        class="event__type-label  event__type-label--${typeLowerCase}"
        for="event-type-${typeLowerCase}-1"
      >
        ${type[0].toUpperCase() + type.slice(1)}
      </label>
    </div>`;
  }).join('')
);

const createDestinationOptionsTemplate = (destinations) => (
  destinations.map((destination) => (`<option value="${destination}"></option>`)).join('')
);

const createEditEventTemplate = (data, destinations, offerTypes) => {
  const {
    date,
    routeType,
    destination,
    price,
    offers,
    isHaveDescription,
    isHaveImages,
    isHaveOffers,
    isBlank,
    isSaving,
    isDeleting,
    isDisabled
  } = data;

  const detailsTemplate = (isHaveDescription || isHaveImages || isHaveOffers)
    ? new DetailsView(offers, destination, isDisabled).template
    : '';

  const deleteText = isDeleting ? 'Deleting...' : 'Delete';
  const resetButtonText = isBlank ? 'Cancel' : deleteText;

  const rollupButtonTemplate = isBlank
    ? ''
    : `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${routeType.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${createRoutesTemplate(offerTypes)}
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
            list="destination-list-1"
            ${isDisabled ? 'disabled' : ''}
          >
          <datalist id="destination-list-1">
            ${createDestinationOptionsTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time"
            id="event-start-time-1" type="text"
            name="event-start-time"
            value="${getFormattedDate(date.start, 'DD/MM/YY HH:mm')}"
            ${isDisabled ? 'disabled' : ''}
          >
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time"
            id="event-end-time-1" type="text"
            name="event-end-time"
            value="${getFormattedDate(date.end, 'DD/MM/YY HH:mm')}"
            ${isDisabled ? 'disabled' : ''}
          >
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input  event__input--price"
            id="event-price-1"
            type="text"
            name="event-price"
            value="${price}"
            ${isDisabled ? 'disabled' : ''}
          >
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${resetButtonText}</button>
        ${rollupButtonTemplate}
      </header>
      ${detailsTemplate}
    </form>
  </li>`;
};

export default class EditEventView extends SmartView {
  #callbacks = {};
  #startDatePicker = null;
  #endDatePicker = null;

  #saveButtonElement = null;
  #destinations = null;
  #offers = null

  constructor(event, destinations = [], offers = []) {
    super();

    this.#destinations = new Map(destinations.map((destination) => [destination.place, destination]));
    this.#offers = new Map(offers.map((offer) => [offer.type, offer]));

    this._data = EditEventView.parseEventToData(event);
    this.#saveButtonElement = this.element.querySelector('.event__save-btn');

    this.#setInnerHandlers();
  }

  get template() {
    return createEditEventTemplate(this._data, Array.from(this.#destinations.keys()), Array.from(this.#offers.keys()));
  }

  addNormalStateClickHandler(cb) {
    if (this.#callbacks.changeStateToNormal === undefined) {
      this.#callbacks.changeStateToNormal = cb;
    }

    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#onClickToChangeViewMode);
  }

  addFormSubmitHandler(cb) {
    if (this.#callbacks.formSubmit === undefined) {
      this.#callbacks.formSubmit = cb;
    }

    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);
  }

  addResetButtonClickHandler(cb) {
    if (this.#callbacks.resetButtonClick === undefined) {
      this.#callbacks.resetButtonClick = cb;
    }

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onClickResetButton);
  }

  removeElement() {
    super.removeElement();
  }

  restoreHandlers() {
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#onClickToChangeViewMode);
    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onClickResetButton);

    this.#setInnerHandlers();
  }

  resetState(event) {
    this.updateData(EditEventView.parseEventToData(event));
  }

  setDatePicker() {
    this.#initDatePicker();
  }

  removeDatePicker() {
    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }

    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  }

  shake() {
    this.element.classList.toggle('shake');
  }

  updateElement() {
    super.updateElement();

    this.removeDatePicker();
    this.setDatePicker();

    this.#saveButtonElement = this.element.querySelector('.event__save-btn');
  }

  #initDatePicker = () => {
    const startDatePicker = this.element.querySelector('#event-start-time-1');
    const endDatePicker = this.element.querySelector('#event-end-time-1');

    const commonConfig = {
      dateFormat: 'd/m/Y H:i',
      enableTime: true,
      ['time_24hr']: true,
    };

    this.#startDatePicker = flatpickr(startDatePicker, {...commonConfig,
      onChange: (selectedDates) => {
        this.updateData(
          {
            date: {
              start: selectedDates[0],
              end: this._data.date.end,
            }
          },
          true,
        );

        this.#endDatePicker.set('minDate', selectedDates[0]);
      }
    });

    this.#startDatePicker.setDate(this._data.date.start, false);

    this.#endDatePicker = flatpickr(endDatePicker, {...commonConfig,
      minDate: this._data.date.start,
      onChange: (selectedDates) => {
        this.updateData(
          {
            date: {
              start: this._data.date.start,
              end: selectedDates[0],
            }
          },
          true,
        );
      }
    });

    this.#endDatePicker.setDate(this._data.date.end, false);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('click', this.#onChangeEventType);
    this.element.querySelector('.event__field-group--destination').addEventListener('input', this.#onChangeDestination);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onInputPrice);

    const offerContainer = this.element.querySelector('.event__available-offers');

    if (offerContainer) {
      offerContainer.addEventListener('click', this.#onOfferClick);
    }
  }

  #onClickToChangeViewMode = () => {
    this.#callbacks.changeStateToNormal();
  }

  #onFormSubmit = (evt) => {
    evt.preventDefault();

    this.#callbacks.formSubmit(EditEventView.parseDataToEvent(this._data));
  };

  #onClickResetButton = () => {
    if (typeof this.#callbacks.resetButtonClick === 'function') {
      this.#callbacks.resetButtonClick();
    }
  }

  #onInputPrice = (evt) => {
    const { target } = evt;

    if (evt.data && /\D+/.test(evt.data)) {
      target.value = target.value.slice(0, target.value.length - 1);
    }

    if (evt.data && target.value.length) {
      target.value = parseInt(target.value, 10);
    }

    this.updateData({ price: target.value }, true);

    this.#activeSaveButtuon(target);

    if (Number(target.value) === 0) {
      this.#disableSaveButton(target);
    }
  };

  #onChangeDestination = (evt) => {
    const { target } = evt;

    if (target.tagName !== 'INPUT') {
      return;
    }

    this.#activeSaveButtuon(target);

    if (!~Array.from(this.#destinations.keys()).indexOf(target.value)) {
      target.value = '';
      this.#disableSaveButton(target);
    } else {
      this.updateData({ destination: this.#destinations.get(target.value) });
    }
  };

  #disableSaveButton = (element) => {
    if (element) {
      element.style.outlineColor = 'red';
      element.style.border = '1px solid orangered';
    }

    this.#saveButtonElement.setAttribute('disabled', '');
  }

  #activeSaveButtuon = (element) => {
    element.style = null;

    this.#saveButtonElement.removeAttribute('disabled');
  }

  #onChangeEventType = (evt) => {
    const { target } = evt;

    if (target.tagName !== 'INPUT') {
      return;
    }

    const offers = this.#offers.get(target.value.toLowerCase()).offers;
    offers.forEach((offer) => {
      offer.isChecked = false;
    });

    this.updateData({
      routeType: target.value,
      offers: offers
    });
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

  static parseEventToData = (event) => {
    const offers = event.offers ? [...event.offers].map((offer) => ({...offer})) : event.offers;

    return (
      {...event,
        offers: offers,
        isHaveDescription: Boolean(event.destination.description),
        isHaveImages: Boolean(event.destination.images && event.destination.images.length),
        isHaveOffers: Boolean(event.offers !== null && event.offers.length),
        isSaving: false,
        isDeleting: false,
        isDisabled: false,
      }
    );
  };

  static parseDataToEvent = (data) => {
    const event = {...data};
    event.price = Number(parseInt(he.encode(String(event.price)), 10));
    event.destination.place = he.encode(event.destination.place);

    if (!event.isHaveDescription) {
      event.destination.description = '';
    }

    if (!event.isHaveImages) {
      event.destination.images = [];
    }

    if (!event.isHaveOffers) {
      event.offers = [];
    }

    if ('isBlank' in event) {
      delete event.isBlank;
    }

    delete event.isHaveDescription;
    delete event.isHaveImages;
    delete event.isHaveOffers;
    delete event.isSaving;
    delete event.isDeleting;
    delete event.isDisabled;

    return event;
  };
}
