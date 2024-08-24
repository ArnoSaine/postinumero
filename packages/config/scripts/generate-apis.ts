import fs from "node:fs/promises";
import { dirname } from "node:path";
import recursive from "recursive-readdir";
import { replaceInFile } from "replace-in-file";

const templatesPath = "templates";
const srcPath = "src";
const promiseApiFiles = await recursive(srcPath, ["!**/promise.ts"]);

const templates = (await recursive(templatesPath)).map((template) => ({
  src: template,
  dest: template.slice(templatesPath.length),
}));

await Promise.all(
  promiseApiFiles
    .map((file) => dirname(file))
    .flatMap((dir) =>
      templates.map(({ src, dest }) => fs.copyFile(src, `${dir}${dest}`)),
    ),
);

await replaceInFile({
  files: templates.map(({ dest }) => `${srcPath}/**/${dest}`),
  processor: (input, file) =>
    input.replace(
      /~\//g,
      "../".repeat(file.split("/").length - srcPath.split("/").length - 1),
    ),
});
