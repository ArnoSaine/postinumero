import { Form } from "@remix-run/react";
import { RedirectURIInput } from "~/auth/helpers";

export default function LogoutForm() {
  return (
    <Form replace action="/logout" method="POST">
      <RedirectURIInput />
      <button>Logout</button>
    </Form>
  );
}
