import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import useAsync from './useAsync.js';
import delay from 'delay';

test('call on new mount', async () => {
  const f = jest.fn();

  function Foo() {
    useAsync(f);
    return 'foo';
  }

  function Bar() {
    useAsync(f);
    return 'bar';
  }

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
    <>
      <Foo />
      <Bar />
    </>
  );

  rerender(<Bar />);

  rerender(<Suspense fallback="loading" />);
  await waitFor(() => {
    expect(queryByText('foo')).not.toBeInTheDocument();
  });
  expect(f).toHaveBeenCalledTimes(1);

  await delay(100);
  rerender(
    <Suspense fallback="loading">
      <Foo />
    </Suspense>
  );
  expect(f).toHaveBeenCalledTimes(2);
});

test('call on params change', async () => {
  const counter = jest.fn();

  function f({ x: { y } }) {
    counter();
    return y;
  }

  function C(props) {
    return useAsync(f, [props]);
  }

  jest.useFakeTimers();
  const { queryByText, rerender } = render(
    <Suspense fallback="loading">
      <C x={{ y: 'foo' }} />
      <C x={{ y: 'foo' }} />
    </Suspense>
  );
  expect(counter).toHaveBeenCalledTimes(1);
  await waitFor(() => {
    expect(queryByText('loading')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(queryByText('foofoo')).toBeInTheDocument();
  });

  rerender(
    <>
      <C x={{ y: 'foo' }} />
      <C x={{ y: 'foo' }} />
    </>
  );
  await waitFor(() => {
    expect(queryByText('foofoo')).toBeInTheDocument();
  });
  expect(counter).toHaveBeenCalledTimes(1);

  rerender(
    <Suspense fallback="loading">
      <C x={{ y: 'foo' }} />
      <C x={{ y: 'bar' }} />
    </Suspense>
  );
  await waitFor(() => {
    expect(queryByText('foobar')).toBeInTheDocument();
  });
  expect(counter).toHaveBeenCalledTimes(2);

  rerender(
    <>
      <C x={{ y: 'bar' }} />
      <C x={{ y: 'bar' }} />
    </>
  );
  await waitFor(() => {
    expect(queryByText('barbar')).toBeInTheDocument();
  });
  expect(counter).toHaveBeenCalledTimes(2);
});
