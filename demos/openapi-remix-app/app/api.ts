import { Configuration, PetApi } from "../.api";

export const petApi = new PetApi(
  new Configuration({
    // accessToken: async () => {
    //   return "Bearer <access token>";
    // },
  })
);
