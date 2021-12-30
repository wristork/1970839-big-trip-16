import { render, RenderPosition } from '../render';
import { UserAction, UpdateType } from "../const";

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

  #sortType = SortType.DAY;

  constructor(option) {
    this.#controlsElement = option?.controls || null;
    this.#eventListElement = option?.eventList || null;

    this.#eventsModel = option?.eventsModel || null;

    if (this.#eventsModel) {
      this.#eventsModel.addObserver(this.#onChangeEventModel);
    }
  }

  get events() {
    switch(this.#sortType) {
      case SortType.TIME:
        return [...this.#eventsModel.events].sort((a, b) => (b.date.end - b.date.start) - (a.date.end - a.date.start));
      case SortType.PRICE:
        return [...this.#eventsModel.events].sort((a, b) => b.price - a.price);
      default:
        return [...this.#eventsModel.events].sort((a, b) => a.date.start - b.date.start);
    }
  }

  init() {
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
      const event = new EventPresenter(this.#eventListComponent, this.#onActionEventView, this.#onChangeEventMode);

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
    this.#sortType = type;

    this.#clearEvents();
    this.#renderEvents(this.events);
  };

  #onChangeEventMode = () => {
    this.#resetEventMode();
  };

  #onChangeEventModel = (updateType, event) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#eventPresenter.forEach((eventPresenter) => {
          if (eventPresenter.event === event) {
            eventPresenter.init(event);
          }
        });
        break;
      case UpdateType.MINOR:
        this.#clearEvents();
        this.#renderEvents(this.events);
        break;
      case UpdateType.MAJOR:
        console.log('Большое обновление');
        break;
    }
  }

  #onActionEventView = (actionType, sourceEvent, updateEvent, updateType) => {
    switch(actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(sourceEvent, updateEvent, updateType);
        break;
      case UserAction.DELETE_EVENT:
        // this.#eventsModel.deleteEvent();
        break;
      case UserAction.ADD_EVENT:
        // this.#eventsModel.addEvent();
        break;
    }
  }
}
