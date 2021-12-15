import { render, replace, RenderPosition } from '../render';

import EventComponent from '../view/event-view';
import EditEventComponent from '../view/edit-event-view';

export default class EventPresenter {
  #parent = null;
  #event = null;
  #editEventComponent = null;
  #eventComponent = null;

  #updateEventData = null;

  constructor(parentElement, updateEventData) {
    this.#updateEventData = updateEventData;
    this.#parent = parentElement;
  }

  init(event) {
    this.#event = event;

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
    return this.#event;
  }

  #onFavoriteButtonClick = () => {
    this.#updateEventData(this);
  }

  #onEditStateClick = () => {
    this.#replaceToEdit();

    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #onNormalStateClick = () => {
    this.#replaceToNormal();

    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onSave = (evt) => {
    evt.preventDefault();

    this.#replaceToNormal();
  }

  #setHandlers = () => {
    this.#eventComponent.addEditStateClickHandler(this.#onEditStateClick);
    this.#eventComponent.addFavoriteButtonClickHandler(this.#onFavoriteButtonClick);
    this.#editEventComponent.addNormalStateClickHandler(this.#onNormalStateClick);
    this.#editEventComponent.addFormSubmitHandler(this.#onSave);
  }

  #replaceFromTo = (a, b) => {
    replace(this.#parent, a, b);
  }

  #replaceToNormal = () => {
    this.#replaceFromTo(this.#eventComponent, this.#editEventComponent);
  }

  #replaceToEdit = () => {
    this.#replaceFromTo(this.#editEventComponent, this.#eventComponent);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceToNormal();

      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }
}
