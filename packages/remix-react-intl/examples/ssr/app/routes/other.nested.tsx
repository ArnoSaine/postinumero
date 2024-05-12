import { FormattedMessage } from "react-intl";

export const loader = () => null;

export default function Nested() {
  return (
    <>
      <h3>
        <FormattedMessage defaultMessage="Nested" />
      </h3>
    </>
  );
}
