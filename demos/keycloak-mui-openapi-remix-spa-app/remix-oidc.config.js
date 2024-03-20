import defineConfig from "@postinumero/remix-oidc/lib/defineConfig.js";
import { WebStorageStateStore } from "oidc-client-ts";

export default defineConfig({
  getUserManagerSettings: () => ({
    authority: "http://localhost:8080/realms/demo",
    client_id: "demo",
    userStore: new WebStorageStateStore({ store: localStorage }),
    redirect_uri: location.href,
  }),
});
