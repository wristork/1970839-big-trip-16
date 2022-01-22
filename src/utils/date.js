import dayjs from 'dayjs';

export const getFormattedDate = (date, format) => `${dayjs(date).format(format)}`;

export const getFormattedEventDuration = (startDate, endDate) => {
  startDate = dayjs(startDate);
  endDate = dayjs(endDate);

  const dayDiff = endDate.diff(startDate, 'day');
  const hourDiff = endDate.diff(startDate, 'hour');
  const minuteDiff = endDate.diff(startDate, 'minute');

  const day = String(dayDiff).padStart(2, '0');
  const hour = String(hourDiff - (dayDiff * 24)).padStart(2, '0');
  const minute = String(minuteDiff - (hourDiff * 60)).padStart(2, '0');

  if (dayDiff) {
    return `${day}D ${hour}H ${minute}M`;
  } else if (hourDiff) {
    return `${hour}H ${minute}M`;
  } else {
    return `${minute}M`;
  }
};
