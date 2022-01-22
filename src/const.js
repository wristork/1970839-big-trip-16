export const ROUTES = [
  'check-in', 'sightseeing', 'restaurant',
  'taxi', 'bus', 'train',
  'ship', 'drive', 'flight',
];

export const DESTINATIONS = [
  'Geneva',
  'Amsterdam',
  'Chamonix',
  'Moscow',
  'Minsk',
  'Kiev',
  'Warsaw',
  'Melbourne',
];

export const OFFERS = [
  {name: 'laggage', text: 'Add laggage', price: 50},
  {name: 'comfort', text: 'Switch to comfort', price: 80},
  {name: 'meal', text: 'Add meal', price: 15},
  {name: 'seats', text: 'Choose seats', price: 5},
  {name: 'train', text: 'Travel by train', price : 40},
];

export const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const MenuItems = {
  TABLE: 'table',
  STATS: 'stats',
  ADD_NEW: 'new event',
};

export const StatisticTypes = {
  TIME: 'time',
  MONEY: 'money',
  TYPE: 'type',
};
