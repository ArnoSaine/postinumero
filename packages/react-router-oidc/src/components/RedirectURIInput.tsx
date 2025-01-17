import { useSearchParams } from "react-router";
import options from "../options.js";
import { useLocationString } from "../utils.js";

export default function RedirectURIInput({
  internal = false,
  value,
}: {
  internal?: boolean;
  value?: string;
}) {
  const [searchParams] = useSearchParams();
  const locationString = useLocationString();

  return (
    <input
      type="hidden"
      name={options.redirectURIOptionName}
      value={
        value ??
        searchParams.get(options.redirectURIOptionName) ??
        (internal ? locationString : location.href)
      }
    />
  );
}
