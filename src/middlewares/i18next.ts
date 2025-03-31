import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as i18middleware from 'i18next-http-middleware';

import pkg from '../../package.json';

import { logger } from '@/logger/winston.logger';

i18next
  .use(Backend) // Load translations from file system
  .use(i18middleware.LanguageDetector) // Detect language from request
  .init({
    fallbackLng: 'en', // Default language if no match found
    preload: ['en', 'ne'], // Load these languages on startup
    ns: ['translation', 'error', 'auth'], // list of Namespace (useful for modular translations)
    defaultNS: 'translation', // Default namespace
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json', // Translation files path
    },
    detection: {
      order: ['header'],
      lookupHeader: 'accept-language',
    },
    interpolation: {
      escapeValue: true, // Escape HTML (XSS protection) (make it false if you need to render HTML)
      format: (value, format) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        return value;
      },
      defaultVariables: { appName: pkg.name }, // Global variables
      skipOnVariables: true, // removes keys if variables are missing.
    },
  })
  .then(() => {
    logger.info('✅ i18next initialized successfully');
  })
  .catch((error) => {
    logger.error(`❌ Error initializing i18next: ${error.message}`);
  });

// Export the middleware handler
const i18nextMiddleware = i18middleware.handle(i18next);

export { i18nextMiddleware };
