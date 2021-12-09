import AbstractView from './abstract-view';

const createEmptyMessageTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class NoEventsComponent extends AbstractView {
  get template() {
    return createEmptyMessageTemplate();
  }
}
