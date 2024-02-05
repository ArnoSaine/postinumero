import * as mui from "@mui/material";
import { themeOptions } from "../../lib/utils.js";

export * from "@mui/material";

export const createTheme = (...themes: Parameters<typeof mui.createTheme>) =>
  mui.createTheme(...themes, themeOptions);
