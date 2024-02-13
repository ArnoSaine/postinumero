import Button from "@mui/material/Button";
import { Form } from "@remix-run/react";
import { RedirectURIInput } from "~/auth/helpers";

export default function LogoutForm() {
  return (
    <Form replace action="/logout" method="POST">
      <RedirectURIInput />
      <Button type="submit">Logout</Button>
    </Form>
  );
}
