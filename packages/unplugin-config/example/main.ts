import config from "~config";
import awaited from "~config/awaited";
import promise from "~config/promise";
import proxy from "~config/proxy";
import raw from "~config/raw";
import ref from "~config/ref";

console.log({ config, awaited, promise: await promise, ref, proxy, raw });

document.getElementById("app")!.innerHTML =
  `<pre>${JSON.stringify(config, null, 2)}</pre>`;
