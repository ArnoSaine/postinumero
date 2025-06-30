import { asyncUserManager } from "@postinumero/react-router-oidc-client";
import { generateKeyPair, SignJWT } from "jose";
import { http, HttpResponse } from "msw";
import { users } from "../../../keycloak/main-realm-export.json";

const alg = "RS256";
const { privateKey } = await generateKeyPair(alg);

const {
  settings: { authority },
} = await asyncUserManager.promise;

export const handlers = [
  http.post(
    `${authority}/protocol/openid-connect/token`,
    async ({ request }) => {
      const formData = await request.formData();
      const grantType = formData.get("grant_type");
      const username = formData.get("username");
      const password = formData.get("password");

      if (grantType === "password") {
        const user = users.find(
          (user) =>
            username === user.username &&
            user.credentials.some(
              ({ type, value }) => type === "password" && value === password,
            ),
        );
        if (!user) {
          return HttpResponse.json(
            {
              error: "invalid_grant",
              error_description: "Invalid user credentials",
            },
            { status: 401 },
          );
        }

        const profile = {
          realm_access: { roles: user.realmRoles },
          resource_access: Object.fromEntries(
            Object.entries(user.clientRoles).map(([client, roles]) => [
              client,
              { roles },
            ]),
          ),
          name: `${user.firstName} ${user.lastName}`,
          preferred_username: user.username,
          given_name: user.firstName,
          family_name: user.lastName,
          ...user,
        };

        const token = await new SignJWT({
          iss: authority,
          sub: "1234567890",
          profile,
          ...profile,
        })
          .setProtectedHeader({ alg, kid: "test-key-id" })
          .sign(privateKey);

        return HttpResponse.json(
          await {
            access_token: token,
            id_token: token,
          },
        );
      }

      return HttpResponse.json(
        { error: "unsupported_grant_type" },
        { status: 400 },
      );
    },
  ),

  http.get(`${authority}/.well-known/openid-configuration`, () => {
    return HttpResponse.json({
      issuer: authority,
      authorization_endpoint: `${authority}/protocol/openid-connect/auth`,
      token_endpoint: `${authority}/protocol/openid-connect/token`,
      userinfo_endpoint: `${authority}/protocol/openid-connect/userinfo`,
      jwks_uri: `${authority}/protocol/openid-connect/certs`,
      response_types_supported: ["code", "token", "id_token"],
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: [alg],
      scopes_supported: ["openid", "profile", "email"],
      claims_supported: ["sub", "name", "given_name", "family_name", "email"],
    });
  }),
];
