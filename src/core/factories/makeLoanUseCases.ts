import { ILoanRepository } from '../domain/repositories/ILoanRepository';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IVinylRecordRepository } from '../domain/repositories/IVinylRecordRepository';
import { BorrowVinylRecord } from '../domain/use-cases/BorrowVinylRecord';
import { ReturnVinylRecord } from '../domain/use-cases/ReturnVinylRecord';
import { MockLoanRepository } from '../infra/mocks/MockLoanRepository';
import { MockUserRepository } from '../infra/mocks/MockUserRepository';
import { MockVinylRecordRepository } from '../infra/mocks/MockVinylRecordRepository';

export function makeLoanUseCases() {
  const loanRepository: ILoanRepository = MockLoanRepository.getInstance();
  const userRepository: IUserRepository = MockUserRepository.getInstance();
  const vinylRecordRepository: IVinylRecordRepository = MockVinylRecordRepository.getInstance();

  const borrowVinylRecord = new BorrowVinylRecord(
    loanRepository,
    userRepository,
    vinylRecordRepository
  );
  const returnVinylRecord = new ReturnVinylRecord(loanRepository);

  return {
    borrowVinylRecord,
    returnVinylRecord,
  };
}
