import { render, replace, RenderPosition } from '../render';

import EventComponent from '../view/event-view';
import EditEventComponent from '../view/edit-event-view';

export default class EventPresenter {
  #parent = null;
  #event = null;
  #editEventComponent = null;
  #eventComponent = null;

  constructor(parentElement) {
    this.#parent = parentElement;
  }

  init(event) {
    this.#event = event;

    this.#editEventComponent = new EditEventComponent(event);
    this.#eventComponent = new EventComponent(event);

    this.#setHandlers();

    render(this.#parent, this.#eventComponent, RenderPosition.BEFOREEND);
  }

  #setHandlers = () => {
    this.#eventComponent.addEditStateClickHandler(() => {
      this.#replaceToEdit();

      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    this.#editEventComponent.addNormalStateClickHandler(() => {
      this.#replaceToNormal();

      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    this.#editEventComponent.addFormSubmitHandler((evt) => {
      evt.preventDefault();

      this.#replaceToNormal();
    });
  }

  #replaceToNormal = () => {
    replace(this.#parent, this.#eventComponent, this.#editEventComponent);
  }

  #replaceToEdit = () => {
    replace(this.#parent, this.#editEventComponent, this.#eventComponent);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceToNormal();

      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }
}
