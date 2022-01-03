import { generateEvent } from './mock/event';

import TripPresenter from './presenter/trip-presenter';
import ControlsPresenter from './presenter/controls-presenter';

import EventsModel from './model/events-model';
import FilterModel from './model/filter-model';

const EVENTS_AMOUNT = 4;

const events = Array.from({length: EVENTS_AMOUNT}, generateEvent);

const eventsModel = new EventsModel();
const filterModel = new FilterModel();

eventsModel.events = events;

const tripPresenter = new TripPresenter(document.querySelector('.trip-events'), eventsModel, filterModel);
const controlsPresenter = new ControlsPresenter(document.querySelector('.trip-main'), filterModel, eventsModel);

tripPresenter.init();
tripPresenter.renderEventList();

controlsPresenter.init();
controlsPresenter.renderControls();
controlsPresenter.renderInfo();