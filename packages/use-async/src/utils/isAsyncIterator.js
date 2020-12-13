export default function isAsyncIterator(value) {
  return Symbol.asyncIterator in Object(value);
}
