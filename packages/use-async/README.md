# @postinumero/use-async

Create suspending hook from an async function.

## Example

```js
import create from '@postinumero/use-async';
import axios from 'axios';

const [useAxios] = create(axios);

function User({ id }) {
  const { data } = useAxios(`/api/users/${id}`);

  return <div>First name: {data.first_name}</div>;
}

function App() {
  return (
    <Suspense fallback="Loading...">
      <User id="1" />
    </Suspense>
  );
}
```
