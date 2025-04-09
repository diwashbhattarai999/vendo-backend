import { Readable } from 'stream';

/**
 * Converts a Buffer to a Readable Stream
 * It creates a Readable stream from a Buffer object.
 * The stream can be used to read the data in chunks.
 * This is useful when you want to process the data in a streaming manner
 * instead of loading the entire Buffer into memory at once.
 */
export const bufferToStream = (buffer: Buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};
