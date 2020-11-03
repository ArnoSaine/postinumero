import useAuthorize from './useAuthorize';

export default function Authorize({
  children = null,
  fallback = null,
  ...props
}) {
  return useAuthorize(props) ? children : fallback;
}
