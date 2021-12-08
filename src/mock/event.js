import { getRandomInteger } from '../utils/common';
import { generatePrice } from './price';
import { generateOffers } from './offers';
import { generateDestination } from './destination';
import { generateRoute } from './route';
import { generateDate } from './date';

export const generateEvent = () => {
  const routeType = generateRoute();
  const isHaveOffer = Boolean(getRandomInteger(0, 1));

  return ({
    date: generateDate(),
    routeType,
    destination: generateDestination(),
    price: generatePrice(),
    offers: isHaveOffer ? generateOffers(routeType) : null,
    isFavorite: Boolean(getRandomInteger(0, 1)),
  });
};
