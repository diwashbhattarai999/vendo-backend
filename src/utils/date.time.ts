import { add } from 'date-fns';

/**
 * Constant representing one day in milliseconds.
 */
export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Calculates the date 30 days from now.
 *
 * @returns {Date} A `Date` object representing 30 days from the current time.
 */
export const thirtyDaysFromNow = (): Date => new Date(Date.now() + 30 * ONE_DAY_IN_MS);

/**
 * Calculates the date and time 45 minutes from now.
 *
 * @returns {Date} A `Date` object representing 45 minutes from the current time.
 */
export const fortyFiveMinutesFromNow = (): Date => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 45);
  return now;
};

/**
 * Calculates the date and time 10 minutes ago.
 *
 * @returns {Date} A `Date` object representing 10 minutes before the current time.
 */
export const tenMinutesAgo = (): Date => new Date(Date.now() - 10 * 60 * 1000);

/**
 * Calculates the date and time 3 minutes ago.
 *
 * @returns {Date} A `Date` object representing 3 minutes before the current time.
 */
export const threeMinutesAgo = (): Date => new Date(Date.now() - 3 * 60 * 1000);

/**
 * Calculates the date and time 1 hour from now.
 *
 * @returns {Date} A `Date` object representing 1 hour from the current time.
 */
export const anHourFromNow = (): Date => new Date(Date.now() + 60 * 60 * 1000);

/**
 * Calculates an expiration date based on a given duration string.
 *
 * The duration string must be in the format of `<number><unit>`, where:
 * - `<number>` is a positive integer.
 * - `<unit>` is one of the following:
 *   - `m` for minutes
 *   - `h` for hours
 *   - `d` for days
 *
 * Examples:
 * - "15m" for 15 minutes
 * - "1h" for 1 hour
 * - "2d" for 2 days
 *
 * @param {string} [expiresIn='15m'] - The duration string specifying the expiration time.
 * @returns {Date} A `Date` object representing the calculated expiration time.
 * @throws {Error} If the format of the `expiresIn` string is invalid or the unit is unsupported.
 */
export const calculateExpirationDate = (expiresIn: string = '15m'): Date => {
  // Match the format `<number><unit>` (e.g., "15m", "1h", "2d")
  const match = expiresIn.match(/^(\d+)([mhd])$/);
  if (!match) {
    throw new Error('Invalid format. Use "15m", "1h", or "2d".');
  }

  const [, value, unit] = match as [string, string, string];
  const expirationDate = new Date();

  // Apply the appropriate time unit to the current date
  switch (unit) {
    case 'm': // Minutes
      return add(expirationDate, { minutes: parseInt(value, 10) });
    case 'h': // Hours
      return add(expirationDate, { hours: parseInt(value, 10) });
    case 'd': // Days
      return add(expirationDate, { days: parseInt(value, 10) });
    default:
      throw new Error('Invalid unit. Use "m", "h", or "d".');
  }
};
