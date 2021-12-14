import { generateEvent } from './mock/event';

import TripPresenter from './presenter/trip-presenter';

const EVENTS_AMOUNT = 20;

const events = Array.from({length: EVENTS_AMOUNT}, generateEvent);
events.sort((a, b) => a.date.start - b.date.start);

const tripPresenter = new TripPresenter();

tripPresenter.init(events);

tripPresenter.renderTripControls(document.querySelector('.trip-main'));
tripPresenter.renderEvents(document.querySelector('.trip-events'));

tripPresenter.renderTripInfo();
