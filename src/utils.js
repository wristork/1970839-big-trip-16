export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// TODO: удалить, поскольку не используется
export const getFormattedDateFromMinute = (minuteDiff) => {
  let hourDiff = Math.floor(minuteDiff / 60);
  let dayDiff = Math.floor(hourDiff / 24);

  let minute = minuteDiff - (hourDiff * 60);
  let hour = hourDiff - (dayDiff * 24);
  let day = dayDiff;

  const dayFormatted = String(day).padStart(2, '0');
  const hourFormatted = String(hour).padStart(2, '0');
  const minuteFormatted = String(minute).padStart(2, '0');

  return {day: dayFormatted, hour: hourFormatted, minute: minuteFormatted};
};