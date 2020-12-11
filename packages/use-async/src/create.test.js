import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import create from './create.js';

const f = jest.fn();

const [useF, recallF, useFSafe] = create(f);

function Foo() {
  useF();
  return 'foo';
}

function FooSafe() {
  useFSafe();
  return 'foo safe';
}

test('call on new mount', async () => {
  const { getByText } = render(
    <Suspense fallback="loading">
      <Foo />
      <FooSafe />
    </Suspense>
  );
  screen.getByText('loading');
  await waitFor(() => {
    expect(getByText('foofoo safe')).toBeInTheDocument();
  });
  expect(f).toHaveBeenCalledTimes(1);
  recallF();
  await waitFor(() => {
    expect(f).toHaveBeenCalledTimes(2);
  });
});
