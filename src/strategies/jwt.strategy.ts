import type { Request } from 'express';
import passport, { type PassportStatic } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, type StrategyOptionsWithRequest } from 'passport-jwt';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { sanitizeUser } from '@/utils/sanitize.data';

import { getUserById } from '@/services/user.service';

/**
 * Interface for the JWT payload.
 */
interface JwtPayload {
  userId: string;
  sessionId: string;
}

/**
 * JWT strategy options for Passport.js.
 * Configures how the JWT is extracted, verified, and processed.
 */
const options: StrategyOptionsWithRequest = {
  /**
   * Extracts the JWT token from the request.
   * Looks for the token in the `accessToken` cookie.
   * If the token is not found, it throws a custom error.
   */
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req: Request) => {
      const t = req.t;

      // Extract the access token from cookies
      const accessToken = req.cookies.accessToken;
      if (!accessToken)
        throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('jwt.unauthorized_access_token', { ns: 'auth' }));
      return accessToken;
    },
  ]),

  /**
   * Secret key used to verify the JWT signature.
   */
  secretOrKey: env.jwt.ACCESS_TOKEN_SECRET,

  /**
   * Audience for the JWT token.
   * Ensures the token is intended for the correct audience.
   */
  audience: ['user'],

  /**
   * Algorithms allowed for verifying the JWT signature.
   */
  algorithms: ['HS256'],

  /**
   * Passes the request object to the callback for additional processing.
   */
  passReqToCallback: true,
};

/**
 * Sets up the JWT strategy for Passport.js.
 *
 * @param {PassportStatic} passport - The Passport instance.
 */
export const setupJWTStrategy = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(options, async (req, payload: JwtPayload, done) => {
      try {
        // Fetch the user by ID from the database
        const user = await getUserById(payload.userId);
        if (!user) return done(null, false); // User not found

        // Attach the session ID to the request object
        req.sessionId = payload.sessionId;

        // Sanitize the user object to remove sensitive fields
        return done(null, sanitizeUser(user));
      } catch (error) {
        // Handle errors during user lookup
        return done(error, false);
      }
    }),
  );
};

/**
 * Middleware to authenticate JWT tokens using Passport.js.
 * Ensures that the request is authenticated before proceeding.
 */
export const authenticateJWT = passport.authenticate('jwt', { session: false });
