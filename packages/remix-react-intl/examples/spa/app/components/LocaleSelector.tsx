import LocalePreferenceForm from "@postinumero/remix-react-intl/localePreference/Form";
import { useRouteLoaderData } from "@remix-run/react";
import { PropsWithChildren } from "react";
import { FormattedDisplayName, FormattedMessage } from "react-intl";
import options from "virtual:@postinumero/remix-react-intl/options";
import { clientLoader } from "~/root";

function Button(props: PropsWithChildren<{ value: string }>) {
  // Normally we would use `intl.locale`, but in this case we also need to know
  // if the user has not manually set a locale preference.
  const { localePreference } = useRouteLoaderData<typeof clientLoader>("root")!;

  const isSelected = localePreference === props.value;

  return (
    <button
      style={isSelected ? { fontWeight: "bold" } : undefined}
      name="locale"
      {...props}
    />
  );
}

export default function LocaleSelector() {
  const { defaultLocale } = useRouteLoaderData<typeof clientLoader>("root")!;

  return (
    <LocalePreferenceForm>
      {[
        {
          value: "",
          label: (
            <FormattedMessage
              defaultMessage="Browser Default ({defaultLocale})"
              values={{
                defaultLocale: (
                  <FormattedDisplayName type="language" value={defaultLocale} />
                ),
              }}
            />
          ),
        },
        ...options.locales.map((value) => ({
          value,
          label: <FormattedDisplayName type="language" value={value} />,
        })),
      ].map(({ value, label = value }) => (
        <Button key={value} value={value}>
          {label}
        </Button>
      ))}
    </LocalePreferenceForm>
  );
}
