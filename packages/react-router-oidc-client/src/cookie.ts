import { createCookie } from "react-router";

export const options = {
  name: "__rr_oidc_token",
};

const cookie = createCookie(options.name);

export default cookie;

export const { serialize, parse } = cookie;
