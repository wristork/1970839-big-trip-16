import { generateEvent } from './mock/event';

import TripPresenter from './presenter/trip-presenter';

import EventsModel from './model/events-model';

const EVENTS_AMOUNT = 20;

const events = Array.from({length: EVENTS_AMOUNT}, generateEvent);

const eventsModel = new EventsModel();
eventsModel.events = events;

const tripPresenter = new TripPresenter({
  controls: document.querySelector('.trip-main'),
  eventList: document.querySelector('.trip-events'),
  eventsModel
});

tripPresenter.init();
tripPresenter.renderTripControls();
tripPresenter.renderEventList();
tripPresenter.renderTripInfo();
