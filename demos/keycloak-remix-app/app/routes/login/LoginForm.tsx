import { Form } from "@remix-run/react";
import { RedirectURIInput } from "~/auth/helpers";

export default function LoginForm() {
  return (
    <>
      <Form replace action="/login" method="POST">
        <input required type="text" name="username" />
        <input required type="password" name="password" />
        <RedirectURIInput />
        <button>Login</button>
      </Form>
      <Form replace action="/login" method="POST">
        <RedirectURIInput />
        <button name="intent" value="sso">
          Login SSO
        </button>
      </Form>
    </>
  );
}
