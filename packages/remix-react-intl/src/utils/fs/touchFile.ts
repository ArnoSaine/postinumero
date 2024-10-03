import fs from "node:fs/promises";

// Updates the last access and modification time to the current time
export default async function touchFile(filePath: string) {
  const now = new Date();
  await fs.utimes(filePath, now, now);
}
