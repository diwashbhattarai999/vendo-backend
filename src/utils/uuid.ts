import { v4 as uuidv4 } from 'uuid';

export const generateUniqueCode = () => uuidv4().replace(/-/g, '').substring(0, 25);
