import { render, RenderPosition } from '../render';

import EventSorterComponent from '../view/event-sorter-view';
import EventListComponent from '../view/event-list-view';
import noEventsCompontent from '../view/no-events-view';
import SiteMenuComponent from '../view/site-menu-view';
import ControlsMainComponent from '../view/controls-main-view';
import InfoComponent from '../view/info-view';
import FiltersCompontent from '../view/filters';

import EventPresenter from './event-presenter';

export default class TripPresenter {
  #controlsMainComponent = new ControlsMainComponent();
  #siteMenuComponent = new SiteMenuComponent();
  #filtersComponent = new FiltersCompontent();
  #infoComponent = new InfoComponent();

  #eventListComponent = new EventListComponent();
  #eventSorterComponent = new EventSorterComponent();

  #events = [];

  init(events) {
    this.#events = [...events];

    this.#infoComponent.events = this.#events;
    this.#filtersComponent.eventLength = this.#events.length;
  }

  renderTripControls(container) {
    render(container, this.#controlsMainComponent, RenderPosition.AFTERBEGIN);

    render(this.#controlsMainComponent, this.#siteMenuComponent, RenderPosition.BEFOREEND);
    render(this.#controlsMainComponent, this.#filtersComponent, RenderPosition.BEFOREEND);
  }

  renderTripInfo() {
    if (this.#events.length) {
      render(this.#controlsMainComponent, this.#infoComponent, RenderPosition.BEFOREBEGIN);
    }
  }

  renderEvents(container) {
    if (this.#events.length) {
      render(container, this.#eventSorterComponent, RenderPosition.BEFOREEND);
      render(container, this.#eventListComponent, RenderPosition.BEFOREEND);

      for (let i = 0; i < this.#events.length; i++) {
        const event = new EventPresenter(this.#eventListComponent);
        event.init(this.#events[i]);
      }
    } else {
      render(container, new noEventsCompontent(), RenderPosition.BEFOREEND);
    }
  }
}
