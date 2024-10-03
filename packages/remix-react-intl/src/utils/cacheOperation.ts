import { hashElement } from "folder-hash";
import { createHash, Hash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import cleanOldFiles from "./fs/cleanOldFiles.js";
import touchFile from "./fs/touchFile.js";
import isErrnoException from "./isErrnoException.js";

async function tryHashElement(input: string) {
  try {
    return (await hashElement(input)).hash;
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return null;
    }

    console.warn(`Error hashing element: ${input}`, error);
    return null;
  }
}

const createBaseHash = ({
  inputHashes,
  dependencies,
}: {
  inputHashes: (string | null)[];
  dependencies: any[];
}) =>
  createHash("sha512").update(
    JSON.stringify(
      {
        dependencies,
        inputHashes,
      },
      (_key, value) => (value instanceof Map ? [...value] : value),
    ),
  );

// Generate the final digest by appending the output hashes
const createDigestFromBaseHash = (
  hash: Hash,
  outputHashes: (string | null)[],
) =>
  hash
    .copy()
    .update(JSON.stringify({ outputHashes }))
    .digest("base64url")
    .slice(0, 10);

const dir = new URL(".cache", import.meta.url).pathname;

export default async function cacheOperation(
  callbackFn: () => Promise<void>,
  {
    inputs = [],
    outputs,
    dependencies = [],
    name,
  }: {
    outputs: string[];
    inputs?: string[];
    dependencies?: any[];
    name: string;
  },
) {
  // Hash inputs first (as inputs won't change between cache hits and misses)
  const inputHashes = await Promise.all(
    inputs.map((input) => tryHashElement(input)),
  );

  // Create the base hash (without output hashes)
  const baseHash = createBaseHash({
    inputHashes,
    dependencies,
  });

  // Compute the initial digest using output hashes before the operation
  const outputHashesBefore = await Promise.all(
    outputs.map((output) => tryHashElement(output)),
  );
  const initialDigest = createDigestFromBaseHash(baseHash, outputHashesBefore);

  cleanOldFiles(dir);

  // Check if the cache exists for the current digest
  try {
    const filePath = path.join(dir, initialDigest);
    await fs.access(filePath);
    await touchFile(filePath);
    console.log(`Cache hit. Skipping ${name}.`);
    return true; // Cache hit, no need to run callback
  } catch {
    console.log(`Cache miss. Run ${name}...`);
    await callbackFn(); // Execute the operation as it's a cache miss

    // After the operation, only re-hash the outputs since inputs don't change
    const outputHashesAfter = await Promise.all(
      outputs.map((output) => tryHashElement(output)),
    );
    const newDigest = createDigestFromBaseHash(baseHash, outputHashesAfter);

    // Create a cache marker file for the new digest
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, newDigest), "");

    return false; // Cache miss, operation was executed
  }
}
