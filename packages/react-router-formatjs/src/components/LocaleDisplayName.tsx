import { FormattedDisplayName, FormattedMessage } from "react-intl";

export default function LocaleDisplayName({ value }: { value: string | null }) {
  return value ? (
    <FormattedDisplayName type="language" value={value} />
  ) : (
    <FormattedMessage defaultMessage="System" description="System locale" />
  );
}
