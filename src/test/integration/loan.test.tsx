import { useRouter } from 'next/navigation';
import { makeVinylRecordUseCases } from '@/core/factories/makeVinylRecordUseCases';
import { MockUserRepository } from '@/core/infra/mocks/MockUserRepository';
import { MockVinylRecordRepository } from '@/core/infra/mocks/MockVinylRecordRepository';
import { MockLoanRepository } from '@/core/infra/mocks/MockLoanRepository';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import Detalhes from '@/app/detalhes/[id]/page';

// Mocking next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mocking AuthContext to provide a logged-in user directly
jest.mock('@/context/AuthContext', () => {
    const originalModule = jest.requireActual('@/context/AuthContext');
    const { User } = jest.requireActual('@/core/domain/entities/User');
    const { Name } = jest.requireActual('@/core/domain/value-objects/Name');
    const { Email } = jest.requireActual('@/core/domain/value-objects/Email');
    const { Password } = jest.requireActual('@/core/domain/value-objects/Password');
    const validPassword = 'ValidPassword1!';
    const user = User.create(
        'test-user-id',
        Name.create('Test User'),
        Email.create('test@example.com'),
        Password.create(validPassword)
    );

    return {
        __esModule: true,
        ...originalModule,
        useAuth: () => ({
            user: user,
            logout: jest.fn(),
        }),
    };
});

describe('Loan Integration Test', () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    
    // Reset repositories to ensure a clean state for each test
    MockUserRepository.getInstance().reset();
    MockVinylRecordRepository.getInstance().reset();
    MockLoanRepository.getInstance().reset();

    // Mock window.confirm for the delete operation to automatically confirm
    window.confirm = jest.fn(() => true);
  });

  it('should borrow and return a vinyl record', async () => {
    const vinylRecordUseCases = makeVinylRecordUseCases();
    jest.spyOn(vinylRecordUseCases.findVinylRecord, 'execute').mockResolvedValue({
        id: 'vinyl-1',
        band: { value: 'ACDC' },
        album: { value: 'Back in Black' },
        year: 1980,
        numberOfTracks: 10,
        photo: { url: 'https://www' },
        userId: 'user-1'
    } as any);

    // 1. Render the details page
    render(
        <AuthProvider>
            <Detalhes params={{ id: 'vinyl-1' }} />
        </AuthProvider>
    );

    // 2. Click the borrow button
    const borrowButton = await screen.findByRole('button', { name: 'Emprestar' });
    fireEvent.click(borrowButton);

    // 3. Render the loans page
    render(
        <AuthProvider>
            <LoansPage />
        </AuthProvider>
    );

    // 4. Verify the new loan appears in the table
    await waitFor(() => {
        expect(screen.getByText('ACDC - Back in Black')).toBeInTheDocument();
    });

    // 5. Click the return button
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Devolver' }));
    });

    // 6. Verify the loan is marked as returned
    await waitFor(() => {
        expect(screen.getByText('Não devolvido')).not.toBeInTheDocument();
    });
  });
});