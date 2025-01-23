export default function renderChildrenOrFallback(
  useTest: (props: any) => boolean,
  mapProps = (props: any) => props,
) {
  return function ChildrenOrFallback({
    children = null,
    fallback = null,
    ...props
  }: {
    children?: React.ReactNode;
    fallback?: React.ReactNode;
    [x: string]: any;
  }) {
    return useTest(mapProps(props)) ? children : fallback;
  };
}
