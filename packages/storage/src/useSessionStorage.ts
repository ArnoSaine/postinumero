import createStateHook from './createStateHook.js';
import storageArea from './sessionStorage.js';
import useStorageArea from './useSessionStorageValue.js';

export default createStateHook({ storageArea, useStorageArea });
