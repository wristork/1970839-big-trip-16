export default class AbstractObservable {
  #observers = new Set();

  constructor() {
    if (new.target === AbstractObservable) {
      throw new Error(`Can't create instance of the abstract class: ${this.constructor.name}`);
    }
  }

  addObserver(observer) {
    this.#observers.add(observer);
  }

  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  _notify(data, payload) {
    this.#observers.forEach((observer) => observer(data, payload));
  }
}
