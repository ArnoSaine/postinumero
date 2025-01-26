export const options = {
  fallbackRoute: "/",
  isProps: {
    isAuthenticated: "__isAuthenticated",
    hasRealmRole: "__hasRealmRole",
    hasResourceRole: "__hasResourceRole",
    hasRole: "__hasRole",
  },
  searchParamsAndOptions: {
    redirectURI: {
      name: "redirect_uri",
    },
    intent: {
      name: "intent",
      values: {
        logout: "logout",
        logoutCallback: "logout-callback",
      },
    },
  },
  removeAuthParams: ["code", "error", "iss", "session_state", "state"],
  routes: {
    login: "/login",
    loginLoader: "/login-loader",
    logout: "/logout",
    logoutCallback: "/logout-callback",
  },
};

export default options;
