import { userManager } from "~/auth";
import { Configuration, PetApi } from "../.api";

export const petApi = new PetApi(
  new Configuration({
    accessToken: async () => {
      const user = await userManager.getUser();

      // TODO: refresh exipiring / expired token

      return user
        ? `Bearer ${user.access_token}`
        : (undefined as unknown as string);
    },
  })
);
