import {
  addDays,
  closestTo,
  eachDayOfInterval,
  endOfWeek,
  format,
  getDay,
  isAfter,
  isBefore,
  isEqual,
  isFuture,
  isToday,
  isWithinInterval,
  startOfWeek,
  getYear,
  getMonth,
  getDate
} from 'date-fns';
import { DAY_INDEX_REMAPPING } from '../constants';

interface DateParams {
  date: Date;
  minDate?: Date;
  maxDate?: Date;
  excludeDates?: Date[];
  includeDates?: Date[];
}

const getDateWithoutTime = (date: Date) =>
  new Date(getYear(date), getMonth(date), getDate(date));

// Return `min` if the given `date` doesn't fall within the range
const getDateOrMinFromRange = (date: Date, min: Date, max: Date): Date =>
  isWithinInterval(date, { start: min, end: max }) ? date : min;

// Return `min` if the given `date` comes before it
const getDateOrMin = (date: Date, min: Date): Date =>
  isEqualDate(date, min) || isAfterDate(date, min) ? date : min;

/**
 * Return the closest date to the given `date` that doesn't
 * appear in the `blacklist`.
 */
const getFirstDateNotBlacklisted = (date: Date, blacklist: Date[]): Date => {
  let d = date;

  // Increment the date until we find one that's not blacklisted
  while (!!blacklist.find(bDate => isEqualDate(d, bDate))) {
    d = addDays(d, 1);
  }

  return d;
};

/**
 * Wraps the date-fns `isEqual` function to compare date equality
 * without factoring in time.
 */
export const isEqualDate = (a: Date, b: Date): boolean =>
  isEqual(getDateWithoutTime(a), getDateWithoutTime(b));

/**
 * Wraps the date-fns `isBefore` function to compare dates
 * without factoring in time.
 */
export const isBeforeDate = (a: Date, b: Date): boolean =>
  isBefore(getDateWithoutTime(a), getDateWithoutTime(b));

/**
 * Wraps the date-fns `isAfter` function to compare dates
 * without factoring in time.
 */
export const isAfterDate = (a: Date, b: Date): boolean =>
  isAfter(getDateWithoutTime(a), getDateWithoutTime(b));

/**
 * Return the day of the week, remapped so that Monday
 * is at position 0, rather than Sunday.
 */
export const getDayRemapped = (date: Date): number =>
  DAY_INDEX_REMAPPING[getDay(date)];

export const getWeekDays = (locale?: Locale): string[] => {
  const now = new Date();
  const weekDates = eachDayOfInterval({
    start: startOfWeek(now),
    end: endOfWeek(now)
  });

  /**
   * Take the first item in `weekDates` and move it to the last position.
   * This re-orders the days so that Sunday comes last, not first.
   */
  weekDates.push(weekDates[0]);
  weekDates.shift();

  return weekDates.map((date: Date) => format(date, 'EEEEEE', { locale }));
};

/**
 * Determine whether the date passed can be selected by the user.
 * I.e. Whether it should or should not be be marked as `disabled`.
 * A date can be selected if:
 *
 * 1. It is *not* in the past
 * 2. It falls *after* the user-provided `minDate`
 * 3. It falls *before* the user-provided `maxDate`
 * 4. It is *not* included in the user-provided `excludeDates` array
 * 5. It *is* included in the user-provided `includeDates` array
 */
export const dateIsSelectable = ({
  date,
  minDate,
  maxDate,
  excludeDates,
  includeDates
}: DateParams): boolean => {
  const isPast = !isToday(date) && !isFuture(date);
  const isBeforeMinDate = minDate ? isBeforeDate(date, minDate) : false;
  const isAfterMaxDate = maxDate ? isAfterDate(date, maxDate) : false;
  const isExcluded = excludeDates
    ? !!excludeDates.find(d => isEqualDate(date, d))
    : false;
  const isIncluded = includeDates
    ? !!includeDates.find(d => isEqualDate(date, d))
    : true;

  return !isPast &&
    !isBeforeMinDate &&
    !isAfterMaxDate &&
    !isExcluded &&
    isIncluded
    ? true
    : false;
};

/**
 * Determine the closest selectable date to the one given, based on the
 * user-provided values for `minDate`, `maxDate`, `includeDates` & `excludeDates`.
 */
export const getClosestSelectableDate = ({
  date,
  minDate,
  maxDate,
  excludeDates,
  includeDates
}: DateParams): Date => {
  if (minDate && maxDate) {
    return getDateOrMinFromRange(date, minDate, maxDate);
  }

  if (minDate) {
    return getDateOrMin(date, minDate);
  }

  if (includeDates) {
    return closestTo(date, includeDates);
  }

  if (excludeDates) {
    return getFirstDateNotBlacklisted(date, excludeDates);
  }

  return date;
};
