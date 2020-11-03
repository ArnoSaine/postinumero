export default (value, reviver) =>
  value === null ? undefined : JSON.parse(value, reviver);
