import { LoginLink } from "@postinumero/react-router-oidc-client";
import {
  Has,
  HasRealmRole,
  HasResourceRole,
  HasRole,
  IsAuthenticated,
  useKeycloakUser,
} from "@postinumero/react-router-oidc-client/keycloak";

export default function Home() {
  return (
    <>
      <div className="pt-16 pb-4">[Public home route]</div>
      <IsAuthenticated
        fallback={
          <>
            <Welcome />
            <Info>User is not authenticated</Info>
            <LoginLink className="text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pb-4">
              Login (default flow)
            </LoginLink>
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
            {/* <LoginLink
              data={{ intent: "silent" }}
              className="block text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pt-4"
            >
              Login (silent flow)
            </LoginLink>
            <LoginLink
              data={{
                intent: "silent",
                "extraQueryParams.kc_idp_hint": "suomi-fi",
              }}
              className="block text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pt-4"
            >
              Login (silent flow with IDP hint)
            </LoginLink>
            <LoginLink
              data={{ intent: "popup" }}
              className="block text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pt-4"
            >
              Login (popup flow)
            </LoginLink>
            <LoginLink
              data={{
                intent: "popup",
                "extraQueryParams.kc_idp_hint": "suomi-fi",
              }}
              className="block text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pt-4"
            >
              Login (popup flow with IDP hint)
            </LoginLink> */}
            <LoginLink
              data={{
                intent: "resource-owner-credentials",
                username: "demo",
                password: "demo",
              }}
              className="block text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pt-4"
            >
              Login (resource owner credentials flow, not recommended)
            </LoginLink>
            {/* <LoginLink
              data={{
                intent: "resource-owner-credentials",
                "extraQueryParams.kc_idp_hint": "suomi-fi",
              }}
              className="block text-blue-500 underline hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 pt-4"
            >
              Login (resource owner credentials flow with IDP hint)
            </LoginLink> */}
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
        <Info>User has example-client resource roles "user" & "editor"</Info>
      </HasResourceRole>
      <Has role="user">
        <Info>User has role "user"</Info>
      </Has>
      <Has realm-role={["viewer", "foo"]}>
        <Info>User has realm role "viewer" | "foo"</Info>
      </Has>
      <Has example-client-role={["user", "editor", "foo"]}>
        <Info>User has example-client role "user" | "editor" | "foo"</Info>
      </Has>
      <Has
        role="user"
        realm-role={["viewer", "foo"]}
        example-client-role={["user", "editor", "foo"]}
      >
        <Info>
          User has role "user", realm roles "viewer" | "foo", and
          "example-client" roles "user" | "editor" | "foo"
        </Info>
      </Has>
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

  return <div className="text-2xl pb-4">Hi, {user?.given_name}!</div>;
}
