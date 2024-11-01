export type OptionType<T> = {
  [K in keyof T]: T[K] extends (arg: infer P) => any ? [K, P] : K;
}[keyof T];

type ModifierHandlers = typeof modifierHandlers;

export type ModifierName = keyof ModifierHandlers;

export type ModifierOption = OptionType<ModifierHandlers>;

const modifierHandlers = {
  "parse-json-values": "parseJsonValues",
  "strip-prefix": (value: string) => {
    const prefix = value;
    const { length } = prefix;
    return `(object) =>
  Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      key.startsWith("${prefix}") ? key.slice(${length}) : key,
      value,
    ])
  )`;
  },
  unflat: "unflat",
};

export default modifierHandlers;
