export const SCREEN_READER_MESSAGE_ID = 'date-picker-sr-message';

/**
 * The date-fns `getDay` function returns the day as a number, using
 * a 0-based array where Sunday is at position 0.
 *
 * The DatePicker uses an array with Monday at position 0, so this
 * object re-maps the date-fns day indexes to ours.
 *
 * Note: use the `getDayRemapped` helper instead of date-fns `getDay`
 * function, since the former re-maps the day index.
 */
interface DayIndexRemapping {
  [key: number]: number;
}

export const DAY_INDEX_REMAPPING: DayIndexRemapping = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5
};
