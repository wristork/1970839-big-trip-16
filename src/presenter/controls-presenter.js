import { render, RenderPosition, remove } from '../render';
import { UpdateType, FilterTypes } from '../const';
import { getFilteredEventsByDate } from '../utils/common';

import InfoComponent from '../view/info-view';
import FiltersCompontent from '../view/filters';

export default class ControlsPresenter {
  #filtersComponent = null;
  #infoComponent = null;

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
    const events = getFilteredEventsByDate([...this.#eventsModel.events], this.#filterModel.filterType, new Date());

    return events.sort((a, b) => a.date.start - b.date.start);
  }

  get filterType() {
    return this.#filterModel.filterType;
  }

  init() {
    this.#filtersComponent = new FiltersCompontent();
    this.#infoComponent = new InfoComponent();

    this.#filtersComponent.eventLength = this.events.length;
  }

  renderControls() {
    render(this.#controlsElement, this.#filtersComponent, RenderPosition.BEFOREEND);

    this.#filtersComponent.addChangeFilterHandler(this.#onFilterTypeChange);
  }

  renderInfo() {
    this.#infoComponent.events = this.events;

    if (this.events.length) {
      render(this.#controlsElement, this.#infoComponent, RenderPosition.BEFOREBEGIN);
    }
  }

  clearControls() {
    this.#filterModel.setFilterType(FilterTypes.EVERYTHING);
    remove(this.#filtersComponent);
  }

  clearInfo() {
    remove(this.#infoComponent);
  }

  redrawInfo() {
    this.clearInfo();
    this.renderInfo();
  }

  #onFilterTypeChange = (filterType) => {
    this.#filterModel.setFilterType(filterType, UpdateType.MINOR);

    this.#infoComponent.events = this.events;

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
        this.#filtersComponent.eventLength = this.events.length;

        this.renderControls();
        this.renderInfo();
    }
  }
}
