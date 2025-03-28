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
    NODE_ENV: z
      .enum(['development', 'production', 'staging', 'test'], {
        required_error: 'NODE_ENV is required and should be one of "development", "production", "staging", or "test".',
      })
      .refine((val) => !!val, {
        message: 'NODE_ENV is required and should be one of "development", "production", "staging", or "test".',
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
     * The client URL for frontend interactions with the application.
     * Must be a valid URL.
     */
    CLIENT_URL: z
      .string({ required_error: 'CLIENT_URL is required.' })
      .url({ message: 'CLIENT_URL must be a valid URL.' })
      .refine((val) => !!val, { message: 'CLIENT_URL must be a valid URL.' }),

    /**
     * API key for accessing and authenticating the application.
     */
    API_KEY: z.string({ required_error: 'API_KEY is required.' }).refine((val) => !!val, { message: 'API_KEY is required.' }),

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

  twilio: z.object({
    /** Twilio Account SID */
    TWILIO_ACCOUNT_SID: z
      .string({ required_error: 'TWILIO_ACCOUNT_SID is required' })
      .refine((val) => !!val, { message: 'TWILIO_ACCOUNT_SID is required.' }),

    /** Twilio Authentication Token */
    TWILIO_AUTH_TOKEN: z
      .string({ required_error: 'TWILIO_AUTH_TOKEN is required.' })
      .refine((val) => !!val, { message: 'TWILIO_AUTH_TOKEN is required.' }),

    /** Twilio Service SID */
    TWILIO_SERVICE_SID: z
      .string({ required_error: 'TWILIO_SERVICE_SID is required.' })
      .refine((val) => !!val, { message: 'TWILIO_SERVICE_SID is required.' }),
  }),

  sendgrid: z.object({
    /** SendGrid API Key */
    SENDGRID_API_KEY: z
      .string({ required_error: 'SENDGRID_API_KEY is required.' })
      .refine((val) => !!val, { message: 'SENDGRID_API_KEY is required.' }),

    /** Email address used to send emails via SendGrid */
    SENDGRID_FROM_EMAIL: z
      .string({ required_error: 'SENDGRID_FROM_EMAIL is required and must be a valid email address.' })
      .email()
      .refine((val) => !!val, { message: 'SENDGRID_FROM_EMAIL is required and must be a valid email address.' }),
  }),

  template: z.object({
    TEMPLATE_WELCOME: z
      .string({ required_error: 'TEMPLATE_WELCOME is required.' })
      .refine((val) => !!val, { message: 'TEMPLATE_WELCOME is required.' }),
  }),
});

/**
 * Type definition for environment variables as inferred from the `envSchema`.
 * Ensures that the environment variables passed match the validated structure.
 */
export type EnvType = z.TypeOf<typeof envSchema>;
