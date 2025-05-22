import { create } from "./sessionStorage.ts";

const { clientAction, clientLoader } = create(() => localStorage);

export { clientAction, clientLoader };
