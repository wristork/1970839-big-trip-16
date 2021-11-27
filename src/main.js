import { renderTemplate, RenderPosition } from './render';
import { createTripInfoTemplate } from './view/info-view';
import { createSiteMenuTemplate } from './view/site-menu-view';
import { createControlsFilterTemplate } from './view/controls-filter-view';
import { createEventSorterTemplate } from './view/event-sorter-view';
import { createEventListTemplate } from './view/event-list-view';
import { createEventItemTemplate } from './view/event-item-view';
import { createEditPointTemplate } from './view/edit-point-view';

const mainControls = document.querySelector('.trip-main');
const mainControlsNav = document.querySelector('.trip-controls__navigation');
const mainControlsFilter = document.querySelector('.trip-controls__filters');

renderTemplate(mainControls, createTripInfoTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(mainControlsNav, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainControlsFilter, createControlsFilterTemplate(), RenderPosition.BEFOREEND);

const eventsContainer = document.querySelector('.trip-events');

renderTemplate(eventsContainer, createEventSorterTemplate(), RenderPosition.BEFOREEND);
renderTemplate(eventsContainer, createEventListTemplate(), RenderPosition.BEFOREEND);

const eventsList = document.querySelector('.trip-events__list');

const EVENTS_AMOUNT = 3;

for (let i = 0; i < EVENTS_AMOUNT; i++) {
  renderTemplate(eventsList, createEventItemTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(eventsList, createEditPointTemplate(), RenderPosition.AFTERBEGIN);
