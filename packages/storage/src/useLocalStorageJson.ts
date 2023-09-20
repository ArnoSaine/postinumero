import createStateHook from "./createStateHook.js";
import storageArea from "./localStorageJson.js";
import useStorageArea from "./useLocalStorageJsonValue.js";

export default createStateHook({ storageArea, useStorageArea });
