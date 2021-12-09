import { getRandomInteger } from '../utils/common';

export const generatePrice = (min = 50, max = 300) => getRandomInteger(min, max);
