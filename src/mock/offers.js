import { ROUTES, OFFERS } from "../const";
import { getRandomInteger } from "../utils";

const generateOffer = () => {
  const offers = OFFERS;

  const min = 0;
  const max = offers.length - 1;

  return offers[getRandomInteger(min, max)];
};

const getRandomAmountOffers = () => {
  const min = 0;
  const max = 5;

  return Array.from({length: getRandomInteger(min, max)}, generateOffer);
};

const offers = new Map(Array.from(ROUTES, (r) => [r, getRandomAmountOffers()]));

export const generateOffers = (routeType) => {
  return offers.get(routeType);
};