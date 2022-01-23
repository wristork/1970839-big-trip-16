import { render, RenderPosition, remove } from '../render';
import { UpdateType, FilterTypes } from '../const';
import { getFilteredEventsByDate } from '../utils/common';

import InfoView from '../view/info-view';
import FiltersView from '../view/filters-view';

export default class ControlsPresenter {
  #filtersView = null;
  #infoView = null;

  #controlsElement = null;

  #eventsModel = null;
  #filterModel = null;

  constructor(controlsElement, filterModel, eventsModel) {
    this.#controlsElement = controlsElement;

    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    if (this.#eventsModel) {
      this.#eventsModel.addObserver(this.#onChangeModel);
    }

    if (this.#filterModel) {
      this.#filterModel.addObserver(this.#onChangeModel);
    }
  }

  get events() {
    const events = getFilteredEventsByDate([...this.#eventsModel.events], this.filterType, new Date());

    return events.sort((a, b) => a.date.start - b.date.start);
  }

  get filterType() {
    return this.#filterModel.filterType;
  }

  init() {
    this.#filtersView = new FiltersView();
    this.#infoView = new InfoView();
  }

  renderControls() {
    const futureEvents = getFilteredEventsByDate([...this.#eventsModel.events], FilterTypes.FUTURE, new Date());
    const pastEvents = getFilteredEventsByDate([...this.#eventsModel.events], FilterTypes.PAST, new Date());

    this.#filtersView.setFutureEventsLength(futureEvents.length);
    this.#filtersView.setPastEventsLength(pastEvents.length);

    render(this.#controlsElement, this.#filtersView, RenderPosition.BEFOREEND);

    this.#filtersView.addChangeFilterHandler(this.#onFilterTypeChange);
  }

  renderInfo() {
    this.#infoView.events = this.events;

    if (this.events.length) {
      render(this.#controlsElement, this.#infoView, RenderPosition.BEFOREBEGIN);
    }
  }

  clearControls() {
    this.#filterModel.setFilterType(FilterTypes.EVERYTHING);
    remove(this.#filtersView);
  }

  clearInfo() {
    remove(this.#infoView);
  }

  redrawInfo() {
    this.clearInfo();
    this.renderInfo();
  }

  #onFilterTypeChange = (filterType) => {
    this.#filterModel.setFilterType(filterType, UpdateType.MINOR);

    this.#infoView.events = this.events;

    this.redrawInfo();
  };

  #onChangeModel = (updateType) => {
    switch(updateType) {
      case UpdateType.MINOR:
        this.redrawInfo();
        break;
      case UpdateType.MAJOR:
        this.clearControls();
        this.clearInfo();
        this.init();
        this.renderControls();
        this.renderInfo();
        break;
      case UpdateType.INIT:
        this.renderControls();
        this.renderInfo();
    }
  }
}
