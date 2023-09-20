import type { IntlShape, MessageDescriptor } from "react-intl";
import { useIntl } from "react-intl";
import { generatePath } from "react-router";

const useFormatGeneratePath = () => createFormatGeneratePath(useIntl());

export default useFormatGeneratePath;

export const createFormatGeneratePath =
  (intl: IntlShape) =>
  (
    messageDescriptor: MessageDescriptor,
    params: Parameters<typeof generatePath>[1]
  ) =>
    generatePath(intl.formatMessage(messageDescriptor), params);
