import createStateHook from './createStateHook.js';
import storageArea from './localStorage.js';
import useStorageArea from './useLocalStorageValue.js';

export default createStateHook({ storageArea, useStorageArea });
