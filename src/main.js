import { generateEvent } from './mock/event';

import TripPresenter from './presenter/trip-presenter';

const EVENTS_AMOUNT = 20;

const events = Array.from({length: EVENTS_AMOUNT}, generateEvent);
events.sort((a, b) => a.date.start - b.date.start);

const tripPresenter = new TripPresenter({
  controls: document.querySelector('.trip-main'),
  eventList: document.querySelector('.trip-events')
});

tripPresenter.init(events);

tripPresenter.renderTripControls();
tripPresenter.renderEventList();

tripPresenter.renderTripInfo();
