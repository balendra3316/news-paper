import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from '../context/SnackbarContext';
import { AuthProvider } from '../context/AuthContext';
import { describe, it, expect } from 'vitest';

describe('Login Page Validation', () => {
  it('shows error messages on invalid email', async () => {
    render(
      <BrowserRouter>
        <SnackbarProvider>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </SnackbarProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email Address/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Invalid email address/i)).toBeInTheDocument();
  });
});