import { useIntl } from "react-intl";
import useLoginError from "./useLoginError.ts";

export default function useLoginErrorMessage() {
  const intl = useIntl();
  const loginError = useLoginError();

  if (loginError?.error === "invalid_grant") {
    return intl.formatMessage({
      defaultMessage: "Invalid username or password",
      description: "Error message for invalid user credentials",
    });
  }
}
