# @postinumero/map-get-with-default

## Example

```js
import get from '@postinumero/map-get-with-default';

const map = new Map();

console.log(map.get('x')); // => undefined

// Using proposed bind operator (::) (https://github.com/tc39/proposal-bind-operator)
const set = map::get('x', () => new Set());
// Same as:
// const set = get.call(map, "x", () => new Set());

console.log(map.get('x')); // => Set(0) {}

set.add(1);

console.log(map.get('x')); // => Set(1) {1}
```
