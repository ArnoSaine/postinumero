// Test for any character except for /, \, :, *, ?, ", <, >, |, and control characters
export const isPathname = (pathname: string) =>
  /^[^<>:"/\\|?*]+$/.test(pathname);

// Test if the string is not a base path of any other string
// "foo/bar/baz" is a base path of "foo/bar/baz/quux"
export const isLeaf =
  (sep: string) => (path: string, _index: number, paths: string[]) => {
    const basePath = `${path}${sep}`;
    return !Boolean(paths.find((path) => path.startsWith(basePath)));
  };

// "/", "foo/bar/baz" --> ["foo", "foo/bar", "foo/bar/baz"]
export const toBasePaths = (sep: string) => (path: string) =>
  path
    .split(sep)
    .map((_part, index, parts) => parts.slice(0, index + 1).join(sep));

// ".", "com.example.test" --> ["test", "example.test", "com.example.test"]
export const toBasePathsReverse = (sep: string) => (path: string) =>
  path
    .split(sep)
    .reverse()
    .map((_part, index, parts) =>
      parts
        .slice(0, index + 1)
        .reverse()
        .join(sep),
    );
