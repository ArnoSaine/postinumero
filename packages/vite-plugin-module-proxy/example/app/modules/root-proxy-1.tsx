import * as original from "@postinumero/vite-plugin-remix-resolve-config-path/resolve/preset/root";
import { PropsWithChildren } from "react";

const Original = original.Layout!;

export function Layout({ children }: PropsWithChildren) {
  return (
    <Original>
      <div style={{ border: "4px solid OrangeRed", margin: 4 }}>{children}</div>
    </Original>
  );
}
