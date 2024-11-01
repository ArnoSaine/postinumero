import fs from "node:fs/promises";
import { OptionType } from "./modifierHandlers";

type SourceHandlers = typeof sourceHandlers;

export type SourceName = keyof SourceHandlers;

export type SourceOption = OptionType<SourceHandlers>;

const sourceHandlers = {
  file: async (value: string) => {
    try {
      return await fs.readFile(value, "utf-8");
    } catch (error) {
      console.warn(`Failed to read config from "${value}".`, error);
    }
  },
  global: (value: string) => value,
  fetch: (value: string) => `(async () => {
  const url = ${value.startsWith("/") || value.includes("//") ? `"${value}"` : `(import.meta.env?.BASE_URL ?? "") + "${value}"`};
  try {
    const response = await fetch(url, { cache: "no-store" });
    return await response.json();
  } catch (error) {
  console.warn(\`Failed to fetch config from "\$\{url\}".\`, error);
}
})()`,
};

export default sourceHandlers;
