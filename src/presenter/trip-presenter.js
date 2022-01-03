import { render, RenderPosition, remove } from '../render';
import { UserAction, UpdateType } from "../const";
import { getFilteredEventsByDate } from '../utils/common';

import EventSorterComponent from '../view/event-sorter-view';
import EventListComponent from '../view/event-list-view';
import noEventsCompontent from '../view/no-events-view';

import EventPresenter from './event-presenter';

const SortType = {
  DAY: 'sort-day',
  PRICE: 'sort-price',
  TIME: 'sort-time'
};

export default class TripPresenter {
  #eventListComponent = null;
  #eventSorterComponent = null;
  #noEventsCompontent = null;

  #eventListElement = null;

  #eventsModel = null;
  #filterModel = null;

  #eventPresenter = new Set();

  #sortType = SortType.DAY;

  constructor(eventListElement, eventsModel, filterModel) {
    this.#eventListElement = eventListElement;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    if (this.#eventsModel) {
      this.#eventsModel.addObserver(this.#onChangeEventModel);
    }

    if (this.#filterModel) {
      this.#filterModel.addObserver(this.#onChangeFilter);
    }
  }

  get events() {
    let events = getFilteredEventsByDate([...this.#eventsModel.events], this.#filterModel.filterType, new Date());

    switch(this.#sortType) {
      case SortType.TIME:
        return events.sort((a, b) => (b.date.end - b.date.start) - (a.date.end - a.date.start));
      case SortType.PRICE:
        return events.sort((a, b) => b.price - a.price);
      default:
        return events.sort((a, b) => a.date.start - b.date.start);
    }
  }

  init() {
    this.#eventListComponent = new EventListComponent();
    this.#eventSorterComponent = new EventSorterComponent();
    this.#noEventsCompontent = new noEventsCompontent(this.#filterModel.filterType);
  }

  renderEventList() {
    if (this.events.length) {
      render(this.#eventListElement, this.#eventSorterComponent, RenderPosition.BEFOREEND);
      render(this.#eventListElement, this.#eventListComponent, RenderPosition.BEFOREEND);

      this.#eventSorterComponent.addChangeSortTypeHandler(this.#onSortEvent);

      this.#renderEvents(this.events);
    } else {
      render(this.#eventListElement, this.#noEventsCompontent, RenderPosition.BEFOREEND);
    }
  }

  clearEventList() {
    this.#clearEvents();

    remove(this.#eventListComponent);
    remove(this.#eventSorterComponent);
    remove(this.#noEventsCompontent);

    this.#sortType = SortType.DAY;
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

  #onChangeFilter = () => {
    this.clearEventList();
    this.init();
    this.renderEventList();
  }
}
