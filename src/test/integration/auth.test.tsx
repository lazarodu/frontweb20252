import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import RegisterPage from '@/app/register/page';
import LoginPage from '@/app/login/page';
import { useRouter } from 'next/navigation';
import { MockUserRepository } from '@/core/infra/mocks/MockUserRepository';

// Mocking next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Auth Integration Test', () => {
  let push: jest.Mock;

    beforeEach(() => {

      // Reset mocks before each test

      push = jest.fn();

      (useRouter as jest.Mock).mockReturnValue({ push });

      MockUserRepository.getInstance().reset();

    });

  it('should register a user and then log in', async () => {
    // 1. Render Register Page and Login Page within the same AuthProvider
    const { rerender } = render(
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    );

    // 2. Fill out registration form
    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'Password123!' } });

    // 3. Submit registration form
    fireEvent.click(screen.getByRole('button', { name: 'Criar' }));

    // 4. Assert redirection to login page
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });

    // 5. Rerender with Login Page
    rerender(
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    );

    // 6. Fill out login form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'Password123!' } });

    // 7. Submit login form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    });

    // 8. Assert redirection to admin page
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/admin/vinyls');
    }, { timeout: 2000 });
  });
});
