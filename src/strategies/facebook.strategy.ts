import { Provider } from '@prisma/client';
import type { Request } from 'express';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

import { env } from '@/config/env';

import { ERROR_CODES } from '@/constant/error.codes';
import { STATUS_CODES } from '@/constant/status.codes';

import type { UserWithUserPreferences } from '@/types/user';

import { CustomError } from '@/error/custom.api.error';

import { loginOrCreateAccountService } from '@/services/auth/oauth.service';

passport.use(
  new FacebookStrategy(
    {
      clientID: env.oauth.FACEBOOK_CLIENT_ID,
      clientSecret: env.oauth.FACEBOOK_CLIENT_SECRET,
      callbackURL: env.oauth.FACEBOOK_REDIRECT_URI,
      profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
      passReqToCallback: true,
    },
    async (req: Request, accessToken: string, refreshToken: string, profile, done) => {
      const t = req.t;

      try {
        const { id: facebookId, emails, name, photos } = profile;
        const email = emails?.[0]?.value?.toLowerCase();
        const firstName = name?.givenName || '';
        const lastName = name?.familyName || '';
        const profilePictureUrl = photos?.[0]?.value || '';

        if (!facebookId) throw new CustomError(STATUS_CODES.NOT_FOUND, ERROR_CODES.NOT_FOUND, t('facebook.id_not_found', { ns: 'auth' }));

        // Login or create a user based on the Facebook profile
        const { user } = await loginOrCreateAccountService({
          t,
          provider: Provider.FACEBOOK,
          providerId: facebookId,
          firstName,
          lastName,
          profilePictureUrl,
          email: email || '',
          emailVerified: true,
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
 * Middleware to initialize Passport.js for Facebook authentication.
 * This middleware is used to handle the authentication process.
 */
export const facebookAuthMiddleware = passport.authenticate('facebook', {
  scope: ['email', 'public_profile'],
  session: false,
});

/**
 * Middleware to handle the callback after Facebook authentication.
 * This middleware is used to process the authentication response.
 */
export const facebookAuthCallbackMiddleware = passport.authenticate('facebook', {
  session: false,
  failureRedirect: `${env.oauth.CLIENT_FACEBOOK_CALLBACK_URL}?status=failure`,
  failureFlash: true,
});
