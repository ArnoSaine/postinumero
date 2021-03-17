import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import useAsync from './useAsync.js';

test('switch component without suspend & get cached value on rerender', async () => {
  const foo = jest.fn();
  const bar = jest.fn();
  const f = jest.fn();

  function Foo() {
    foo();
    useAsync(f);
    return 'foo';
  }

  function Bar() {
    bar();
    useAsync(f);
    return 'bar';
  }

  const { queryByText, rerender } = render(
    <Suspense fallback="loading">
      <Foo />
    </Suspense>
  );
  expect(f).toHaveBeenCalledTimes(1);
  expect(foo).toHaveBeenCalledTimes(1);
  await waitFor(() => {
    expect(queryByText('loading')).toBeInTheDocument();
  });
  expect(foo).toHaveBeenCalledTimes(1);

  await waitFor(() => {
    expect(queryByText('foo')).toBeInTheDocument();
  });
  expect(foo).toHaveBeenCalledTimes(2);

  rerender(<Foo />);
  expect(foo).toHaveBeenCalledTimes(3);

  rerender(<Bar />);
  expect(foo).toHaveBeenCalledTimes(3);
  expect(bar).toHaveBeenCalledTimes(1);

  rerender(<Bar />);
  expect(bar).toHaveBeenCalledTimes(2);

  expect(f).toHaveBeenCalledTimes(1);
});
