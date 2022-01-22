import AbstractView from './abstract-view';

const createLoadingTemplate = () => '<p class="trip-events__msg">Loading...</p>';

export default class LoadingComponent extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}
