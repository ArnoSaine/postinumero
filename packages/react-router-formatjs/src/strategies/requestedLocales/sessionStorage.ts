import {
  CONFIG,
  type RequestedLocalesStrategy,
} from "@postinumero/react-router-formatjs/config";

export const create = (storage: () => Storage): RequestedLocalesStrategy => ({
  clientAction: (values) => {
    const valuesFiltered = values.filter(Boolean);
    const remove = valuesFiltered.length === 0;
    if (remove) {
      storage().removeItem(CONFIG.strategyTypeKeys.requestedLocales);
    } else {
      storage().setItem(
        CONFIG.strategyTypeKeys.requestedLocales,
        valuesFiltered[0],
      );
    }
  },
  clientLoader: () => {
    const value = storage().getItem(CONFIG.strategyTypeKeys.requestedLocales);
    return value ? [value] : [null];
  },
});

const { clientAction, clientLoader } = create(() => sessionStorage);

export { clientAction, clientLoader };
