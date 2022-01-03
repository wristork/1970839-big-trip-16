import { render, RenderPosition, remove } from '../render';
import { UpdateType } from "../const";
import { getFilteredEventsByDate } from '../utils/common';

import SiteMenuComponent from '../view/site-menu-view';
import ControlsMainComponent from '../view/controls-main-view';
import InfoComponent from '../view/info-view';
import FiltersCompontent from '../view/filters';

export default class ControlsPresenter {
  #controlsMainComponent = null;
  #siteMenuComponent = null;
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
      this.#eventsModel.addObserver(this.#onChangeEventModel);
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
    this.#controlsMainComponent = new ControlsMainComponent();
    this.#siteMenuComponent = new SiteMenuComponent();
    this.#filtersComponent = new FiltersCompontent();
    this.#infoComponent = new InfoComponent();

    this.#infoComponent.events = this.events;
    this.#filtersComponent.eventLength = this.events.length;

    this.#filtersComponent.addChangeFilterHandler(this.#onFilterTypeChange);
  }

  renderControls() {
    render(this.#controlsElement, this.#controlsMainComponent, RenderPosition.AFTERBEGIN);

    render(this.#controlsMainComponent, this.#siteMenuComponent, RenderPosition.BEFOREEND);
    render(this.#controlsMainComponent, this.#filtersComponent, RenderPosition.BEFOREEND);
  }

  renderInfo() {
    if (this.events.length) {
      render(this.#controlsMainComponent, this.#infoComponent, RenderPosition.BEFOREBEGIN);
    }
  }

  clearControls() {
    remove(this.#controlsMainComponent);
    remove(this.#siteMenuComponent);
    remove(this.#filtersComponent);

    this.clearInfo();
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

  #onChangeEventModel = (updateType) => {
    switch(updateType) {
      case UpdateType.MINOR:
        this.redrawInfo();
        break;
      case UpdateType.MAJOR:
        this.clearControls();
        this.init();
        this.renderControls();
        this.renderInfo();
        break;
    }
  }
}