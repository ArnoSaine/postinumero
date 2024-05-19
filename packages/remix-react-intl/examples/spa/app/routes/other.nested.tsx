import { FormattedMessage } from "react-intl";

export const clientLoader = () => null;

export default function Nested() {
  return (
    <>
      <h3>
        <FormattedMessage defaultMessage="Nested" />
      </h3>
    </>
  );
}
