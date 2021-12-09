import { getRandomInteger } from '../utils/common';
import dayjs from 'dayjs';

export const generateDate = () => {
  const maxDaysGap = 10;
  const maxMinutesGap = 180;

  const start = dayjs()
    .add(getRandomInteger(-maxDaysGap, maxDaysGap), 'day')
    .add(getRandomInteger(-maxMinutesGap, maxMinutesGap), 'minute')
    .toDate();

  const dayAmount = getRandomInteger(0, 1);
  const hourAmount = getRandomInteger(0, 10);
  const minuteAmount = getRandomInteger(0, 60);

  const end = dayjs(start)
    .add(dayAmount, 'day')
    .add(hourAmount, 'hour')
    .add(minuteAmount, 'minute')
    .toDate();

  return { start, end };
};
