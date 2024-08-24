type Constructor<T = any> = new (...args: any[]) => T;

const handlerNames = Object.getOwnPropertyNames(Reflect);

type HandlerName = Exclude<keyof typeof Reflect, "apply" | "construct">;

export default function reflect<Value = unknown>(Constructor: Constructor) {
  let innerValue: Value;
  // const TargetAndValueConstructor = [URL, BigInt, Symbol].includes(
  //   Constructor as any,
  // )
  //   ? Object
  //   : Constructor;
  const TargetAndValueConstructor =
    Constructor === Function ? Constructor : Object;

  return [
    new Proxy(
      new TargetAndValueConstructor(),
      Object.fromEntries(
        handlerNames.map((handlerName) => [
          handlerName,
          (_target: any, ...other: any[]) => {
            const handler = Reflect[handlerName as HandlerName] as any;
            const value = handler(innerValue, ...other);
            //console.log("reflect", handlerName, ...other, value);

            return typeof value === "function" ? value.bind(innerValue) : value;
          },
        ]),
      ),
    ) as Value,
    (value: Value) => {
      innerValue = ["function", "object"].includes(typeof value)
        ? value
        : new TargetAndValueConstructor(value);
    },
  ] as const;
}
