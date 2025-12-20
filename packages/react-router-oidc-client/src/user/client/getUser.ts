import { userManager } from "../manager.ts";

export default function getUser() {
  return userManager.getUser();
}
