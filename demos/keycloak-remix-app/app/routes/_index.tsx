import type { MetaFunction } from "@remix-run/node";
import keycloak from "~/keycloak";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      {keycloak?.authenticated ? (
        <button
          onClick={() => {
            keycloak?.logout();
          }}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => {
            keycloak?.login();
          }}
        >
          Login
        </button>
      )}
    </div>
  );
}
