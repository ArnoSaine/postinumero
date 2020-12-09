import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import create from './main';

const f = jest.fn();

const [useF] = create(f);

function Foo() {
  useF();
  return 'foo';
}

function Bar() {
  useF();
  return 'bar';
}

test('call on new mount', async () => {
  const { queryByText, rerender } = render(
    <Suspense fallback="loading">
      <Foo />
    </Suspense>
  );
  expect(f).toHaveBeenCalledTimes(1);
  await waitFor(() => {
    expect(queryByText('loading')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(queryByText('foo')).toBeInTheDocument();
  });

  rerender(
    <Suspense fallback="loading">
      <Foo />
      <Bar />
    </Suspense>
  );

  rerender(
    <Suspense fallback="loading">
      <Bar />
    </Suspense>
  );

  rerender(<Suspense fallback="loading" />);
  await waitFor(() => {
    expect(queryByText('foo')).not.toBeInTheDocument();
  });
  expect(f).toHaveBeenCalledTimes(1);

  rerender(
    <Suspense fallback="loading">
      <Foo />
    </Suspense>
  );
  expect(f).toHaveBeenCalledTimes(2);
});
