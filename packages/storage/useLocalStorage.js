import createStateHook from './createStateHook';
import storageArea from './localStorage';
import useStorageArea from './useLocalStorageValue';

export default createStateHook({ storageArea, useStorageArea });
