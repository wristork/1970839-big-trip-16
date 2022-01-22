import dayjs from 'dayjs';
import { render, replace, remove, RenderPosition } from '../render';
import { UserAction, UpdateType } from '../const';

import EventComponent from '../view/event-view';
import EditEventComponent from '../view/edit-event-view';

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
  #editEventComponent = null;
  #eventComponent = null;

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

    const oldEventComponent = this.#eventComponent;

    this.#editEventComponent = new EditEventComponent(event, this.#destinations, this.#offers);
    this.#eventComponent = new EventComponent(event);

    if (event === BLANK_EVENT) {
      render(this.#parent, this.#eventComponent, RenderPosition.AFTERBEGIN);

      this.#initEditMode();
    } else {
      if (oldEventComponent === null) {
        render(this.#parent, this.#eventComponent, RenderPosition.BEFOREEND);
      } else {
        this.#replaceFromTo(this.#eventComponent, oldEventComponent);
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

    this.#editEventComponent.resetState(this.event);
    this.#editEventComponent.removeDatePicker();
  }

  replaceToEdit = () => {
    this.#changeMode();
    this.#initEditMode();
  }

  destroy() {
    document.removeEventListener('keydown', this.#onEscKeyDown);

    if (this.#eventComponent !== null) {
      remove(this.#eventComponent);
      this.#eventComponent = null;
    }

    if (this.#editEventComponent !== null) {
      this.#editEventComponent.removeDatePicker();
      remove(this.#editEventComponent);

      this.#editEventComponent = null;
    }
  }

  setSavingState() {
    this.#editEventComponent.updateData({
      isSaving: true,
      isDisabled: true,
    });
  }

  setDeletingState() {
    this.#editEventComponent.updateData({
      isDeleting: true,
      isDisabled: true,
    });
  }

  setAbortingState() {
    this.#editEventComponent.resetState(this.event);
    this.#editEventComponent.shake();
  }

  #initEditMode = () => {
    this.#editEventComponent.setDatePicker();

    this.#replaceFromTo(this.#editEventComponent, this.#eventComponent);
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
    this.#eventComponent.addEditStateClickHandler(this.#onEditStateClick);
    this.#eventComponent.addFavoriteButtonClickHandler(this.#onFavoriteButtonClick);

    this.#setEditHandlers();
  }

  #setEditHandlers = () => {
    if (this.event === BLANK_EVENT) {
      this.#editEventComponent.addResetButtonClickHandler(this.#onCancel);
      this.#editEventComponent.addFormSubmitHandler(this.#onAddSave);
    } else {
      this.#editEventComponent.addNormalStateClickHandler(this.#onNormalStateClick);
      this.#editEventComponent.addResetButtonClickHandler(this.#onDelete);
      this.#editEventComponent.addFormSubmitHandler(this.#onEditSave);
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
