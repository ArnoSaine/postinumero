import { asyncUserStorage } from "./asyncLocalStorage.ts";

const getUser = asyncUserStorage.get;

export default getUser;
