import passport from 'passport';

import { setupJWTStrategy } from '@/strategies/jwt.strategy';

/**
 * Initialize Passport with JWT strategy.
 * This function sets up the JWT strategy for authentication.
 * It extracts the JWT from the request and verifies it using the secret key.
 * If the token is valid, it retrieves the user from the database and attaches it to the request object.
 * If the token is invalid, it returns an error.
 */
const intializePassport = () => setupJWTStrategy(passport);

// Initialize Passport with JWT strategy
intializePassport();

// Export the initialized Passport instance
export { passport };
