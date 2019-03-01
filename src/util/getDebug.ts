import { debug } from 'debug';

export const getDebug = (name: string = 'cloud') => {
  return debug(name);
};
