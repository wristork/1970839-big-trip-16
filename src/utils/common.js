import { FilterTypes } from '../const';

export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getFilteredEventsByDate = (events, filterType, relativeDate) => {
  switch(filterType) {
    case FilterTypes.FUTURE:
      events = events.filter((event) => {
        const startDate = event.date.start;
        const endDate = event.date.end;

        if (relativeDate - startDate <= 0 ||
            relativeDate - startDate >= 0 && relativeDate - endDate < 0) {
          return true;
        }

        return false;
      });
      break;
    case FilterTypes.PAST:
      events = events.filter((event) => {
        const startDate = event.date.start;
        const endDate = event.date.end;

        if (relativeDate - endDate > 0 ||
            relativeDate - startDate >= 0 && relativeDate - endDate < 0) {
          return true;
        }

        return false;
      });
      break;
  }

  return events;
};
