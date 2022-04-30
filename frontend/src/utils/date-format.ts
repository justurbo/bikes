import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

export const formatUnixTimestamp = (timestamp: string) =>
  dayjs.unix(parseInt(timestamp, 10)).format('MMM Do, YYYY');
