import { render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import create from './main';

async function f() {
  throw new Error('oops');
}

const [useF] = create(f);

function C() {
  return useF();
}

test('suspend, then render error', async () => {
  const spy = jest.spyOn(console, 'error');
  spy.mockImplementation(() => {});

  const { getByText } = render(
    <Suspense fallback="loading">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <C />
      </ErrorBoundary>
    </Suspense>
  );
  screen.getByText('loading');
  await waitFor(() => {
    expect(getByText('oops')).toBeInTheDocument();
  });
  spy.mockRestore();
});

function ErrorFallback({ error }) {
  return error.message;
}
