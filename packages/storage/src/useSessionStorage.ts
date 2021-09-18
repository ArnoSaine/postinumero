import createStateHook from './createStateHook';
import storageArea from './sessionStorage';
import useStorageArea from './useSessionStorageValue';

export default createStateHook({ storageArea, useStorageArea });
