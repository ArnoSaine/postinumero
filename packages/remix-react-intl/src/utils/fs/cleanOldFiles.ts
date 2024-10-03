import fs from "node:fs/promises";
import path from "node:path";
import isErrnoException from "../isErrnoException.js";

// Deletes older files in the directory, keeping the 100 newest files and never deleting files less than 24 hours old.
export default async function cleanOldFiles(
  directory: string,
  { keepMinFiles = 100, keepAccessedIn = 24 * 60 * 60 } = {},
) {
  try {
    const files = await fs.readdir(directory);
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);

        return {
          ...stats,
          file: filePath, // Include the file path for later use in deletion
        };
      }),
    );

    // Sort files by access time, newest first.
    fileStats.sort((a, b) => b.atimeMs - a.atimeMs);

    const keepAccessedAfterMs = Date.now() - keepAccessedIn * 1000;

    // Keep the newest files and do not delete files younger than `keepAccessedIn`.
    const filesToDelete = fileStats
      .slice(keepMinFiles) // Ensure at least keepMinFiles remain
      .filter((file) => file.atimeMs < keepAccessedAfterMs); // Delete based on access time

    // Delete the old files.
    await Promise.all(filesToDelete.map(({ file }) => fs.unlink(file)));
  } catch (error) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return null;
    }

    console.warn(`Error cleaning old files: ${directory}`, error);
    return null;
  }
}
