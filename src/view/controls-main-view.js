import AbstractView from './abstract-view';

const createControlsMainTemplate = () => '<div class="trip-main__trip-controls  trip-controls"></div>';

export default class ControlsMainComponent extends AbstractView {
  get template() {
    return createControlsMainTemplate();
  }
}
