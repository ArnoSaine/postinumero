import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import create from './main';

async function f() {
  throw new Error('oops');
}

const [, , useFSafe] = create(f);

function C() {
  return useFSafe()[0].message;
}

test('suspend, then render error', async () => {
  const { getByText } = render(
    <Suspense fallback="loading">
      <C />
    </Suspense>
  );
  screen.getByText('loading');
  await waitFor(() => {
    expect(getByText('oops')).toBeInTheDocument();
  });
});
