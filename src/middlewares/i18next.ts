import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

import { logger } from '@/services/winston.logger';

i18next
  .use(Backend) // Load translations from file system
  .use(middleware.LanguageDetector) // Detect language from request
  .init({
    fallbackLng: 'en', // Default language if no match found
    preload: ['en', 'ne'], // Load these languages on startup
    ns: ['translation', 'auth', 'error'], // list of Namespace (useful for modular translations)
    defaultNS: 'translation', // Default namespace
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json', // Translation files path
    },
    detection: {
      order: ['querystring', 'cookie', 'header'], // Where to look for language (Priority order)
      lookupQuerystring: 'lng', // Query parameter name, e.g., ?lng=ne
      lookupCookie: 'i18next', // Cookie name where the language is stored
      lookupHeader: 'accept-language', // Header to look for language
      caches: ['cookie'], // Cache language in cookies
    },
    interpolation: {
      escapeValue: true, // Escape HTML (XSS protection) (make it false if you need to render HTML)
      format: (value, format) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        return value;
      },
      defaultVariables: { appName: 'ExpressTemplate' }, // Global variables
      skipOnVariables: true, // removes keys if variables are missing.
    },
  })
  .then(() => {
    logger.info('i18next initialized');
  })
  .catch((error) => {
    logger.error('Error initializing i18next:', error);
  });

// Export the middleware handler
const i18nextMiddleware = middleware.handle(i18next);

export { i18nextMiddleware };
