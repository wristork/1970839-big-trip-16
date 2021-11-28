import { getRandomInteger } from "../utils";
import { ROUTES } from "../const";

export const generateRoute = () => {
  const routes = ROUTES
  
  const min= 0;
  const max = routes.length - 1;

  return routes[getRandomInteger(min, max)];
};