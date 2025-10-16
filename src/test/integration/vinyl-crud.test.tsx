import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import VinylsPage from '@/app/admin/vinyls/page';
import { useRouter } from 'next/navigation';
import { MockUserRepository } from '@/core/infra/mocks/MockUserRepository';
import { MockVinylRecordRepository } from '@/core/infra/mocks/MockVinylRecordRepository';

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
    
    // A password that satisfies the validation rules
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
        }),
    };
});


describe('Vinyls CRUD Integration Test', () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    
    // Reset repositories to ensure a clean state for each test
    MockUserRepository.getInstance().reset();
    MockVinylRecordRepository.getInstance().reset();

    // Mock window.confirm for the delete operation to automatically confirm
    window.confirm = jest.fn(() => true);
  });

  it('should perform CREATE, READ, UPDATE, and DELETE operations on vinyl records', async () => {
    render(
        <AuthProvider>
            <VinylsPage />
        </AuthProvider>
    );

    // Wait for the page and initial data to load
    await waitFor(() => {
        expect(screen.getByText('Gerenciar Vinis')).toBeInTheDocument();
    });

    // ********** CREATE **********
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Adicionar Vinil' }));
    });

    // Wait for the "Add Vinyl" dialog to appear
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Adicionar Vinil' })).toBeInTheDocument();
    });

    // Fill out the form
    await act(async () => {
        fireEvent.change(screen.getByLabelText('Banda'), { target: { value: 'The Testers' } });
        fireEvent.change(screen.getByLabelText('Album'), { target: { value: 'First Record' } });
        fireEvent.change(screen.getByLabelText('Ano'), { target: { value: '2025' } });
        fireEvent.change(screen.getByLabelText('Número de Músicas'), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText('Imagem'), { target: { value: 'https://example.com/image.jpg' } });
        
        fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    });

    // ********** READ **********
    // Verify the new vinyl appears in the table
    await waitFor(() => {
        expect(screen.getByText('The Testers')).toBeInTheDocument();
        expect(screen.getByText('First Record')).toBeInTheDocument();
    });

    // ********** UPDATE **********
    // Find the "Edit" button in the row of the newly created vinyl
    const rowToUpdate = screen.getByText('The Testers').closest('tr');
    if (!rowToUpdate) throw new Error('Could not find table row for the new vinyl.');
    
    const editButton = within(rowToUpdate).getByRole('button', { name: 'Editar' });

    await act(async () => {
        fireEvent.click(editButton);
    });

    // Wait for the "Edit Vinyl" dialog
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Editar Vinil' })).toBeInTheDocument();
    });

    // Update the album name
    await act(async () => {
        fireEvent.change(screen.getByLabelText('Album'), { target: { value: 'Updated Record' } });
        fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    });

    // Verify the update in the table
    await waitFor(() => {
        expect(screen.getByText('Updated Record')).toBeInTheDocument();
    });

    // ********** DELETE **********
    // Find the "Delete" button in the row of the updated vinyl
    const rowToDelete = screen.getByText('The Testers').closest('tr');
    if (!rowToDelete) throw new Error('Could not find table row for the updated vinyl.');

    const deleteButton = within(rowToDelete).getByRole('button', { name: 'Excluir' });

    await act(async () => {
        fireEvent.click(deleteButton);
    });

    // Verify the vinyl is removed from the table
    await waitFor(() => {
        expect(screen.queryByText('The Testers')).not.toBeInTheDocument();
        expect(screen.queryByText('Updated Record')).not.toBeInTheDocument();
    });
  });
});
