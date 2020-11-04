import { render, screen } from '@testing-library/react';
import Hello from './Hello';

test('renders hello', () => {
  render(<Hello />);
  const helloElement = screen.getByText(/Hello 👋/i);
  expect(helloElement).toBeInTheDocument();
});
