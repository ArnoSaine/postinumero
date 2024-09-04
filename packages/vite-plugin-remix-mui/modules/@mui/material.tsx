import * as mui from "@mui/material";
import { options } from "@postinumero/vite-plugin-remix-mui/theme";

export const createTheme = (...themes: Parameters<typeof mui.createTheme>) =>
  mui.createTheme(...themes, options);
