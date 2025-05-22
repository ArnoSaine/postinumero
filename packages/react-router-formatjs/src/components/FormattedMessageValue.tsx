import { FormattedMessage, type MessageDescriptor } from "react-intl";

/**
 *
 * Renders a translated message from a given message map using its key.
 * If the key is not found in the messages, the key itself is displayed as a fallback.
 */
export default function FormattedMessageValue({
  messages,
  messageKey,
}: {
  messages: Record<string, MessageDescriptor>;
  messageKey?: string | null;
}) {
  const messageDescriptor = messageKey && messages[messageKey];

  return messageDescriptor ? (
    <FormattedMessage {...messageDescriptor} />
  ) : (
    messageKey
  );
}
