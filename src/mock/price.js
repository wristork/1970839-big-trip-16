import { getRandomInteger } from '../utils';

export const generatePrice = (min = 50, max = 300) => getRandomInteger(min, max);
