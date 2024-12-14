import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../store';
import AppWrapper from '../App';

// Helper for rendering with Redux and Router
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderWithProviders = (ui: React.ReactNode, preloadedState: any = {}) => {
  const store = configureStore({ reducer: rootReducer, preloadedState });
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('App Wrapper', () => {
  it('renders login page for unauthenticated users', () => {
    renderWithProviders(<AppWrapper />, {
      auth: { user: null }, // Mock unauthenticated state
    });
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('renders dashboard for authenticated users', async () => {
    renderWithProviders(<AppWrapper />, {
      auth: { user: { id: 1, name: 'Test User' } }, // Mock authenticated state
    });
    expect(await screen.findByText(/welcome to my app/i)).not.toBeInTheDocument();
  });

  it('renders 404 for unknown routes', async () => {
    renderWithProviders(<AppWrapper />, {
      auth: { user: { id: 1, name: 'Test User' } }, // Mock authenticated state
    });

    act(() => {
      window.history.pushState({}, '', '/unknown-route');
    });

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });
});
