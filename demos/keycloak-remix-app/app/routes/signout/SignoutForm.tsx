import { Form } from "@remix-run/react";
import { RedirectURIInput } from "~/auth/helpers";

export default function SignoutForm() {
  return (
    <Form replace action="/signout" method="POST">
      <RedirectURIInput />
      <button>Sign out</button>
    </Form>
  );
}
