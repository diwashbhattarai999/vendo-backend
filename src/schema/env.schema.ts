import { z } from 'zod';

/**
 * List of values considered as truthy for environment variable validation.
 * Common truthy values include strings like 'true', 't', and '1'.
 */
const TRUTHY_VALUES = ['true', 't', '1'];

/**
 * `envSchema` defines the structure and validation rules for environment variables.
 * This schema ensures that the necessary environment variables are correctly set
 * and in the right format for the application to run properly.
 */
export const envSchema = z.object({
  app: z.object({
    /**
     * The environment in which the application is running.
     * Can be one of "development", "production", "staging", or "test".
     */
    NODE_ENV: z.enum(['development', 'production', 'staging', 'test'], {
      required_error: 'NODE_ENV is required and should be one of "development", "production", "staging", or "test".',
    }),

    /**
     * The port number for the server to listen on.
     * The value is stored as a string but is converted to a number.
     */
    PORT: z
      .string({ required_error: 'PORT is required.' })
      .transform(Number)
      .refine((val) => !isNaN(val), { message: 'PORT must be a valid number.' }),
    /**
     *
     * The logging level to be used by Morgan.
     * @see {@link https://github.com/expressjs/morgan#readme}
     */
    LOG_LEVEL: z.enum(['dev', 'short', 'combined', 'common', 'short', 'tiny']).refine((val) => !!val, {
      message: 'LOG_LEVEL must be one of "dev", "short", "combined", "common", "short", "tiny".',
    }),

    /**
     * The URL for the database connection.
     * Must be a valid URL.
     */
    BASE_URL: z.string({ required_error: 'BASE_URL is required.' }).url({ message: 'BASE_URL must be a valid URL.' }),

    /**
     * The client URL for frontend interactions with the application.
     * Must be a valid URL.
     */
    CLIENT_URL: z.string({ required_error: 'CLIENT_URL is required.' }).url({ message: 'CLIENT_URL must be a valid URL.' }),

    /**
     * API key for accessing and authenticating the application.
     */
    API_KEY: z.string({ required_error: 'API_KEY is required.' }),

    /**
     * Flag to disable the rate limiter if the value is a truthy string (e.g., "true", "1").
     */
    DISABLE_RATE_LIMITER: z
      .string({ required_error: 'DISABLE_RATE_LIMITER is required.' })
      .transform((val) => TRUTHY_VALUES.includes(val.toLowerCase()))
      .refine((val) => typeof val === 'boolean', { message: 'DISABLE_RATE_LIMITER must be a truthy value like "true", "1", or "t".' }),

    /**
     * Flag to disable API key validation in development mode if the value is a truthy string.
     */
    DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT: z
      .string({ required_error: 'DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT is required.' })
      .transform((val) => TRUTHY_VALUES.includes(val.toLowerCase()))
      .refine((val) => typeof val === 'boolean', {
        message: 'DISABLE_VALIDATE_API_KEY_ON_DEVELOPMENT must be a truthy value like "true", "1", or "t".',
      }),
  }),

  resend: z.object({
    /** Resend API Key */
    RESEND_API_KEY: z.string({ required_error: 'RESEND_API_KEY is required.' }),

    /** Email address used to send emails via Resend */
    RESEND_DOMAIN: z.string({ required_error: 'RESEND_DOMAIN is required.' }),
  }),

  jwt: z
    .object({
      /** JWT Access Token Secret */
      ACCESS_TOKEN_SECRET: z.string({ required_error: 'JWT_ACCESS_TOKEN_SECRET is required.' }).min(32, {
        message: 'JWT_ACCESS_TOKEN_SECRET must be at least 32 characters long.',
      }),

      /**
       * Token expiration time, must be a string in the format of "15m", "1h", "2d", etc.
       * The regex checks for a number followed by a single character (s, m, h, d).
       */
      ACCESS_TOKEN_EXPIRES_IN: z.string({ required_error: 'EXPIRES_IN is required.' }).refine(
        (val) => {
          const regex = /^\d+[smhd]$/;
          return regex.test(val);
        },
        { message: 'EXPIRES_IN must be a string like "15m", "1h", "2d", etc.' },
      ),

      /** JWT Refresh Token Secret */
      REFRESH_TOKEN_SECRET: z.string({ required_error: 'JWT_REFRESH_TOKEN_SECRET is required.' }).min(32, {
        message: 'JWT_REFRESH_TOKEN_SECRET must be at least 32 characters long.',
      }),

      /**
       * Token expiration time, must be a string in the format of "15m", "1h", "2d", etc.
       * The regex checks for a number followed by a single character (s, m, h, d).
       */
      REFRESH_TOKEN_EXPIRES_IN: z.string({ required_error: 'REFRESH_EXPIRES_IN is required.' }).refine(
        (val) => {
          const regex = /^\d+[smhd]$/;
          return regex.test(val);
        },
        { message: 'REFRESH_EXPIRES_IN must be a string like "15m", "1h", "2d", etc.' },
      ),
    })
    .strict(),
  oauth: z
    .object({
      /** Google Client ID */
      GOOGLE_CLIENT_ID: z.string({ required_error: 'GOOGLE_CLIENT_ID is required.' }),

      /** Google Client Secret */
      GOOGLE_CLIENT_SECRET: z.string({ required_error: 'GOOGLE_CLIENT_SECRET is required.' }),

      /** Google Redirect URI */
      GOOGLE_REDIRECT_URI: z.string({ required_error: 'GOOGLE_REDIRECT_URI is required.' }),

      /** Google Client Callback URL */
      CLIENT_GOOGLE_CALLBACK_URL: z.string({ required_error: 'CLIENT_GOOGLE_CALLBACK_URL is required.' }),

      /** Facebook Client ID */
      FACEBOOK_CLIENT_ID: z.string({ required_error: 'FACEBOOK_CLIENT_ID is required.' }),

      /** Facebook Client Secret */
      FACEBOOK_CLIENT_SECRET: z.string({ required_error: 'FACEBOOK_CLIENT_SECRET is required.' }),

      /** Facebook Redirect URI */
      FACEBOOK_REDIRECT_URI: z.string({ required_error: 'FACEBOOK_REDIRECT_URI is required.' }),
    })
    .strict(),
});

/**
 * Type definition for environment variables as inferred from the `envSchema`.
 * Ensures that the environment variables passed match the validated structure.
 */
export type EnvType = z.TypeOf<typeof envSchema>;
