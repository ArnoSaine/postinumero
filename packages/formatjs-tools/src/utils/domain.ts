import { toBasePaths, toBasePathsReverse } from "./string.ts";

// "test.example.com" --> ["test", "test.example", "test.example.com"]
export const subDomains = toBasePaths(".");

// "com.example.test" --> ["com", "com.example", "com.example.test"]
export const reverseParentDomains = subDomains;

// "test.example.com" --> ["com", "example.com", "test.example.com"]
export const parentDomains = toBasePathsReverse(".");

// "com.example.test" --> ["test", "example.test", "com.example.test"]
export const reverseSubDomains = parentDomains;
