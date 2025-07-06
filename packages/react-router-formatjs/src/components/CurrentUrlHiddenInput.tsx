import { CONFIG } from "@postinumero/react-router-formatjs/config";
import { createPath, useLocation } from "react-router";

export default function CurrentUrlHiddenInput() {
  return (
    <input
      type="hidden"
      name={CONFIG.keys.currentUrl}
      value={createPath(useLocation())}
    />
  );
}
