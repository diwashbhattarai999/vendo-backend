import multer from 'multer';

/**
 *  Hi folks! 👋
 *
 *  In this middleware of multer, we are using the memory storage
 *  for storing the file in memory (buffer).
 *
 *  You can go through documentation for your best suit.
 *  for more info visit https://www.npmjs.com/package/multer#storage
 */

const storage = multer.memoryStorage();
const upload = multer({ storage });

export { upload };
