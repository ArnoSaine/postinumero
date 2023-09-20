declare module "@postinumero/integration-react-intl-x-remix/getMessages";

export default function getMessages<Locale = string>({
  getFilePath,
  locale,
}: {
  getFilePath?: ((locale: Locale) => string) | undefined;
  locale: Locale;
}): Promise<any>;
