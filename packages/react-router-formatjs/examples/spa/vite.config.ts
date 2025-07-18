import formatjs from "@postinumero/react-router-formatjs/vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), formatjs()],
  build: {
    target: "ES2022", // For top level await
  },
});
