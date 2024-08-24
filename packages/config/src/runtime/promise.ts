const isAbsoluteURL = (url: string) =>
  url.startsWith("//") || url.indexOf("://") > 0;

async function tryFetchConfig(
  path = import.meta.env.VITE_RUNTIME_CONFIG_PATH ?? "config.json",
) {
  if (path === "false") {
    return;
  }

  try {
    const response = await fetch(
      isAbsoluteURL(path) ? path : import.meta.env.BASE_URL + path,
    );

    if (!response.ok) {
      return;
    }

    return response.json();
  } catch {}
}

export default new Promise((resolve) => resolve(tryFetchConfig()));
