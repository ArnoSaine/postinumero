type JSONParse = typeof JSON.parse;

type UseStorage = (key: Key, reviver?: Reviver) => Item;

type Reviver = Parameters<typeof JSON.parse>[1];
type Replacer = Parameters<typeof JSON.stringify>[1];
type Space = Parameters<typeof JSON.stringify>[2];
type Listener = (key: Item) => void;

type Key = Parameters<Storage['setItem']>[0];
type Item = ReturnType<Storage['getItem']>;
