import dayjs from 'dayjs';

export const getFormattedDate = (date, format) => `${dayjs(date).format(format)}`;
