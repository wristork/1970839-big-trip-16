import { render, RenderPosition } from './render';
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

  render(container, control.element, RenderPosition.AFTERBEGIN);

  render(control.element, new SiteMenuComponent().element, RenderPosition.BEFOREEND);
  render(control.element, new FiltersCompontent(events).element, RenderPosition.BEFOREEND);

  if (events.length) {
    render(control.element, new InfoComponent(events).element, RenderPosition.BEFOREBEGIN);
  }
};

const renderEvent = (container, event) => {
  const editEventComponent = new EditEventComponent(event);
  const eventComponent = new EventComponent(event);

  const replaceToEdit = () => {
    container.replaceChild(editEventComponent.element, eventComponent.element);
  };

  const replaceToNormal = () => {
    container.replaceChild(eventComponent.element, editEventComponent.element);
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

  render(container, eventComponent.element, RenderPosition.BEFOREEND);
};

const renderEvents = (container) => {
  if (events.length) {
    const eventsList = new EventListComponent();

    render(container, new EventSorterComponent().element, RenderPosition.BEFOREEND);
    render(container, eventsList.element, RenderPosition.BEFOREEND);

    for (let i = 0; i < EVENTS_AMOUNT; i++) {
      renderEvent(eventsList.element, events[i]);
    }
  } else {
    render(container, new noEventsCompontent().element, RenderPosition.BEFOREEND);
  }
};

renderControls(document.querySelector('.trip-main'));
renderEvents(document.querySelector('.trip-events'));
