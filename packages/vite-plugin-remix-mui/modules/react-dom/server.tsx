import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import React from "react";
import * as ReactDOMServer from "react-dom/server";
import { createEmotionCache } from "../../lib/utils.js";

export * from "react-dom/server";

export function renderToString(remixServerElement: React.ReactElement) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const html = ReactDOMServer.renderToString(
    <CacheProvider value={cache}>{remixServerElement}</CacheProvider>
  );

  const { styles } = extractCriticalToChunks(html);

  return html.replace(
    /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
    `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${styles
      .map(
        ({ key, ids, css }) =>
          `<style data-emotion="${key} ${ids.join(" ")}">${css}</style>`
      )
      .join("")}`
  );
}
