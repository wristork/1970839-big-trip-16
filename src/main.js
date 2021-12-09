import { render, replace, RenderPosition } from './render';
import { generateEvent } from './mock/event';

import SiteMenuComponent from './view/site-menu-view';
import ControlsMainComponent from './view/controls-main-view';
import InfoComponent from './view/info-view';
import FiltersCompontent from './view/filters';
import EventSorterComponent from './view/event-sorter-view';
import EventListComponent from './view/event-list-view';
import EventComponent from './view/event-view';
import EditEventComponent from './view/edit-event-view';
import noEventsCompontent from './view/no-events-view';

const EVENTS_AMOUNT = 20;

const events = Array.from({length: EVENTS_AMOUNT}, generateEvent);
events.sort((a, b) => a.date.start - b.date.start);

const renderControls = (container) => {
  const control = new ControlsMainComponent();

  render(container, control, RenderPosition.AFTERBEGIN);

  render(control, new SiteMenuComponent(), RenderPosition.BEFOREEND);
  render(control, new FiltersCompontent(events), RenderPosition.BEFOREEND);

  if (events.length) {
    render(control, new InfoComponent(events), RenderPosition.BEFOREBEGIN);
  }
};

const renderEvent = (container, event) => {
  const editEventComponent = new EditEventComponent(event);
  const eventComponent = new EventComponent(event);

  const replaceToNormal = () => {
    replace(container, eventComponent, editEventComponent);
  };

  const replaceToEdit = () => {
    replace(container, editEventComponent, eventComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceToNormal();

      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.addEditStateClickHandler(() => {
    replaceToEdit();

    document.addEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.addNormalStateClickHandler(() => {
    replaceToNormal();

    document.removeEventListener('keydown', onEscKeyDown);
  });

  editEventComponent.addFormSubmitHandler((evt) => {
    evt.preventDefault();

    replaceToNormal();
  });

  render(container, eventComponent, RenderPosition.BEFOREEND);
};

const renderEvents = (container) => {
  if (events.length) {
    const eventsList = new EventListComponent();

    render(container, new EventSorterComponent(), RenderPosition.BEFOREEND);
    render(container, eventsList, RenderPosition.BEFOREEND);

    for (let i = 0; i < EVENTS_AMOUNT; i++) {
      renderEvent(eventsList, events[i]);
    }
  } else {
    render(container, new noEventsCompontent(), RenderPosition.BEFOREEND);
  }
};

renderControls(document.querySelector('.trip-main'));
renderEvents(document.querySelector('.trip-events'));
