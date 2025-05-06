import "react-intl";

declare module "react-intl" {
  interface MessageDescriptor
    extends import("@formatjs/intl").MessageDescriptor {
    id: string;
  }

  // It is ensured that the `id` property is always present in the
  // `MessageDescriptor` type returned by `defineMessage` and `defineMessages`
  // functions.
  export function defineMessage<T extends MessageDescriptor>(
    msg: T,
  ): T & Required<MessageDescriptor>;

  export function defineMessages<K extends string, T extends MessageDescriptor>(
    msgs: Record<K, T>,
  ): Record<K, T & Required<MessageDescriptor>>;
}
