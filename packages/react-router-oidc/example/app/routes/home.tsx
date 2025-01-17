import {
  HasRealmRole,
  HasResourceRole,
  IsAuthenticated,
} from "@postinumero/react-router-oidc";
import {
  getKeycloakUser,
  type KeycloakUser,
} from "@postinumero/react-router-oidc/keycloak";
import type { Route } from "./+types/home";

export const clientLoader = async () => {
  const user = await getKeycloakUser();

  return { user };
};

export default function Home({ loaderData: { user } }: Route.ComponentProps) {
  //const user = useKeycloakUser();

  return (
    <>
      <div className="flex items-center justify-center pt-16 pb-4">
        [Public home route]
      </div>
      <IsAuthenticated>
        <Greeting user={user!} />
      </IsAuthenticated>
      <HasRealmRole viewer>
        <div className="flex items-center justify-center pb-4">
          Has realm role "viewer"
        </div>
      </HasRealmRole>
      <HasResourceRole example-client="editor">
        <div className="flex items-center justify-center pb-4">
          Has example-client resource role "editor"
        </div>
      </HasResourceRole>
    </>
  );
}

function Greeting({ user }: { user: KeycloakUser }) {
  return (
    <div className="flex items-center justify-center text-2xl pb-4">
      Hi, {user.given_name}!
    </div>
  );
}
