import { ROUTES, OFFERS } from '../const';
import { getRandomInteger } from '../utils/common';

const generateOffer = () => {
  const min = 0;
  const max = OFFERS.length - 1;

  const offer = OFFERS[getRandomInteger(min, max)];

  return {
    name: offer.name,
    text: offer.text,
    price: offer.price,
    isChecked: Boolean(getRandomInteger(0, 1))
  };
};

const getRandomAmountOffers = () => {
  const min = 0;
  const max = 5;

  return Array.from({length: getRandomInteger(min, max)}, generateOffer);
};

const routeOffers = new Map(ROUTES.map((routeName) => [routeName, getRandomAmountOffers()]));

export const generateOffers = (routeType = ROUTES[0]) => routeOffers.get(routeType);
