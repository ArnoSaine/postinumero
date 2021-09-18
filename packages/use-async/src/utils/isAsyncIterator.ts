export default function isAsyncIterator(value: any) {
  return Symbol.asyncIterator in Object(value);
}
