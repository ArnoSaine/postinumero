import { Button, Container, Typography } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import { FormattedMessage } from "react-intl";
import { metaIntl } from "@postinumero/remix-react-intl";

export const meta: MetaFunction = (args) => {
  const intl = metaIntl(args);

  if (!intl) {
    return [];
  }
  return [
    {
      title: intl.formatMessage({
        defaultMessage: "New Remix SPA with MUI & FormatJS",
      }),
    },
    {
      name: "description",
      content: intl.formatMessage({
        defaultMessage:
          "Welcome to Remix (SPA Mode) + MUI + FormatJS (react-intl)",
      }),
    },
  ];
};

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Typography py={4} variant="h4">
        <FormattedMessage defaultMessage="Welcome to Remix (SPA Mode) + MUI + FormatJS (react-intl)" />
      </Typography>
      <Button variant="contained">
        <FormattedMessage defaultMessage="Hello!" />
      </Button>
    </Container>
  );
}
