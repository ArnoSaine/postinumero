export default function createRef<T>(promise: T) {
  const ref = {
    current: null,
  } as {
    current: null | Awaited<T>;
    ready: Promise<void>;
  };

  ref.ready = (async () => {
    ref.current = await promise;
  })();

  return ref;
}
