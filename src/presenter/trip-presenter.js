import { render, RenderPosition, remove } from '../render';
import { UserAction, UpdateType } from '../const';
import { getFilteredEventsByDate } from '../utils/common';

import EventSorterComponent from '../view/event-sorter-view';
import EventListComponent from '../view/event-list-view';
import noEventsComponent from '../view/no-events-view';
import LoadingComponent from '../view/loading-view';

import EventPresenter from './event-presenter';

const SortType = {
  DAY: 'sort-day',
  PRICE: 'sort-price',
  TIME: 'sort-time'
};

export default class TripPresenter {
  #eventListComponent = null;
  #eventSorterComponent = null;
  #noEventsComponent = null;
  #loadingComponent = null;

  #eventListElement = null;

  #satellites = null;
  #newEventForm = null;

  #eventsModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #eventPresenter = new Set();

  #sortType = SortType.DAY;

  #isLoading = true;

  constructor(eventListElement, eventsModel, filterModel, destinationsModel, offersModel, options = {}) {
    this.#eventListElement = eventListElement;
    this.#satellites = options?.satellites;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    if (this.#eventsModel) {
      this.#eventsModel.addObserver(this.#onChangeEventModel);
    }

    if (this.#filterModel) {
      this.#filterModel.addObserver(this.#onChangeFilter);
    }
  }

  get events() {
    const events = getFilteredEventsByDate([...this.#eventsModel.events], this.#filterModel.filterType, new Date());

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
    this.#loadingComponent = new LoadingComponent();
    this.#noEventsComponent = new noEventsComponent(this.#filterModel.filterType);

    this.#newEventForm = new EventPresenter(
      this.#eventListComponent,
      this.#onActionEventView,
      this.#onChangeEventMode,
      this.#destinationsModel.destinations,
      this.#offersModel.offers
    );
  }

  renderEventList() {
    if (this.#isLoading) {
      render(this.#eventListElement, this.#loadingComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.events.length) {
      render(this.#eventListElement, this.#eventSorterComponent, RenderPosition.BEFOREEND);
      render(this.#eventListElement, this.#eventListComponent, RenderPosition.BEFOREEND);

      this.#eventSorterComponent.addChangeSortTypeHandler(this.#changeSortEvent);

      this.#renderEvents(this.events);
    } else {
      render(this.#eventListElement, this.#noEventsComponent, RenderPosition.BEFOREEND);
    }
  }

  clearEventList() {
    this.#clearEvents();

    remove(this.#eventListComponent);
    remove(this.#eventSorterComponent);
    remove(this.#noEventsComponent);

    this.#satellites.newEventButtonElement.removeAttribute('disabled');
    this.#sortType = SortType.DAY;
  }

  resetSort = () => {
    this.#changeSortEvent(SortType.DAY);

    this.clearEventList();
    this.renderEventList();
  }

  showCreateForm() {
    this.#newEventForm.init();
  }

  closeCreateForm() {
    this.#newEventForm.destroy();
  }

  resetEvents = () => {
    this.#eventPresenter.forEach((presenter) => {
      presenter.destroy();
      presenter.init(presenter.event);
    });
  }

  #renderEvents = (events) => {
    for (let i = 0; i < events.length; i++) {
      const event = new EventPresenter(
        this.#eventListComponent,
        this.#onActionEventView,
        this.#onChangeEventMode,
        this.#destinationsModel.destinations,
        this.#offersModel.offers
      );

      event.init(events[i]);

      this.#eventPresenter.add(event);
    }
  }

  #clearEvents = () => {
    this.#eventPresenter.forEach((presenter) => {
      presenter.destroy();
    });

    this.#eventPresenter.clear();
  }

  #changeSortEvent = (type) => {
    this.#sortType = type;

    this.#clearEvents();
    this.#renderEvents(this.events);

    this.#satellites.newEventButtonElement.removeAttribute('disabled');
  };

  #onChangeEventMode = (ignoreReset) => {
    if (!ignoreReset) {
      this.resetEvents();
    }

    this.closeCreateForm();
    this.#satellites.newEventButtonElement.removeAttribute('disabled');
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
        this.clearEventList();
        this.renderEventList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.renderEventList();
    }
  }

  #onActionEventView = (actionType, sourceEvent, updateEvent, updateType) => {
    switch(actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(sourceEvent, updateEvent, updateType);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(sourceEvent, updateType);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(sourceEvent, updateEvent, updateType);
        break;
    }
  }

  #onChangeFilter = (updateType) => {
    if (updateType) {
      this.clearEventList();
      this.renderEventList();
    }
  }
}
