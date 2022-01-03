import AbstractView from './abstract-view';

const createFilterTemplate = (length) => {
  const disabledAttribute = length ? '' : 'disabled';

  return `<div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input
          id="filter-future"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="future" ${disabledAttribute}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input
          id="filter-past"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="past" ${disabledAttribute}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`;
};

export default class FiltersCompontent extends AbstractView {
  #eventLength = 0;
  #callbacks = {};

  get template() {
    return createFilterTemplate(this.#eventLength);
  }

  get eventLength() {
    return this.#eventLength;
  }

  set eventLength(value) {
    this.#eventLength = Math.max(0, value);
  }

  addChangeFilterHandler(cb) {
    if (typeof cb === 'function') {
      this.#callbacks.changeFilter = cb;
    }

    this.element.querySelector('.trip-filters').addEventListener('click', this.#onChangeFilter);
  }

  #onChangeFilter = (evt) => {
    const { target } = evt;

    if (target.tagName !== 'INPUT') {
      return;
    }

    this.#callbacks.changeFilter(target.value);
  }
}
