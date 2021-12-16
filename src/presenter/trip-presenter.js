import { render, RenderPosition } from '../render';

import EventSorterComponent from '../view/event-sorter-view';
import EventListComponent from '../view/event-list-view';
import noEventsCompontent from '../view/no-events-view';
import SiteMenuComponent from '../view/site-menu-view';
import ControlsMainComponent from '../view/controls-main-view';
import InfoComponent from '../view/info-view';
import FiltersCompontent from '../view/filters';

import EventPresenter from './event-presenter';

export default class TripPresenter {
  #controlsMainComponent = new ControlsMainComponent();
  #siteMenuComponent = new SiteMenuComponent();
  #filtersComponent = new FiltersCompontent();
  #infoComponent = new InfoComponent();

  #eventListComponent = new EventListComponent();
  #eventSorterComponent = new EventSorterComponent();

  #events = [];
  #eventPresenter = new Set();

  #controlsContainer = null;
  #eventListContainer = null;

  constructor(option) {
    this.#controlsContainer = option?.controls || null;
    this.#eventListContainer = option?.eventList || null;
  }

  init(events) {
    this.#events = [...events];

    this.#infoComponent.events = this.#events;
    this.#filtersComponent.eventLength = this.#events.length;
  }

  renderTripControls() {
    render(this.#controlsContainer, this.#controlsMainComponent, RenderPosition.AFTERBEGIN);

    render(this.#controlsMainComponent, this.#siteMenuComponent, RenderPosition.BEFOREEND);
    render(this.#controlsMainComponent, this.#filtersComponent, RenderPosition.BEFOREEND);
  }

  renderTripInfo() {
    if (this.#events.length) {
      render(this.#controlsMainComponent, this.#infoComponent, RenderPosition.BEFOREBEGIN);
    }
  }

  renderEventList() {
    if (this.#events.length) {
      render(this.#eventListContainer, this.#eventSorterComponent, RenderPosition.BEFOREEND);
      render(this.#eventListContainer, this.#eventListComponent, RenderPosition.BEFOREEND);

      this.#renderEvents();
    } else {
      render(this.#eventListContainer, new noEventsCompontent(), RenderPosition.BEFOREEND);
    }
  }

  #renderEvents = () => {
    for (let i = 0; i < this.#events.length; i++) {
      const event = new EventPresenter(this.#eventListComponent, this.#onChangeFavorite, this.#onChangeEventMode);

      event.init(this.#events[i]);

      this.#eventPresenter.add(event);
    }
  }

  #resetEvents = () => {
    this.#eventPresenter.forEach((presenter) => {
      presenter.replaceToNormal();
      presenter.init(presenter.event);
    });
  }

  #onChangeFavorite = (eventPresenter) => {
    const event = eventPresenter?.event;

    if (event) {
      event.isFavorite = !event.isFavorite;
    }

    eventPresenter.init(event);
  }

  #onChangeEventMode = () => {
    this.#resetEvents();
  };
}
