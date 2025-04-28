import { createHash, type BinaryToTextEncoding } from "node:crypto";

export interface HashValueOptions {
  algorithm?: string;
  length?: number;
  encoding?: BinaryToTextEncoding;
}

export const hashValue = (
  value: string,
  options: true | HashValueOptions = true,
) => {
  if (options === true) {
    options = {};
  }

  return createHash(options.algorithm ?? "sha1")
    .update(value)
    .digest(options.encoding ?? "base64url")
    .slice(0, options.length ?? 6);
};
