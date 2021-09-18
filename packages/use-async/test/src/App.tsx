import { create } from '@postinumero/use-async';
import { Repeater } from '@repeaterjs/repeater';
import axios from 'axios';
import { Suspense } from 'react';

const [useAxios] = create(axios);

function Todo({ id }: { id: string }) {
  const { data } = useAxios(`https://jsonplaceholder.typicode.com/todos/${id}`);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

const [useTimestamp] = create(
  () =>
    new Repeater(async (push, stop) => {
      push(Date.now());
      const interval = setInterval(() => push(Date.now()), 1000);
      await stop;
      clearInterval(interval);
    })
);

function Timestamp() {
  return <div>Timestamp: {useTimestamp()}</div>;
}

function App() {
  return (
    <Suspense fallback="Loading...">
      <Todo id="1" />
      <Timestamp />
    </Suspense>
  );
}

export default App;
