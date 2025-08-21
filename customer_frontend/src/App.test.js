import { render, screen } from '@testing-library/react';
import App from './App';
import AuthProvider from './hooks/useAuth';

// App already contains a BrowserRouter; avoid nesting routers in tests

test('renders navbar brand', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const brand = screen.getByText(/Customer Manager/i);
  expect(brand).toBeInTheDocument();
});
