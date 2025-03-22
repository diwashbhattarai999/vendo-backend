import { Router } from 'express';

import {
  fileUploadExampleHandler,
  localizationTestHandler,
  metricsExampleHandler,
  sendEmailExampleHandler,
  slowDownExampleHandler,
  verifyApiKeyHandler,
} from '@/controllers/example.controller';

import { upload } from '@/middlewares/multer';
import { validateSchema } from '@/middlewares/schema.validation';
import { slowDownApi } from '@/middlewares/slow.down.api';
import { verifyApiKey } from '@/middlewares/verify.api.key';

import { metricsSchema, sendEmailSchema } from '@/schema/example.schema';

const exampleRouter = Router();

exampleRouter.post('/send-email', validateSchema(sendEmailSchema), sendEmailExampleHandler);
exampleRouter.post('/file-upload', upload.single('file'), fileUploadExampleHandler);

exampleRouter.get('/slow-down', slowDownApi, slowDownExampleHandler);
exampleRouter.get('/api-key', verifyApiKey, verifyApiKeyHandler);
exampleRouter.get('/localization', localizationTestHandler);
exampleRouter.get('/metrics', validateSchema(metricsSchema), metricsExampleHandler);

export { exampleRouter };
