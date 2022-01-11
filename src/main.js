import { render, remove, RenderPosition } from './render';
import { MenuItems, UpdateType, FilterTypes } from './const';

import TripPresenter from './presenter/trip-presenter';
import ControlsPresenter from './presenter/controls-presenter';

import StatsComponent from './view/stats-view';

import EventsModel from './model/events-model';
import FilterModel from './model/filter-model';

import ApiService from './api-service';

const END_POINT = 'https://16.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic 161121jswristork020222';

const newEventButtonElement = document.querySelector('.trip-main__event-add-btn');
const tabsElement = document.querySelector('.trip-tabs');
const statsComponent = new StatsComponent();

const eventsModel = new EventsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(document.querySelector('.trip-events'), eventsModel, filterModel, {
  satellites: { newEventButtonElement }
});
const controlsPresenter = new ControlsPresenter(document.querySelector('.trip-controls'), filterModel, eventsModel);

const resetTabsStates = () => {
  for (const child of tabsElement.children) {
    child.classList.remove('trip-tabs__btn--active');
  }
};

const changeScreen = (value) => {
  switch(value.toLowerCase()) {
    case MenuItems.ADD_NEW:
      resetTabsStates();
      tabsElement.children[0].classList.add('trip-tabs__btn--active');
    case MenuItems.TABLE:
      remove(statsComponent);
      tripPresenter.renderEventList();
      controlsPresenter.renderControls();
      controlsPresenter.redrawInfo();
      break;

    case MenuItems.STATS:
      tripPresenter.clearEventList();
      controlsPresenter.clearControls();
      render(document.querySelector('.trip-events'), statsComponent, RenderPosition.BEFOREEND);
      statsComponent.renderStats(eventsModel.events);
      break;
  }

  newEventButtonElement.removeAttribute('disabled');
};

newEventButtonElement.addEventListener('click', (evt) => {
  const { target } = evt;

  changeScreen(target.textContent);

  filterModel.setFilterType(FilterTypes.EVERYTHING, UpdateType.MAJOR);
  tripPresenter.resetSort();
  tripPresenter.resetEvents();
  tripPresenter.showCreateForm();

  newEventButtonElement.setAttribute('disabled', '');
});

tabsElement.addEventListener('click', (evt) => {
  evt.preventDefault();

  const { target } = evt;

  if (target.tagName !== 'A') {
    return;
  }

  resetTabsStates();

  target.classList.add('trip-tabs__btn--active');

  changeScreen(target.textContent);
});

tripPresenter.init();
tripPresenter.renderEventList();

controlsPresenter.init();

eventsModel.init().finally(() => {
  tripPresenter.renderEventList();
});
