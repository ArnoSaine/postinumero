import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import create from './main';

async function f() {
  return 'foo';
}

const [useF] = create(f);

function C() {
  return useF();
}

test('suspend, then render value', async () => {
  const { getByText } = render(
    <>
      <Suspense fallback="loading">
        <C />
      </Suspense>
    </>
  );
  screen.getByText('loading');
  await waitFor(() => {
    expect(getByText('foo')).toBeInTheDocument();
  });
});

test('render available value immediately', async () => {
  const { getByText, rerender } = render(
    <Suspense fallback="loading">
      <C />
    </Suspense>
  );
  await waitFor(() => {
    expect(getByText('foo')).toBeInTheDocument();
  });

  rerender(
    <Suspense fallback="loading">
      <C />
      <C />
    </Suspense>
  );
  expect(getByText('foofoo')).toBeInTheDocument();
});
