import dayjs from 'dayjs';

export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getFormattedDate = (date, format) => `${dayjs(date).format(format)}`;

export const isSameMonth = (dateA, dateB) => {
  const monthA = dayjs(dateA).month();
  const monthB = dayjs(dateB).month();

  return monthA === monthB;
};
