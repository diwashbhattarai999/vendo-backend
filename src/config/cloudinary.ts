import { v2 as cloudinary } from 'cloudinary';

import { env } from './env';

cloudinary.config({
  cloud_name: env.cloudinary.CLOUD_NAME,
  api_key: env.cloudinary.API_KEY,
  api_secret: env.cloudinary.API_SECRET,
});

export { cloudinary };
