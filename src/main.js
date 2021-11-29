import { renderTemplate, RenderPosition } from './render';
import { createTripInfoTemplate } from './view/info-view';
import { createSiteMenuTemplate } from './view/site-menu-view';
import { createControlsFilterTemplate } from './view/controls-filter-view';
import { createEventSorterTemplate } from './view/event-sorter-view';
import { createEventListTemplate } from './view/event-list-view';
import { createEventTemplate } from './view/event-view';
import { createEditEventTemplate } from './view/edit-event-view';
import { createEmptyMessageTemplate } from './view/event-list-empty';

import { generateEvent } from './mock/event';

const EVENTS_AMOUNT = 20;

const events = Array.from({length: EVENTS_AMOUNT}, generateEvent);

events.sort((a, b) => a.date.start - b.date.start);

const mainControls = document.querySelector('.trip-main');
const mainControlsNav = document.querySelector('.trip-controls__navigation');
const mainControlsFilter = document.querySelector('.trip-controls__filters');

renderTemplate(mainControlsNav, createSiteMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainControlsFilter, createControlsFilterTemplate(), RenderPosition.BEFOREEND);

const eventsContainer = document.querySelector('.trip-events');

if (events.length > 0) {
  renderTemplate(mainControls, createTripInfoTemplate(events), RenderPosition.AFTERBEGIN);

  renderTemplate(eventsContainer, createEventSorterTemplate(), RenderPosition.BEFOREEND);
  renderTemplate(eventsContainer, createEventListTemplate(), RenderPosition.BEFOREEND);

  const eventsList = document.querySelector('.trip-events__list');

  renderTemplate(eventsList, createEditEventTemplate(events[0]), RenderPosition.BEFOREEND);
  for (let i = 1; i < events.length; i++) {
    renderTemplate(eventsList, createEventTemplate(events[i]), RenderPosition.BEFOREEND);
  }
} else {
  renderTemplate(eventsContainer, createEmptyMessageTemplate(), RenderPosition.BEFOREEND);
}
