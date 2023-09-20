import reactIntl from "@postinumero/esbuild-plugin-react-intl";
import { createPlugin } from "@postinumero/esbuild-plugin-utils";
import { readConfig } from "@remix-run/dev/dist/config.js";
import { escapeRegExp } from "lodash-es";

const { name, setup } = await createPlugin(import.meta);

const config = await readConfig();

const reactIntlPlugin = await reactIntl({
  filter: new RegExp(
    `^${escapeRegExp(`${config.appDirectory}/`)}.*\\.[jt]sx?$`
  ),
});

export default {
  name,
  async setup(build) {
    await setup(build);
    await reactIntlPlugin.setup(build);
  },
};
