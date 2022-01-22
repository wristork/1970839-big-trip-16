import { FilterTypes } from '../const';

import AbstractObservable from '../utils/abstract-observable';

export default class FilterModel extends AbstractObservable {
  #filterType = FilterTypes.EVERYTHING;

  get filterType() {
    return this.#filterType;
  }

  setFilterType(filterType, updateType) {
    this.#filterType = filterType;

    this._notify(updateType, filterType);
  }
}
