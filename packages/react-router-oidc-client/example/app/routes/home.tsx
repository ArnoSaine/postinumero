import { LoginLink } from "@postinumero/react-router-oidc-client";
import {
  getKeycloakUser,
  HasRealmRole,
  HasResourceRole,
  HasRole,
  IsAuthenticated,
  type KeycloakUser,
} from "@postinumero/react-router-oidc-client/keycloak";
import type { Route } from "./+types/home.js";
import { Link } from "react-router";

export const clientLoader = async () => {
  const user = await getKeycloakUser();

  return { user };
};

export default function Home({ loaderData: { user } }: Route.ComponentProps) {
  //const user = useKeycloakUser();

  return (
    <>
      <div className="pt-16 pb-4">[Public home route]</div>
      <IsAuthenticated
        fallback={
          <>
            <Welcome />
            <Info>User is not authenticated</Info>
            <Link
              to="/login"
              className="text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pb-4"
            >
              Login (form)
            </Link>
            <LoginLink
              data={{
                intent: "redirect",
                "extraQueryParams.kc_idp_hint": "suomi-fi",
              }}
              className="text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login (redirect flow)
            </LoginLink>
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
        <Info>
          User has <em>realm</em> roles "user" & "viewer"
        </Info>
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
  return <div className="pb-4" {...props} />;
}

function Welcome() {
  return <div className="text-2xl pb-4">Welcome, please log in</div>;
}

function Greeting({ user }: { user: KeycloakUser }) {
  return <div className="text-2xl pb-4">Hi, {user.given_name}!</div>;
}
