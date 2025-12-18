import { asyncUserManager } from "../manager.ts";

export default async function getUser() {
  const userManager = await asyncUserManager.promise;

  return userManager.getUser();
}
