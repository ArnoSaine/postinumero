export default () => {
  console.log(name);
  return "original";
};

export const name = "some-library";

export const other = "other value";

export function Component() {
  return <>Original</>;
}
