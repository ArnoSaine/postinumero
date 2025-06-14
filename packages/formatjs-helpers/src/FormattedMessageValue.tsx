import { FormattedMessage, useIntl, type MessageDescriptor } from "react-intl";

type OptionMessages = Record<string, MessageDescriptor>;
type Value = string | null;

const createGetMessageValue =
  <T,>(formatMessage: (descriptor: MessageDescriptor) => T) =>
  (optionMessages: OptionMessages, value?: Value) => {
    if (!value) {
      return "";
    }

    const descriptor = optionMessages[value];

    if (descriptor) {
      return formatMessage(descriptor);
    }

    return value;
  };

const renderMessageValue = createGetMessageValue((descriptor) => (
  <FormattedMessage {...descriptor} />
));

export const FormattedMessageValue = ({
  optionMessages,
  value,
}: {
  optionMessages: OptionMessages;
  value?: Value;
}) => renderMessageValue(optionMessages, value);

export function useFormatMessageValue() {
  const intl = useIntl();
  return createGetMessageValue((descriptor) => intl.formatMessage(descriptor));
}
