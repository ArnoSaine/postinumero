export default function renderChildrenOrFallback(useTest) {
  return function ChildrenOrFallback({
    children = null,
    fallback = null,
    ...props
  }) {
    return useTest(props) ? children : fallback;
  };
}
