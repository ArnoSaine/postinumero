import { userManager } from "@postinumero/remix-oidc/lib";
import { Configuration, PetApi } from "../.api";

export const petApi = new PetApi(
  new Configuration({
    accessToken: async () => {
      const user = await (await userManager)?.getUser();

      return user
        ? `Bearer ${user.access_token}`
        : (undefined as unknown as string);
    },
  }),
);
