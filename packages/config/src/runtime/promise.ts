import envPromise from "../env/promise.js";

const isAbsoluteURL = (url: string) =>
  url.startsWith("//") || url.indexOf("://") > 0;

async function tryFetchConfig(path?: string) {
  const env = await envPromise;
  path ??= env.RUNTIME_CONFIG_PATH ?? "config.json";
  if (!path) {
    return;
  }

  try {
    const response = await fetch(
      isAbsoluteURL(path) ? path : env.BASE_URL + path,
    );

    if (!response.ok) {
      return;
    }

    return response.json();
  } catch {}
}

export default new Promise((resolve) => resolve(tryFetchConfig()));
