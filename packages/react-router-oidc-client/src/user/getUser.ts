import isServer from "../utils/isServer.ts";
import clientGetUser from "./client/getUser.ts";
import serverGetUser from "./server/getUser.ts";

export default isServer ? serverGetUser : clientGetUser;
