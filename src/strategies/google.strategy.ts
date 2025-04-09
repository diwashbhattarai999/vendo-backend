import { Provider } from '@prisma/client';
import type { Request } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import type { UserWithUserPreferences } from '@/types/user';

import { CustomError } from '@/error/custom.api.error';

import { loginOrCreateAccountService } from '@/services/auth/oauth.service';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.oauth.GOOGLE_CLIENT_ID,
      clientSecret: env.oauth.GOOGLE_CLIENT_SECRET,
      callbackURL: env.oauth.GOOGLE_REDIRECT_URI,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (req: Request, accessToken: string, refreshToken: string, profile, done) => {
      const t = req.t;

      try {
        const { email, sub: googleId, picture } = profile._json;
        if (!googleId) throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.NOT_FOUND, t('google.id_not_found', { ns: 'auth' }));

        // Login or create a user based on the Google profile
        const { user } = await loginOrCreateAccountService({
          t,
          provider: Provider.GOOGLE,
          providerId: googleId,
          firstName: profile.name?.givenName || profile.displayName,
          lastName: profile.name?.familyName || '',
          profilePictureUrl: picture || profile.photos?.[0]?.value || '',
          email: email || profile.emails?.[0]?.value?.toLowerCase() || '',
          emailVerified: profile.emails?.[0]?.verified || false,
          accessToken,
          refreshToken,
        });

        done(null, user as UserWithUserPreferences);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

/**
 * Middleware to initialize Passport.js for Google authentication.
 * This middleware is used to handle the authentication process.
 */
export const googleAuthMiddleware = passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
});

/**
 * Middleware to handle the callback after Google authentication.
 * This middleware is used to process the authentication response.
 */
export const googleAuthCallbackMiddleware = passport.authenticate('google', {
  session: false,
  failureRedirect: `${env.oauth.CLIENT_GOOGLE_CALLBACK_URL}?status=failure`,
  failureFlash: true,
});
