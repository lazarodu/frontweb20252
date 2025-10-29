import { makeVinylRecordUseCases } from '@/core/factories/makeVinylRecordUseCases';
import { makeLoanUseCases } from '@/core/factories/makeLoanUseCases'; // Importe a outra fábrica
import { MockUserRepository } from '@/core/infra/mocks/MockUserRepository';
import { MockVinylRecordRepository } from '@/core/infra/mocks/MockVinylRecordRepository';
import { MockLoanRepository } from '@/core/infra/mocks/MockLoanRepository';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import Detalhes from '@/app/detalhes/[id]/page';
import LoansPage from '@/app/admin/loans/page';
import { useParams, useRouter } from 'next/navigation';
import { VinylRecord } from '@/core/domain/entities/VinylRecord';
import { Loan } from '@/core/domain/entities/Loan'; // Importe o tipo Loan

// Mocking next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn()
}));

// --- Mock das Fábricas ---
jest.mock('@/core/factories/makeVinylRecordUseCases');
jest.mock('@/core/factories/makeLoanUseCases');
// --- Fim Mocks ---

// Mocking AuthContext...
jest.mock('@/context/AuthContext', () => {
    const originalModule = jest.requireActual('@/context/AuthContext');
    const { User } = jest.requireActual('@/core/domain/entities/User');
// ... (resto do seu mock de AuthContext) ...
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

const mockUseRouter = useRouter as jest.Mock;
const mockUseParams = useParams as jest.Mock;

// --- Referências para as fábricas mockadas ---
const mockMakeVinylRecordUseCases = makeVinylRecordUseCases as jest.Mock;
const mockMakeLoanUseCases = makeLoanUseCases as jest.Mock;

// --- Dados Mockados ---
const mockRecord: VinylRecord = {
    id: 'vinyl-1',
    band: { value: 'ACDC' },
    album: { value: 'Back in Black' },
    year: 1980,
    numberOfTracks: 10,
    photo: { url: 'https://www' },
    userId: 'user-1'
} as VinylRecord; // Usar o tipo importado

// Use o tipo Loan para o mock
const mockLoan: Loan = {
    id: 'loan-1',
    userId: 'test-user-id',
    vinylRecordId: 'vinyl-1',
    loanDate: new Date(),
    returnDate: null,
    vinylRecord: mockRecord // Incluindo o vinil para a página de empréstimos
} as unknown as Loan;


describe('Loan Integration Test', () => {
  let push: jest.Mock;
  // --- Variáveis para armazenar as funções execute ---
  let mockFindVinylRecord: jest.Mock;
  let mockBorrowVinylRecord: jest.Mock;
  let mockFindLoansByUser: jest.Mock;
  let mockReturnVinylRecord: jest.Mock; // Adicionado para a devolução

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();

    push = jest.fn();
    mockUseRouter.mockReturnValue({ push });
    mockUseParams.mockReturnValue({ id: 'vinyl-1' });

    // --- Configuração Robusta dos Mocks das Fábricas ---
    // 1. Crie as funções mock primeiro
    mockFindVinylRecord = jest.fn().mockResolvedValue(mockRecord);
    mockBorrowVinylRecord = jest.fn().mockResolvedValue(undefined);
    mockFindLoansByUser = jest.fn().mockResolvedValue([]); // Para a LoansPage inicial
    mockReturnVinylRecord = jest.fn().mockResolvedValue(undefined); // Para a devolução

    // 2. Passe as referências para o mockReturnValue
    mockMakeVinylRecordUseCases.mockReturnValue({
        findVinylRecord: {
            execute: mockFindVinylRecord
        }
    });

    mockMakeLoanUseCases.mockReturnValue({
        borrowVinylRecord: {
            execute: mockBorrowVinylRecord
        },
        findLoansByUser: {
            execute: mockFindLoansByUser
        },
        returnVinylRecord: { // Adiciona o mock para a função de devolução
            execute: mockReturnVinylRecord
        }
    });
    // --- Fim Configuração Mocks ---

    // Reset repositories
    MockUserRepository.getInstance().reset();
    MockVinylRecordRepository.getInstance().reset();
    MockLoanRepository.getInstance().reset();

    // 3. Mock o 'alert' e 'confirm' para evitar crashes do JSDOM
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn(); // <-- SOLUÇÃO PARA FALHA 1
  });

  it('should borrow and return a vinyl record', async () => {
    // 1. Render the details page
    const { rerender } = render(
        <AuthProvider>
            <Detalhes />
        </AuthProvider>
    );

    // 2. Click the borrow button
    const borrowButton = await screen.findByRole('button', { name: 'Emprestar' });
    fireEvent.click(borrowButton);

    // Espere o 'push' (navegação) ser chamado
    await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/admin/loans');
    });

    // --- ATUALIZAÇÃO CORRETA DO MOCK ---
    // 1. Atualize o valor que a função mockada deve retornar para a primeira renderização da LoansPage
    mockFindLoansByUser.mockResolvedValue([mockLoan]); 

    // 2. Re-configure a fábrica para garantir que o próximo 'make' use os novos mocks
    mockMakeLoanUseCases.mockReturnValue({
        borrowVinylRecord: { execute: mockBorrowVinylRecord },
        findLoansByUser: { execute: mockFindLoansByUser }, // Passa a variável ATUALIZADA
        returnVinylRecord: { execute: mockReturnVinylRecord }
    });
    // --- Fim da Correção ---

    // 3. RENDER the loans page (simulando a navegação)
    rerender(
        <AuthProvider>
            <LoansPage />
        </AuthProvider>
    );

    // 4. Verify the new loan appears in the table and is not returned
    await waitFor(() => {
        expect(screen.getByText('ACDC - Back in Black')).toBeInTheDocument();
        expect(screen.getByText('Não devolvido')).toBeInTheDocument();
    });

    // 5. Click the return button
    // Configure o mock para a chamada de fetchLoans que acontece DENTRO de handleReturn
    const returnedLoan = { ...mockLoan, returnDate: new Date() };
    mockFindLoansByUser.mockResolvedValue([returnedLoan]);

    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Devolver' }));
    });

    // Verifica se a devolução foi chamada
    await waitFor(() => {
        expect(mockReturnVinylRecord).toHaveBeenCalledWith({ loanId: mockLoan.id });
    });

    // 6. Verify the loan is marked as returned
    // A UI deve ter sido atualizada porque o mock foi configurado ANTES do clique
    await waitFor(() => {
        // Verifica se o texto "Não devolvido" sumiu
        expect(screen.queryByText('Não devolvido')).not.toBeInTheDocument();
    });
  });
});