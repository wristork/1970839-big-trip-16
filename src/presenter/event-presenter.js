import dayjs from 'dayjs';
import { render, replace, remove, RenderPosition } from '../render';
import { UserAction, UpdateType } from '../const';

import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';

const BLANK_EVENT = {
  date: {
    start: dayjs().toDate(),
    end: dayjs().add(1, 'day').toDate()
  },
  routeType: '',
  isFavorite: false,
  price: 50,
  destination: null,
  offers: null,
  isBlank: true,
};

export default class EventPresenter {
  #actionWithData = null;
  #changeMode = null;

  #parent = null;

  #sourceEvent = null;
  #editEventView = null;
  #eventView = null;

  #destinations = [];
  #offers = [];

  constructor(parentElement, actionWithData, changeMode, destinations, offers) {
    this.#actionWithData = actionWithData;
    this.#changeMode = changeMode;

    this.#parent = parentElement;

    this.#destinations = destinations;
    this.#offers = offers;

    if (!BLANK_EVENT.destination || !BLANK_EVENT.offers || !BLANK_EVENT.routeType) {
      BLANK_EVENT.destination = destinations[0] ?? '';
      BLANK_EVENT.offers = offers[0]?.offers ?? [];
      BLANK_EVENT.routeType = offers[0]?.type ?? '';
    }
  }

  init(event = BLANK_EVENT) {
    this.#sourceEvent = event;

    const oldEventView = this.#eventView;

    this.#editEventView = new EditEventView(event, this.#destinations, this.#offers);
    this.#eventView = new EventView(event);

    if (event === BLANK_EVENT) {
      render(this.#parent, this.#eventView, RenderPosition.AFTERBEGIN);

      this.#initEditMode();
    } else {
      if (oldEventView === null) {
        render(this.#parent, this.#eventView, RenderPosition.BEFOREEND);
      } else {
        this.#replaceFromTo(this.#eventView, oldEventView);
      }
    }

    this.#setAllHandlers();
  }

  get event() {
    return this.#sourceEvent;
  }

  replaceToNormal() {
    this.#changeMode();

    if (this.event === BLANK_EVENT) {
      this.destroy();

      return;
    }

    this.#editEventView.resetState(this.event);
    this.#editEventView.removeDatePicker();
  }

  replaceToEdit = () => {
    this.#changeMode();
    this.#initEditMode();
  }

  destroy() {
    document.removeEventListener('keydown', this.#onEscKeyDown);

    if (this.#eventView !== null) {
      remove(this.#eventView);
      this.#eventView = null;
    }

    if (this.#editEventView !== null) {
      this.#editEventView.removeDatePicker();
      remove(this.#editEventView);

      this.#editEventView = null;
    }
  }

  setSavingState() {
    this.#editEventView.updateData({
      isSaving: true,
      isDisabled: true,
    });
  }

  setDeletingState() {
    this.#editEventView.updateData({
      isDeleting: true,
      isDisabled: true,
    });
  }

  setAbortingState() {
    this.#editEventView.resetState(this.event);
    this.#editEventView.shake();
  }

  #initEditMode = () => {
    this.#editEventView.setDatePicker();

    this.#replaceFromTo(this.#editEventView, this.#eventView);
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #onFavoriteButtonClick = () => {
    this.#actionWithData(
      UserAction.UPDATE_EVENT,
      this.event,
      {...this.event, isFavorite: !this.event.isFavorite},
      UpdateType.PATCH
    );
  }

  #onEditStateClick = () => {
    this.replaceToEdit();
  }

  #onNormalStateClick = () => {
    this.replaceToNormal();
  }

  #onEditSave = (updatedEvent) => {
    this.setSavingState();

    this.#actionWithData(
      UserAction.UPDATE_EVENT,
      this.event,
      updatedEvent,
      UpdateType.MAJOR
    );
  }

  #onAddSave = (event) => {
    this.#actionWithData(
      UserAction.ADD_EVENT,
      this.event,
      event,
      UpdateType.MAJOR
    );
  }

  #onDelete = () => {
    this.#actionWithData(
      UserAction.DELETE_EVENT,
      this.event,
      null,
      UpdateType.MAJOR
    );
  };

  #onCancel = () => {
    this.#changeMode(true);

    this.destroy();
  }

  #setAllHandlers = () => {
    this.#eventView.addEditStateClickHandler(this.#onEditStateClick);
    this.#eventView.addFavoriteButtonClickHandler(this.#onFavoriteButtonClick);

    this.#setEditHandlers();
  }

  #setEditHandlers = () => {
    if (this.event === BLANK_EVENT) {
      this.#editEventView.addResetButtonClickHandler(this.#onCancel);
      this.#editEventView.addFormSubmitHandler(this.#onAddSave);
    } else {
      this.#editEventView.addNormalStateClickHandler(this.#onNormalStateClick);
      this.#editEventView.addResetButtonClickHandler(this.#onDelete);
      this.#editEventView.addFormSubmitHandler(this.#onEditSave);
    }
  }

  #replaceFromTo = (newChild, oldChild) => {
    replace(this.#parent, newChild, oldChild);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      this.replaceToNormal();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }
}
