export default function parseJson(
  ...args: Parameters<JSONParse>
): ReturnType<JSONParse> {
  const [value] = args;
  return value === null ? undefined : JSON.parse(...args);
}
