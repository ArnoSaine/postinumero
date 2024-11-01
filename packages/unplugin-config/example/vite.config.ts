import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import Config from "../src/vite";

export default defineConfig({
  test: {
    env: {
      BASE_URL: "http://127.0.0.1:8080/",
    },
  },
  plugins: [Inspect(), Config()],
});
