import fsExtra from "fs-extra";

export default function getMessages({
  getFilePath = (locale) => `./lang/${locale}.json`,
  locale,
}) {
  return fsExtra.readJson(getFilePath(locale));
}
