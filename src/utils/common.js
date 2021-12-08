export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
