import { FormattedMessage } from "react-intl";

export default function Index() {
  return (
    <>
      <h2>
        <FormattedMessage defaultMessage="Examples" />
      </h2>
      <h3>
        <FormattedMessage defaultMessage="Language variants" />
      </h3>
      <FormattedMessage defaultMessage="French fries 🍟" />
      <h3>
        <FormattedMessage defaultMessage="Secondary language" />
      </h3>
      <FormattedMessage defaultMessage="TODO" />
    </>
  );
}
