import dayjs from 'dayjs';
import { generateDescription, generateImages } from '../mock/destination';
import { generateOffers } from '../mock/offers';
import { render, replace, remove, RenderPosition } from '../render';
import { ROUTES, DESTINATIONS, UserAction, UpdateType } from '../const';

import EventComponent from '../view/event-view';
import EditEventComponent from '../view/edit-event-view';

const BLANK_EVENT = {
  date: {
    start: dayjs().toDate(),
    end: dayjs().add(1, 'day').toDate()
  },
  routeType: ROUTES[0],
  destination:  {
    place: DESTINATIONS[0],
    description: generateDescription(),
    images: generateImages()
  },
  isFavorite: false,
  price: 0,
  offers: generateOffers(ROUTES[0]),
  isBlank: true,
};

export default class EventPresenter {
  #actionWithData = null;
  #changeToEditMode = null;
  #destroyNewForm = null;

  #parent = null;

  #sourceEvent = null;
  #editEventComponent = null;
  #eventComponent = null;

  constructor(parentElement, actionWithData, changeViewToEdit, destroyNewForm) {
    this.#actionWithData = actionWithData;
    this.#changeToEditMode = changeViewToEdit;
    this.#destroyNewForm = destroyNewForm;

    this.#parent = parentElement;
  }

  init(event = BLANK_EVENT) {
    this.#sourceEvent = event;

    const oldEventComponent = this.#eventComponent;

    this.#editEventComponent = new EditEventComponent(event);
    this.#eventComponent = new EventComponent(event);

    this.#setAllHandlers();

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
  }

  get event() {
    return this.#sourceEvent;
  }

  replaceToNormal = () => {
    document.removeEventListener('keydown', this.#onEscKeyDown);

    if (this.event === BLANK_EVENT) {
      this.destroy();

      return;
    }

    if (this.#editEventComponent.element.parentElement === this.#parent.element) {
      this.#editEventComponent.resetState(this.event);
      this.#editEventComponent.removeDatePicker();

      this.#replaceFromTo(this.#eventComponent, this.#editEventComponent);
    }
  }

  replaceToEdit = () => {
    this.#changeToEditMode();
    this.#initEditMode();
  }

  destroy() {
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
    this.replaceToNormal();

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
    this.#destroyNewForm();

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

      if (typeof this.#destroyNewForm === 'function') {
        this.#destroyNewForm();
      }

      this.replaceToNormal();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }
}
