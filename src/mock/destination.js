import { getRandomInteger } from "../utils";
import { DESTINATIONS, DESCRIPTION_SUGGESTIONS } from "../const";

const generateDescription = () => {
  const descriptions = DESCRIPTION_SUGGESTIONS;
  
  const min = 0;
  const max = descriptions.length -1;

  return Array.from({length: getRandomInteger(1, 5)}, () => descriptions[getRandomInteger(min, max)]).join(' ');
};

export const generateDestination = () => {
  const destinations = DESTINATIONS;
  
  const min = 0;
  const max = destinations.length - 1;

  const isHaveDescription = Boolean(getRandomInteger(0, 1));
  const isHaveImages = Boolean(getRandomInteger(0, 1));

  const place = destinations[getRandomInteger(min, max)];
  const description = isHaveDescription ? generateDescription() : '';  
  const images = isHaveImages ? [] : null;

  return {
    place,
    description,
    images,
  };
};