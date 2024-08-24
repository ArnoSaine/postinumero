export default function createRef<T>(promise: T) {
  const ref = {
    current: null as null | Awaited<T>,
    async ready() {
      ref.current = await promise;
    },
  };

  ref.ready();

  return ref;
}
