import type { MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useUser } from "~/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const user = useUser();
  const { Form } = useFetcher();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      {user ? (
        <Form action="/logout" method="POST">
          <button>Logout</button>
        </Form>
      ) : (
        <>
          <Form action="/login" method="POST">
            <input required type="text" name="username" />
            <input required type="password" name="password" />
            <button>Login</button>
          </Form>
          <Form action="/login" method="POST">
            <button name="intent" value="sso">
              Login SSO
            </button>
          </Form>
        </>
      )}
    </div>
  );
}
