import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import useAsync from './useAsync.js';
import recall from './recall.js';

const f = jest.fn();

function C() {
  useAsync(f, [1, 2, { x: 'foo' }]);
  return null;
}

test('recall on same params', async () => {
  render(
    <Suspense fallback="loading">
      <C />
    </Suspense>
  );
  await waitFor(() => {
    expect(f).toHaveBeenCalledTimes(1);
  });
  recall(f, [1, 2, { x: 'bar' }]);
  recall(f, [1, 3, { x: 'bar' }]);
  await waitFor(() => {
    expect(f).toHaveBeenCalledTimes(1);
  });
  recall(f, [1, 2, { x: 'foo' }]);
  await waitFor(() => {
    expect(f).toHaveBeenCalledTimes(2);
  });
});
