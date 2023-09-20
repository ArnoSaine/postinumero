import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import * as ReactDOMServer from "react-dom/server";
import { createEmotionCache } from "../../utils";

export function renderToString(remixServerElement: React.ReactElement) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  // Render the component to a string.
  const html = ReactDOMServer.renderToString(
    <CacheProvider value={cache}>{remixServerElement}</CacheProvider>
  );

  // Grab the CSS from emotion
  const { styles } = extractCriticalToChunks(html);

  // Add the Emotion style tags after the insertion point meta tag
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
