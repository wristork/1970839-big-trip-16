import { render, RenderPosition, remove } from '../render';
import { UserAction, UpdateType } from '../const';
import { getFilteredEventsByDate } from '../utils/common';

import EventSorterView from '../view/event-sorter-view';
import EventListView from '../view/event-list-view';
import noEventsView from '../view/no-events-view';
import LoadingView from '../view/loading-view';

import EventPresenter from './event-presenter';

const SortType = {
  DAY: 'sort-day',
  PRICE: 'sort-price',
  TIME: 'sort-time'
};

export default class TripPresenter {
  #eventListView = null;
  #eventSorterView = null;
  #noEventsView = null;
  #loadingView = null;

  #tripEventsElement = null;

  #satellites = null;
  #newEventPresenter = null;

  #eventsModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #eventPresenter = new Set();

  #sortType = SortType.DAY;

  #isLoading = true;

  constructor(tripEventsElement, eventsModel, filterModel, destinationsModel, offersModel, options = {}) {
    this.#tripEventsElement = tripEventsElement;
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
    this.#eventListView = new EventListView();
    this.#eventSorterView = new EventSorterView();
    this.#loadingView = new LoadingView();
    this.#noEventsView = new noEventsView(this.#filterModel.filterType);

    render(this.#tripEventsElement, this.#eventListView, RenderPosition.BEFOREEND);
  }

  initNewForm() {
    this.#newEventPresenter = new EventPresenter(
      this.#eventListView,
      this.#onActionEventView,
      this.#onChangeEventMode,
      this.#destinationsModel.destinations,
      this.#offersModel.offers
    );
  }

  renderEventList() {
    if (this.#isLoading) {
      render(this.#tripEventsElement, this.#loadingView, RenderPosition.BEFOREEND);
      return;
    }

    if (this.events.length) {
      render(this.#tripEventsElement, this.#eventSorterView, RenderPosition.AFTERBEGIN);

      this.#eventSorterView.addChangeSortTypeHandler(this.#changeSortEvent);

      this.#renderEvents(this.events);
    } else {
      render(this.#tripEventsElement, this.#noEventsView, RenderPosition.BEFOREEND);
    }
  }

  clearEventList() {
    this.#clearEvents();

    this.#newEventPresenter.destroy();

    remove(this.#eventSorterView);
    remove(this.#noEventsView);

    this.#satellites.newEventButtonElement.removeAttribute('disabled');
    this.#sortType = SortType.DAY;
  }

  resetSort = () => {
    this.#changeSortEvent(SortType.DAY);

    this.clearEventList();
    this.renderEventList();
  }

  showCreateForm() {
    this.#newEventPresenter.init();
    remove(this.#noEventsView);
  }

  closeCreateForm() {
    this.#newEventPresenter.destroy();

    if (!this.events.length) {
      render(this.#tripEventsElement, this.#noEventsView, RenderPosition.BEFOREEND);
    }
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
        this.#eventListView,
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
        remove(this.#loadingView);
        this.initNewForm();
    }
  }

  #onActionEventView = async (actionType, sourceEvent, updateEvent, updateType) => {
    let presenterOrigin = Array.from(this.#eventPresenter).filter((presenter) => {
      if (presenter.event === sourceEvent) {
        return true;
      }
    });

    presenterOrigin = presenterOrigin[0];

    if (presenterOrigin === undefined && this.#newEventPresenter.event === sourceEvent) {
      presenterOrigin = this.#newEventPresenter;
    }

    switch(actionType) {
      case UserAction.UPDATE_EVENT:
        presenterOrigin.setSavingState();

        try {
          await this.#eventsModel.updateEvent(sourceEvent, updateEvent, updateType);
        } catch(err) {
          presenterOrigin.setAbortingState();
        }

        break;
      case UserAction.DELETE_EVENT:
        presenterOrigin.setDeletingState();

        try {
          await this.#eventsModel.deleteEvent(sourceEvent, updateType);
        } catch(err) {
          presenterOrigin.setAbortingState();
        }

        break;
      case UserAction.ADD_EVENT:
        presenterOrigin.setSavingState();

        try {
          await this.#eventsModel.addEvent(sourceEvent, updateEvent, updateType);
        } catch(err) {
          presenterOrigin.setAbortingState();
        }

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
