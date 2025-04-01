import type { Request } from 'express';
import passport, { type PassportStatic } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy, type StrategyOptionsWithRequest } from 'passport-jwt';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import { CustomError } from '@/error/custom.api.error';

import { sanitizeUser } from '@/utils/sanitize.data';

import { getUserById } from '@/services/user.service';

interface JwtPayload {
  userId: string;
  sessionId: string;
}

/**
 * JWT strategy options for Passport.js
 * @type {StrategyOptionsWithRequest}
 */
const options: StrategyOptionsWithRequest = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req: Request) => {
      const t = req.t;

      const accessToken = req.cookies.accessToken;
      if (!accessToken)
        throw new CustomError(STATUS_CODES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, t('jwt.unauthorized_access_token', { ns: 'auth' }));
      return accessToken;
    },
  ]),
  secretOrKey: env.jwt.ACCESS_TOKEN_SECRET,
  audience: ['user'],
  algorithms: ['HS256'],
  passReqToCallback: true,
};

/**
 * Setup JWT strategy for Passport.js
 * @param {PassportStatic} passport - The Passport instance
 */
export const setupJWTStrategy = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(options, async (req, payload: JwtPayload, done) => {
      try {
        const user = await getUserById(payload.userId);
        if (!user) return done(null, false);

        req.sessionId = payload.sessionId;
        return done(null, sanitizeUser(user));
      } catch (error) {
        return done(error, false);
      }
    }),
  );
};

/**
 * Middleware to authenticate JWT tokens using Passport.js
 */
export const authenticateJWT = passport.authenticate('jwt', { session: false });
