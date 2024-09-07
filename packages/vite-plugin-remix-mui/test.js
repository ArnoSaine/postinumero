import execa from "execa";
import { strict as assert } from "node:assert";
import { suite, test } from "node:test";
import waitOn from "wait-on";

const commandWithPrefix = (
  command,
  prefix = " --prefix example",
  sep = " -- ",
  insertIndex = command.indexOf(sep),
) =>
  command.includes(sep)
    ? command.slice(0, insertIndex) + prefix + command.slice(insertIndex)
    : `${command}${prefix}`;

const url = "http://localhost:3000";

const headingRegExp =
  /<h1 class="MuiTypography-root MuiTypography-h4 css-[\w-]+">Material UI Remix in TypeScript example<\/h1>/;

const tests = [
  {
    commands: ["npm run dev -- --port 3000"],
    ssr: true,
    mode: "development",
  },
  {
    commands: ["npm run dev:spa -- --port 3000"],
    ssr: false,
    mode: "development",
  },
  {
    commands: ["npm run build", "npm start"],
    ssr: true,
    mode: "production",
  },
  {
    commands: ["npm run build:spa", "npm run start:spa"],
    ssr: false,
    mode: "production",
  },
];

for (const { ssr, commands, mode } of tests) {
  await suite(`${ssr ? "SSR" : "SPA"}: ${mode}`, async () => {
    const start = commands.pop();

    for (const preStart of commands) {
      console.log(`${preStart}...`);

      const { stderr } = await execa.command(commandWithPrefix(preStart));
      if (stderr) {
        console.log(stderr);
      }
    }

    console.log(`${start}...`);
    const starter = execa.command(commandWithPrefix(start));

    await waitOn({ resources: [url] });

    const response = await fetch(url);
    const html = await response.text();

    test("Starts with HTML tag", () => {
      assert(
        html.startsWith(`<!DOCTYPE html>
<html`),
      );
    });

    test("Includes Emotion insertion point meta tag", () => {
      assert(
        html.includes(
          '<meta name="emotion-insertion-point" content="emotion-insertion-point"/>',
        ),
      );
    });

    if (ssr) {
      test("Contains the heading in SSR", () => {
        assert(headingRegExp.test(html));
      });
    } else {
      test("Does not contain the heading in SPA", () => {
        assert(!headingRegExp.test(html));
      });
    }

    starter.cancel();

    await waitOn({ resources: [url], reverse: true });
  });
}
