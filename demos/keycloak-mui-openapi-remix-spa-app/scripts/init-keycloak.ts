import KcAdminClient from "@keycloak/keycloak-admin-client";
import ProtocolMapperRepresentation from "@keycloak/keycloak-admin-client/lib/defs/protocolMapperRepresentation";

const kcAdminClient = new KcAdminClient({ baseUrl: "http://127.0.0.1:8080" });

await kcAdminClient.auth({
  username: "admin",
  password: "admin",
  grantType: "password",
  clientId: "admin-cli",
});

const realm = "demo";

if (await kcAdminClient.realms.findOne({ realm })) {
  await kcAdminClient.realms.del({ realm });
}

await kcAdminClient.realms.create({
  realm,
  enabled: true,
  roles: { realm: [{ name: "admin" }] },
  users: [
    {
      username: "demo",
      firstName: "John",
      lastName: "Smith",
      attributes: {
        street: "123 Main Street",
        locality: "Anytown",
        region: "Texas",
        postal_code: "12345",
        country: "United States",
      },
      email: "demo@example.com",
      enabled: true,
      credentials: [{ temporary: false, type: "password", value: "demo" }],
      realmRoles: ["admin"],
    },
  ],
});

const client = await kcAdminClient.clients.create({
  realm,
  clientId: "demo",
  publicClient: true,
  // In app username and password login
  directAccessGrantsEnabled: true,
  redirectUris: ["http://localhost:*"],
  webOrigins: ["*"],
});

// Show address in user profile
await updateOptionalToDefaultClientScope({
  realm,
  id: client.id,
  name: "address",
});

// Access token: realm_access.roles --> roles
// await updateProtocolMapper(
//   { realm, clientScopeName: "roles", protocolMapperName: "realm roles" },
//   (mapper) => {
//     mapper.config ??= {};
//     mapper.config["claim.name"] = "roles";
//     return mapper;
//   }
// );

async function updateOptionalToDefaultClientScope({
  realm,
  id,
  name,
}: {
  realm: string;
  id: string;
  name: string;
}) {
  const optionalClientScopes =
    await kcAdminClient.clients.listOptionalClientScopes({
      realm,
      id,
    });

  const clientScopeId = optionalClientScopes.find(
    (optionalClientScope) => optionalClientScope.name === name,
  )!.id!;

  await kcAdminClient.clients.delOptionalClientScope({
    realm,
    id,
    clientScopeId,
  });

  await kcAdminClient.clients.addDefaultClientScope({
    realm,
    id,
    clientScopeId,
  });
}

async function updateProtocolMapper(
  {
    realm,
    clientScopeName,
    protocolMapperName,
  }: { realm: string; clientScopeName: string; protocolMapperName: string },
  updater: (
    mapper: ProtocolMapperRepresentation,
  ) => ProtocolMapperRepresentation,
) {
  const clientScope = (await kcAdminClient.clientScopes.findOneByName({
    realm,
    name: clientScopeName,
  }))!;

  const protocolMapper =
    (await kcAdminClient.clientScopes.findProtocolMapperByName({
      realm,
      id: clientScope.id!,
      name: protocolMapperName,
    }))!;

  await kcAdminClient.clientScopes.updateProtocolMapper(
    {
      realm,
      id: clientScope.id!,
      mapperId: protocolMapper.id!,
    },
    updater(protocolMapper),
  );
}
