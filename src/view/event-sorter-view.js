import AbstractView from './abstract-view';

const createEventSorterTemplate = () => (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" checked>
    <label class="trip-sort__btn" for="sort-day">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" for="sort-event">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">
    <label class="trip-sort__btn" for="sort-time">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price">
    <label class="trip-sort__btn" for="sort-price">Price</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn" for="sort-offer">Offers</label>
  </div>
</form>`);

export default class EventSorterView extends AbstractView {
  #callbacks = {};

  get template() {
    return createEventSorterTemplate();
  }

  addChangeSortTypeHandler(cb) {
    this.#callbacks.changeSortType = cb;
    this.element.addEventListener('click', this.#onChangeSortType);
  }

  #onChangeSortType = ({target}) => {
    if (target.tagName !== 'INPUT' || target.hasAttribute('checked')) {
      return;
    }

    this.#resetCheckedInput();
    target.setAttribute('checked', '');

    const sortType = target.value;

    this.#callbacks.changeSortType(sortType);
  }

  #resetCheckedInput = () => {
    const radioButtons = this.element.querySelectorAll('.trip-sort__item input');

    for (const radioButton of radioButtons) {
      radioButton.removeAttribute('checked');
    }
  }
}
