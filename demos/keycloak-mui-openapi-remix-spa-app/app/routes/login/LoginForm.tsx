import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Form } from "@remix-run/react";
import { RedirectURIInput } from "~/auth/helpers";

export default function LoginForm() {
  return (
    <>
      <Form replace action="/login" method="POST">
        <TextField required type="text" name="username" />
        <TextField required type="password" name="password" />
        <RedirectURIInput />
        <Button type="submit">Login</Button>
      </Form>
      <Form replace action="/login" method="POST">
        <RedirectURIInput />
        <Button type="submit" name="intent" value="sso">
          Login SSO
        </Button>
      </Form>
    </>
  );
}
