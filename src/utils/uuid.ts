import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique token by creating a UUID (v4), removing dashes, and truncating it to 25 characters.
 *
 * This function is useful for generating unique identifiers for tokens, keys, or other purposes
 * where a short, unique string is required.
 *
 * @returns {string} A 25-character unique token.
 */
export const generateUniqueToken = (length: number = 25): string => {
  // Generate a UUID (v4), remove dashes, and truncate to 25 characters
  return uuidv4().replace(/-/g, '').substring(0, length);
};
