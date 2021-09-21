export type JSONParseParameters = Parameters<typeof JSON.parse>;
export type JSONStringifyParameters = Parameters<typeof JSON.stringify>;

export type SetItem = Storage['setItem'];
export type GetItem = Storage['getItem'];
export type Key = Parameters<SetItem>[0];
export type Item = ReturnType<GetItem>;

export type Reviver = JSONParseParameters[1];
export type Replacer = JSONStringifyParameters[1];
export type Space = JSONStringifyParameters[2];

export type Listener = (key: Item) => void;
export type UseStorage = (key: Key, reviver?: Reviver) => Item;
