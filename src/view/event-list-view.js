import AbstractView from './abstract-view';

const createEventListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class EventListComponent extends AbstractView {
  get template() {
    return createEventListTemplate();
  }
}
