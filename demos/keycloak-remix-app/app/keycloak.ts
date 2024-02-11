import Keycloak from "keycloak-js";

const keycloak =
  typeof document !== "undefined"
    ? new Keycloak({
        url: "http://localhost:8080/",
        realm: "demo",
        clientId: "demo",
      })
    : undefined;

if (typeof document !== "undefined") {
  try {
    const authenticated = await keycloak!.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: `${location.origin}/silent-check-sso.html`,
      checkLoginIframe: false,
    });
    console.log(
      `User is ${authenticated ? "authenticated" : "not authenticated"}`
    );
  } catch (error) {
    console.error("Failed to initialize adapter:", error);
  }
}

export default keycloak;
