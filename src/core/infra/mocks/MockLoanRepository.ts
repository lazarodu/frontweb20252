import { ILoanRepository } from '../../domain/repositories/ILoanRepository';
import { Loan } from '../../domain/entities/Loan';
import { MockVinylRecordRepository } from './MockVinylRecordRepository';

export class MockLoanRepository implements ILoanRepository {
  private static instance: MockLoanRepository;
  private loans: Loan[] = [];

  private constructor() { }

  public static getInstance(): MockLoanRepository {
    if (!MockLoanRepository.instance) {
      MockLoanRepository.instance = new MockLoanRepository();
    }
    return MockLoanRepository.instance;
  }

  async save(loan: Loan): Promise<void> {
    this.loans.push(loan);
  }

  async findById(id: string): Promise<Loan | null> {
    return this.loans.find(loan => loan.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Loan[]> {
    const userLoans = this.loans.filter(loan => loan.userId === userId);
    const vinylRecordRepository = MockVinylRecordRepository.getInstance();
    const loansWithVinyl = await Promise.all(
      userLoans.map(async (loan) => {
        const vinylRecord = await vinylRecordRepository.findById(loan.vinylRecordId);
        Object.assign(loan, { vinylRecord });
        return loan;
      })
    );
    return loansWithVinyl;
  }

  async findCurrentLoanOfRecord(vinylRecordId: string): Promise<Loan | null> {
    return this.loans.find(loan => loan.vinylRecordId === vinylRecordId && !loan.returnDate) || null;
  }

  async update(loan: Loan): Promise<void> {
    const loanIndex = this.loans.findIndex(l => l.id === loan.id);
    if (loanIndex !== -1) {
      this.loans[loanIndex] = loan;
    }
  }

  public reset(): void {
    this.loans = [];
  }
}
