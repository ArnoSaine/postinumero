import * as mui from "@mui/material";
import { options } from "../../lib/theme.js";

export * from "@mui/material";

export const createTheme = (...themes: Parameters<typeof mui.createTheme>) =>
  mui.createTheme(...themes, options);
