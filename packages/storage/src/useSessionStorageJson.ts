import createStateHook from './createStateHook.js';
import storageArea from './sessionStorageJson.js';
import useStorageArea from './useSessionStorageJsonValue.js';

export default createStateHook({ storageArea, useStorageArea });
