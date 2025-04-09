import { cloudinary } from '@/config/cloudinary';

import { bufferToStream } from '@/utils/buffer.to.stream';

/**
 * Uploads a file to Cloudinary.
 *
 * @param {Buffer} fileBuffer - The file buffer to upload.
 * @param {Object} options - Options for the Cloudinary upload.
 * @param {string} options.folder - The folder in Cloudinary where the file will be stored.
 * @param {Object} [options.transformation] - Transformation options for the uploaded file.
 * @returns {Promise<string>} The secure URL of the uploaded file.
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  options: {
    folder: string;
    transformation?: Record<string, unknown>[];
  },
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: 'image',
        overwrite: true,
        transformation: options.transformation,
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      },
    );

    bufferToStream(fileBuffer).pipe(stream);
  });
};
