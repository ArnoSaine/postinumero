import * as root from "@postinumero/vite-plugin-remix-resolve-config-path/preset/root";

export const id = "rp root";

console.log("rp", root, root.id);

export * from "@postinumero/vite-plugin-remix-resolve-config-path/preset/root";

export default () => <root.default />;
