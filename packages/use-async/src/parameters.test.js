import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import create from './main';

const counter = jest.fn();

function f({ x: { y } }) {
  counter();
  return y;
}

const [useF] = create(f);

function C(props) {
  return useF(props);
}

test('call on params change', async () => {
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
    <Suspense fallback="loading">
      <C x={{ y: 'foo' }} />
      <C x={{ y: 'foo' }} />
    </Suspense>
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
    <Suspense fallback="loading">
      <C x={{ y: 'bar' }} />
      <C x={{ y: 'bar' }} />
    </Suspense>
  );
  await waitFor(() => {
    expect(queryByText('barbar')).toBeInTheDocument();
  });
  expect(counter).toHaveBeenCalledTimes(2);
});
