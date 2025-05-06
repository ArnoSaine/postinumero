import { DEFAULT_INTL_CONFIG } from "react-intl/src/utils.js";
import { IntlProvider } from "react-intl";
import { useLoaderData } from "react-router";
import type { RouteModule } from "../../route.js";
import { cache, handleError } from "../intl/create.ts";

type Layout = NonNullable<RouteModule["Layout"]>;

export default function withLayoutIntlProvider(Layout: Layout): Layout {
  return function WithLayoutIntlProvider(props) {
    const { intl: intlConfig } = useLoaderData() ?? {};

    return (
      <IntlProvider
        cache={cache}
        onError={handleError}
        locale={DEFAULT_INTL_CONFIG.defaultLocale}
        messages={DEFAULT_INTL_CONFIG.messages}
        {...intlConfig}
      >
        <Layout {...props} />
      </IntlProvider>
    );
  };
}
