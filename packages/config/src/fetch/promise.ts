// const url: string =
//   import.meta.env?.VITE_RUNTIME_CONFIG_URL ??
//   (import.meta.env?.BASE_URL ?? "") + "config.json";

const url = "/config.json";
// const url = "/__/config.json";
// const url = "https://example.com/config.json";

async function tryFetchConfig() {
  try {
    const response = await fetch(url, { cache: "no-store" });
    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch config from "${url}".`, error);
  }
}

export default url && typeof document !== "undefined"
  ? new Promise((resolve) => resolve(tryFetchConfig()))
  : undefined;
