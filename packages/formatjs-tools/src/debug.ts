import chalk from "chalk";

export const formatFiles = (
  files: { path: string; exists: boolean }[],
  showMissingFiles = false,
) =>
  (showMissingFiles ? files : files.filter(({ exists }) => exists)).map(
    showMissingFiles
      ? ({ path, exists }) =>
          `${exists ? `✓ ${path}` : chalk.dim(`${chalk.redBright("✗")} ${path}`)}`
      : ({ path }) => path,
  );
