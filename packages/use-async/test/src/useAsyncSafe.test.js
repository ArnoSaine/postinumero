import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import useAsyncSafe from '@postinumero/use-async/lib/useAsyncSafe.js';

async function f() {
  throw new Error('oops');
}

function C() {
  return useAsyncSafe(f)[0].message;
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
