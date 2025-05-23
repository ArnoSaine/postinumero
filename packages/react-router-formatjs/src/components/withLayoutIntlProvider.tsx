import { RawIntlProvider } from "react-intl";
import { useCreateIntl } from "../intl/create.ts";
import { useOptions } from "../options.ts";
import type { Layout as LayoutComponent } from "/app/root";

type Layout = NonNullable<typeof LayoutComponent>;

export default function withLayoutIntlProvider(Layout: Layout): Layout {
  return function WithLayoutIntlProvider(props) {
    return (
      <RawIntlProvider value={useCreateIntl(useOptions().intlConfig)}>
        <Layout {...props} />
      </RawIntlProvider>
    );
  };
}
