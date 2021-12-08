import { getRandomInteger } from '../utils/common';
import { DESTINATIONS } from '../const';

export const generateDescription = () => {
  const texts = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  ];

  const min = 0;
  const max = texts.length -1;

  return Array.from({length: getRandomInteger(1, 5)}, () => texts[getRandomInteger(min, max)]).join(' ');
};

export const generateImages = () => {
  const length = getRandomInteger(1, 5);
  const path = 'http://picsum.photos/248/152?r=';

  return Array.from({length}, () => `${path}${getRandomInteger(1, 99)}`);
};

export const generateDestination = () => {
  const destinations = DESTINATIONS;

  const min = 0;
  const max = destinations.length - 1;

  const isHaveDescription = Boolean(getRandomInteger(0, 1));
  const isHaveImages = Boolean(getRandomInteger(0, 1));

  const place = destinations[getRandomInteger(min, max)];
  const description = isHaveDescription ? generateDescription() : '';
  const images = isHaveImages ? generateImages() : null;

  return {
    place,
    description,
    images
  };
};
