import getMessages from "./getMessages.js";

export default async function getAllMessages({
  locales = JSON.parse(process.env.LOCALES),
  ...other
} = {}) {
  return (
    await Promise.all(
      locales.map(async (locale) => {
        try {
          return [locale, await getMessages({ locale, ...other })];
        } catch {}
      })
    )
  ).filter(Boolean);
}
