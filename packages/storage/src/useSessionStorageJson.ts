import createStateHook from './createStateHook';
import storageArea from './sessionStorageJson';
import useStorageArea from './useSessionStorageJsonValue';

export default createStateHook({ storageArea, useStorageArea });
