import { callbackify } from 'util';

export default (Class, names) => {
  const { prototype } = Class;

  for (const name of names) {
    const fn = prototype[name];
    prototype[name] = callbackify(fn);
  }

  return Class;
};
