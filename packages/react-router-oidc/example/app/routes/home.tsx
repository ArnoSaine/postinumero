import {
  getKeycloakUser,
  HasRealmRole,
  HasResourceRole,
  HasRole,
  IsAuthenticated,
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
      <IsAuthenticated
        fallback={
          <>
            <Welcome />
            <Info>User is not authenticated</Info>
          </>
        }
      >
        <Greeting user={user!} />
        <HasRole foo fallback={<Info>User has no role "foo"</Info>} />
      </IsAuthenticated>
      <HasRole user viewer editor>
        <Info>User has roles "user", "editor" & "viewer"</Info>
      </HasRole>
      <HasRealmRole user viewer>
        <Info>User has realm roles "user" & "viewer"</Info>
      </HasRealmRole>
      <HasResourceRole example-client={["user", "editor"]}>
        <Info>User has "example-client" resource roles "user" & "editor"</Info>
      </HasResourceRole>
    </>
  );
}

function Info(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >,
) {
  return <div className="flex items-center justify-center pb-4" {...props} />;
}

function Welcome() {
  return (
    <div className="flex items-center justify-center text-2xl pb-4">
      Welcome, please log in
    </div>
  );
}

function Greeting({ user }: { user: KeycloakUser }) {
  return (
    <div className="flex items-center justify-center text-2xl pb-4">
      Hi, {user.given_name}!
    </div>
  );
}
