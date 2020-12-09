import { render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import create from './main';

const f = jest.fn();

const [useF, recallF] = create(f);

function C() {
  useF(1, 2, { x: 'foo' });
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
  recallF(1, 2, { x: 'bar' });
  recallF(1, 3, { x: 'bar' });
  await waitFor(() => {
    expect(f).toHaveBeenCalledTimes(1);
  });
  recallF(1, 2, { x: 'foo' });
  await waitFor(() => {
    expect(f).toHaveBeenCalledTimes(2);
  });
});
