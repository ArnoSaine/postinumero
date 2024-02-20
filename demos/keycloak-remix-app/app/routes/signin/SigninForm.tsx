import { Form } from "@remix-run/react";
import { RedirectURIInput } from "~/auth/helpers";

export default function SigninForm() {
  return (
    <>
      <Form replace action="/signin" method="POST">
        <input required type="text" name="username" />
        <input required type="password" name="password" />
        <RedirectURIInput />
        <button>Sign in</button>
      </Form>
      <Form replace action="/signin" method="POST">
        <RedirectURIInput />
        <button name="intent" value="sso">
          Sign in SSO
        </button>
      </Form>
    </>
  );
}
