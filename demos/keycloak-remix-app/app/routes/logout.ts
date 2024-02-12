import { userManager } from "~/auth";

export const clientAction = async () => {
  await userManager.revokeTokens();
  await userManager.removeUser();

  return null;
};
