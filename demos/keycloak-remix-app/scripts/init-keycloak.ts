import KcAdminClient from "@keycloak/keycloak-admin-client";

const kcAdminClient = new KcAdminClient({ baseUrl: "http://127.0.0.1:8080" });

await kcAdminClient.auth({
  username: "admin",
  password: "admin",
  grantType: "password",
  clientId: "admin-cli",
});

if (await kcAdminClient.realms.findOne({ realm: "demo" })) {
  await kcAdminClient.realms.del({ realm: "demo" });
}

await kcAdminClient.realms.create({
  realm: "demo",
  enabled: true,
  roles: { realm: [{ name: "admin" }] },
  clients: [
    {
      clientId: "demo",
      publicClient: true,
      directAccessGrantsEnabled: true,
      redirectUris: ["*"],
      webOrigins: ["*"],
    },
  ],
  users: [
    {
      username: "demo",
      firstName: "Firstname",
      lastName: "Lastname",
      enabled: true,
      credentials: [{ temporary: false, type: "password", value: "demo" }],
      realmRoles: ["admin"],
    },
  ],
});
