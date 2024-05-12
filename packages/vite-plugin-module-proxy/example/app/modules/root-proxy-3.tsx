import * as original from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/root";
import { PropsWithChildren } from "react";

export { default } from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/root";

export function Layout({ children }: PropsWithChildren) {
  return (
    <original.Layout>
      <div style={{ border: "4px solid Gold", margin: 4 }}>{children}</div>
    </original.Layout>
  );
}
