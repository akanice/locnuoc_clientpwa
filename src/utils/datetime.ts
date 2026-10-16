import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const VN_UTC_OFFSET_HOURS = 7;

export const API_DATETIME_DISPLAY_FORMAT = 'DD/MM/YYYY HH:mm';

export function formatApiDateTime(
  value: string | null | undefined,
  format = API_DATETIME_DISPLAY_FORMAT,
): string {
  if (!value?.trim()) return '';

  const parsed = dayjs.utc(value.trim()).utcOffset(VN_UTC_OFFSET_HOURS);

  if (!parsed.isValid()) return '';

  return parsed.format(format);
}
