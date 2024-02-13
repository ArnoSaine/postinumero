import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useMatch } from "@remix-run/react";
import { useUser } from "~/auth";
import LogoutForm from "~/routes/logout/LogoutForm";
import Copyright from "./Copyright";
import ProTip from "./ProTip";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Keycloak + MUI + OpenAPI + Remix SPA in TypeScript example
        </Typography>
        <UserInfo />
        {children}
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}

function UserInfo() {
  const user = useUser();
  const login = useMatch("/login");

  return user ? (
    <>
      <div>Logged in: {user.profile.name}</div>
      <LogoutForm />
    </>
  ) : login ? null : (
    <Link
      href={`/login?${new URLSearchParams({
        redirect_uri: location.href,
      })}`}
    >
      Login
    </Link>
  );
}
