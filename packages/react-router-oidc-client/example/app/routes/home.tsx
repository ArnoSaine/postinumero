import { LoginLink } from "@postinumero/react-router-oidc-client";
import {
  HasRealmRole,
  HasResourceRole,
  HasRole,
  IsAuthenticated,
  useKeycloakUser,
} from "@postinumero/react-router-oidc-client/keycloak";
import options from "@postinumero/react-router-oidc-client/options";
import { Link } from "react-router";

export default function Home() {
  return (
    <>
      <div className="pt-16 pb-4">[Public home route]</div>
      <IsAuthenticated
        fallback={
          <>
            <Welcome />
            <Info>User is not authenticated</Info>
            <Link
              to={options.routes.login}
              className="text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pb-4"
            >
              Login (form)
            </Link>
            <LoginLink
              data={{ intent: "redirect" }}
              className="text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pb-4"
            >
              Login (redirect flow)
            </LoginLink>
            <LoginLink
              data={{
                intent: "redirect",
                "extraQueryParams.kc_idp_hint": "suomi-fi",
              }}
              className="text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login (redirect flow with IDP hint)
            </LoginLink>
          </>
        }
      >
        <Greeting />
        <HasRole foo fallback={<Info>User does not have role "foo"</Info>} />
      </IsAuthenticated>
      <HasRole user viewer editor>
        <Info>User has roles "user", "editor", & "viewer"</Info>
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
  return <div className="pb-4" {...props} />;
}

function Welcome() {
  return <div className="text-2xl pb-4">Welcome, please log in</div>;
}

function Greeting() {
  const user = useKeycloakUser();

  return user && <div className="text-2xl pb-4">Hi, {user.given_name}!</div>;
}
