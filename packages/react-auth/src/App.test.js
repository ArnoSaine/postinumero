import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Renders button and restricted elements', () => {
  render(<App />);
  expect(screen.getByText(/Does not have right to edit/)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Log in/));
  expect(screen.getByText(/email@example\.com/)).toBeInTheDocument();
  expect(screen.getByText(/Has role A/)).toBeInTheDocument();
  expect(screen.getByText(/Does not have role B/)).toBeInTheDocument();
  expect(screen.getByText(/Has right to edit/)).toBeInTheDocument();
});
