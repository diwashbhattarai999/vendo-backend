import multer from 'multer';

const DEFAULT_MAX_FILE_SIZE_MB = 5;
const DEFAULT_ACCEPTABLE_EXTENSIONS = ['png', 'jpg', 'jpeg'];

type UploadMiddlewareOptions = {
  maxFileSizeMB?: number;
  acceptableExtensions?: string[];
};

/**
 * Creates a multer upload middleware with configurable options.
 *
 * @see https://www.npmjs.com/package/multer
 */
export const createUploadMiddleware = ({
  maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
  acceptableExtensions = DEFAULT_ACCEPTABLE_EXTENSIONS,
}: UploadMiddlewareOptions = {}) => {
  // Convert max file size from MB to bytes
  const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxFileSizeBytes },
    fileFilter: (req, file, callback) => {
      const t = req.t;

      // Check if the file extension is valid
      const isValidExtension = acceptableExtensions.some((extension) => file.originalname.toLowerCase().endsWith(`.${extension}`));

      // If the file extension is not valid, return an error
      if (!isValidExtension)
        return callback(new Error(t('file.upload.invalid_extension', { ns: 'error', extensions: acceptableExtensions.join(', ') })));

      // If the file extension is valid, proceed with the upload
      callback(null, true);
    },
  });
};
