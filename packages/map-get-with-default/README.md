# @postinumero/map-get-with-default

## Example

```js
import get from '@postinumero/map-get-with-default';

const map = new Map();

// Using the proposed bind operator (::) (https://github.com/tc39/proposal-bind-operator)
console.log(map::get('x', () => 'foo')); // => 'foo'

console.log(get(map, 'x', () => 'foo2')); // => 'foo'

console.log(map.get('x')); // => 'foo'
```
