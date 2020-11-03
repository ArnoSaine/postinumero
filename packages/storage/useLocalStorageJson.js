import createStateHook from './createStateHook';
import storageArea from './localStorageJson';
import useStorageArea from './useLocalStorageJsonValue';

export default createStateHook({ storageArea, useStorageArea });
