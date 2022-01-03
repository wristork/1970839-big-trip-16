import { render, RenderPosition, remove } from '../render';
import { UpdateType } from "../const";
import { getFilteredEventsByDate } from '../utils/common';

import SiteMenuComponent from '../view/site-menu-view';
import ControlsMainComponent from '../view/controls-main-view';
import InfoComponent from '../view/info-view';
import FiltersCompontent from '../view/filters';

export default class ControlsPresenter {
  #controlsMainComponent = new ControlsMainComponent();
  #siteMenuComponent = new SiteMenuComponent();
  #filtersComponent = new FiltersCompontent();
  #infoComponent = new InfoComponent();

  #controlsElement = null;

  #eventsModel = null;
  #filterModel = null;

  constructor(controlsElement, filterModel, eventsModel) {
    this.#controlsElement = controlsElement;

    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
  }

  get events() {
    const events = getFilteredEventsByDate([...this.#eventsModel.events], this.#filterModel.filterType, new Date());

    return events.sort((a, b) => a.date.start - b.date.start);
  }

  get filterType() {
    return this.#filterModel.filterType;
  }

  init() {
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

  clearInfo() {
    remove(this.#infoComponent);
  }

  #onFilterTypeChange = (filterType) => {
    this.#filterModel.setFilterType(filterType, UpdateType.MINOR);

    this.#infoComponent.events = this.events;

    this.clearInfo();
    this.renderInfo();
  };
}