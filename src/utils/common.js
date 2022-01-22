import { FilterTypes } from '../const';

export const getFilteredEventsByDate = (events, filterType, relativeDate) => {
  switch(filterType) {
    case FilterTypes.FUTURE:
      events = events.filter((event) => {
        const endDate = event.date.end;

        return relativeDate - endDate < 0;
      });
      break;
    case FilterTypes.PAST:
      events = events.filter((event) => {
        const startDate = event.date.start;

        return relativeDate - startDate > 0;
      });
      break;
  }

  return events;
};
