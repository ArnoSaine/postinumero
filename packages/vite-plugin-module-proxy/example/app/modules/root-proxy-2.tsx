import * as original from "@postinumero/vite-plugin-remix-resolve-config-path/preset/root";
import { PropsWithChildren } from "react";

export { default } from "@postinumero/vite-plugin-remix-resolve-config-path/preset/root";

export function Layout({ children }: PropsWithChildren) {
  return (
    <original.Layout>
      <div style={{ border: "4px solid Orange", margin: 4 }}>{children}</div>
    </original.Layout>
  );
}
