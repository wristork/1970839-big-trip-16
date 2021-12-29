import { render, replace, remove, RenderPosition } from '../render';

import EventComponent from '../view/event-view';
import EditEventComponent from '../view/edit-event-view';

export default class EventPresenter {
  #changeFavorite = null;
  #changeToEditMode = null;

  #parent = null;

  #sourceEvent = null;
  #editEventComponent = null;
  #eventComponent = null;

  constructor(parentElement, changeFavorite, changeViewToEdit) {
    this.#changeFavorite = changeFavorite;
    this.#changeToEditMode = changeViewToEdit;

    this.#parent = parentElement;
  }

  init(event) {
    this.#sourceEvent = event;

    const oldEventComponent = this.#eventComponent;

    this.#editEventComponent = new EditEventComponent(event);
    this.#eventComponent = new EventComponent(event);

    if (oldEventComponent === null) {
      render(this.#parent, this.#eventComponent, RenderPosition.BEFOREEND);
    } else {
      this.#replaceFromTo(this.#eventComponent, oldEventComponent);
    }

    this.#setHandlers();
  }

  get event() {
    return this.#sourceEvent;
  }

  replaceToNormal = () => {
    if (this.#editEventComponent.element.parentElement === this.#parent.element) {
      this.#editEventComponent.resetState(this.event);
      this.#editEventComponent.removeDatePicker();

      this.#replaceFromTo(this.#eventComponent, this.#editEventComponent);
    }
  }

  replaceToEdit = () => {
    this.#changeToEditMode();
    this.#editEventComponent.setDatePicker();

    this.#replaceFromTo(this.#editEventComponent, this.#eventComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#editEventComponent);
  }

  #onFavoriteButtonClick = () => {
    this.#changeFavorite(this);
  }

  #onEditStateClick = () => {
    this.replaceToEdit();

    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #onNormalStateClick = () => {
    this.replaceToNormal();

    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onSave = () => {
    this.replaceToNormal();
  }

  #setHandlers = () => {
    this.#eventComponent.addEditStateClickHandler(this.#onEditStateClick);
    this.#eventComponent.addFavoriteButtonClickHandler(this.#onFavoriteButtonClick);

    this.#editEventComponent.addNormalStateClickHandler(this.#onNormalStateClick);
    this.#editEventComponent.addFormSubmitHandler(this.#onSave);
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
