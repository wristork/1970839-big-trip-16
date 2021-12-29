import { render, RenderPosition } from '../render';

import EventSorterComponent from '../view/event-sorter-view';
import EventListComponent from '../view/event-list-view';
import noEventsCompontent from '../view/no-events-view';
import SiteMenuComponent from '../view/site-menu-view';
import ControlsMainComponent from '../view/controls-main-view';
import InfoComponent from '../view/info-view';
import FiltersCompontent from '../view/filters';

import EventPresenter from './event-presenter';

const SortType = {
  DAY: 'sort-day',
  PRICE: 'sort-price',
  TIME: 'sort-time'
};

export default class TripPresenter {
  #controlsMainComponent = new ControlsMainComponent();
  #siteMenuComponent = new SiteMenuComponent();
  #filtersComponent = new FiltersCompontent();
  #infoComponent = new InfoComponent();
  #eventListComponent = new EventListComponent();
  #eventSorterComponent = new EventSorterComponent();

  #controlsElement = null;
  #eventListElement = null;

  #eventsModel = null;
  #eventPresenter = new Set();

  constructor(option) {
    this.#controlsElement = option?.controls || null;
    this.#eventListElement = option?.eventList || null;

    this.#eventsModel = option?.eventsModel || null;
  }

  get events() {
    return this.#eventsModel.events;
  }

  init() {
    this.#sortByDay();

    this.#infoComponent.events = this.events;
    this.#filtersComponent.eventLength = this.events.length;
  }

  renderTripControls() {
    render(this.#controlsElement, this.#controlsMainComponent, RenderPosition.AFTERBEGIN);

    render(this.#controlsMainComponent, this.#siteMenuComponent, RenderPosition.BEFOREEND);
    render(this.#controlsMainComponent, this.#filtersComponent, RenderPosition.BEFOREEND);
  }

  renderTripInfo() {
    if (this.events.length) {
      render(this.#controlsMainComponent, this.#infoComponent, RenderPosition.BEFOREBEGIN);
    }
  }

  renderEventList() {
    if (this.events.length) {
      render(this.#eventListElement, this.#eventSorterComponent, RenderPosition.BEFOREEND);
      render(this.#eventListElement, this.#eventListComponent, RenderPosition.BEFOREEND);

      this.#eventSorterComponent.addChangeSortTypeHandler(this.#onSortEvent);

      this.#renderEvents(this.events);
    } else {
      render(this.#eventListElement, new noEventsCompontent(), RenderPosition.BEFOREEND);
    }
  }

  #renderEvents = (events) => {
    for (let i = 0; i < events.length; i++) {
      const event = new EventPresenter(this.#eventListComponent, this.#onChangeFavorite, this.#onChangeEventMode);

      event.init(events[i]);

      this.#eventPresenter.add(event);
    }
  }

  #resetEventMode = () => {
    this.#eventPresenter.forEach((presenter) => {
      presenter.replaceToNormal();
      presenter.init(presenter.event);
    });
  }

  #clearEvents = () => {
    this.#eventPresenter.forEach((presenter) => {
      presenter.destroy();
    });
    this.#eventPresenter.clear();
  }

  #onSortEvent = (type) => {
    switch(type) {
      case SortType.DAY:
        this.#sortByDay();
        break;
      case SortType.PRICE:
        this.#sortByPrice();
        break;
      case SortType.TIME:
        this.#sortByTime();
    }
  };

  #sortEvent = (callback) => {
    this.#clearEvents();
    this.#renderEvents([...this.events].sort(callback));
  }

  #sortByDay = () => {
    this.#sortEvent((a, b) => a.date.start - b.date.start);
  }

  #sortByPrice = () => {
    this.#sortEvent((a, b) => b.price - a.price);
  };

  #sortByTime = () => {
    this.#sortEvent((a, b) => (b.date.end - b.date.start) - (a.date.end - a.date.start));
  };

  #onChangeFavorite = (eventPresenter) => {
    const event = eventPresenter?.event;

    if (event) {
      event.isFavorite = !event.isFavorite;
    }

    eventPresenter.init(event);
  }

  #onChangeEventMode = () => {
    this.#resetEventMode();
  };
}
