import { metaIntl } from "@postinumero/react-router-formatjs";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

export function meta(args: Route.MetaArgs) {
  const intl = metaIntl(args);

  return [
    {
      title: intl.formatMessage({
        defaultMessage: "New React Router App",
        description: "Home page title",
      }),
    },
    {
      name: "description",
      content: intl.formatMessage({
        defaultMessage: "Welcome to React Router!",
        description: "Home page description",
      }),
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
