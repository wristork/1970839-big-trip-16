import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  constructor() {
    super();

    this._data = null;
  }

  updateData(update, justUpdateData) {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if (justUpdateData) {
      return;
    }

    this.updateElement();
    this.restoreHandlers();
  }

  updateElement() {
    const parent = this.element.parentElement;
    const oldElement = this.element;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, oldElement);
  }

  restoreHandlers() {
    throw new Error('Method \'restoreHandlers\' must be overwritten in the inheritor class');
  }
}
