import { generateEvent } from './mock/event';
import { render, remove, RenderPosition } from './render';
import { MenuItems } from './const';

import TripPresenter from './presenter/trip-presenter';
import ControlsPresenter from './presenter/controls-presenter';

import StatsComponent from './view/stats-view';

import EventsModel from './model/events-model';
import FilterModel from './model/filter-model';

const EVENTS_AMOUNT = 4;

const events = Array.from({length: EVENTS_AMOUNT}, generateEvent);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();

eventsModel.events = events;

const tripPresenter = new TripPresenter(document.querySelector('.trip-events'), eventsModel, filterModel);
const controlsPresenter = new ControlsPresenter(document.querySelector('.trip-controls'), filterModel, eventsModel);

const statsComponent = new StatsComponent();

tripPresenter.init();
tripPresenter.renderEventList();

controlsPresenter.init();
controlsPresenter.renderControls();
controlsPresenter.renderInfo();

const tabsElement = document.querySelector('.trip-tabs');

tabsElement.addEventListener('click', (evt) => {
  evt.preventDefault();

  const { target } = evt;

  if (target.tagName !== 'A') {
    return;
  }

  for (const child of tabsElement.children) {
    child.classList.remove('trip-tabs__btn--active');
  }

  target.classList.add('trip-tabs__btn--active');

  switch(target.textContent.toLowerCase()) {
    case MenuItems.TABLE:
      remove(statsComponent);

      tripPresenter.renderEventList();
      controlsPresenter.renderControls();
      break;

    case MenuItems.STATS:
      tripPresenter.clearEventList();
      controlsPresenter.clearControls();

      render(document.querySelector('.trip-events'), statsComponent, RenderPosition.BEFOREEND);
      statsComponent.renderStats(eventsModel.events);
      break;
  }
});
