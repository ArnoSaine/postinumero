import { RawIntlProvider } from "react-intl";
import type { RouteModule } from "../../route.d.ts";
import { useCreateIntl } from "../intl/create.ts";
import { useOptions } from "../options.ts";

type Layout = NonNullable<RouteModule["Layout"]>;

export default function withLayoutIntlProvider(Layout: Layout): Layout {
  return function WithLayoutIntlProvider(props) {
    return (
      <RawIntlProvider value={useCreateIntl(useOptions().intlConfig)}>
        <Layout {...props} />
      </RawIntlProvider>
    );
  };
}
