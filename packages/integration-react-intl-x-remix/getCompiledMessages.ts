import fsExtra from "fs-extra";

export default function getCompiledMessages<Locale = string>({
  getFilePath = (locale) => `./.compiled-lang/${locale}.json`,
  locale,
}: {
  getFilePath?: (locale: Locale) => string;
  locale: Locale;
}) {
  return fsExtra.readJson(getFilePath(locale));
}
