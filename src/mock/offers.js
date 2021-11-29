import { ROUTES, OFFERS } from '../const';
import { getRandomInteger } from '../utils';

const generateOffer = () => {
  const offers = OFFERS;

  const min = 0;
  const max = offers.length - 1;

  const offer = offers[getRandomInteger(min, max)];

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

const routeOffers = new Map(Array.from(ROUTES, (routeName) => [routeName, getRandomAmountOffers()]));

export const generateOffers = (routeType) => routeOffers.get(routeType);
