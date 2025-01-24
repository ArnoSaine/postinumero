export const options = {
  fallbackRoute: "/",
  isProps: {
    isAuthenticated: "__isAuthenticated",
    hasRealmRole: "__hasRealmRole",
    hasResourceRole: "__hasResourceRole",
    hasRole: "__hasRole",
  },
  logoutIntentSearchParam: { name: "intent", value: "logout" },
  redirectURIOptionName: "redirect_uri",
  removeAuthParams: ["code", "error", "iss", "session_state", "state"],
  routes: {
    login: "/login",
    logout: "/logout",
  },
};

export default options;
