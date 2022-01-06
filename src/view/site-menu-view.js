import AbstractView from './abstract-view';

const createSiteMenuTemplate = () => (`<div class="trip-controls__navigation">
  <h2 class="visually-hidden">Switch trip view</h2>
  <nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
    <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>
</div>`);

export default class SiteMenuComponent extends AbstractView {
  #callbacks = {};

  get template() {
    return createSiteMenuTemplate();
  }

  addClickMenuItemHanlder(cb) {
    if (this.#callbacks.menuItemClick === undefined) {
      this.#callbacks.menuItemClick = cb;
    }

    this.element.querySelector('.trip-tabs').addEventListener('click', this.#onClickMenuItem);
  }

  #onClickMenuItem = ({ target }) => {
    if (target.tagName !== 'A') {
      return;
    }

    
  }
}
