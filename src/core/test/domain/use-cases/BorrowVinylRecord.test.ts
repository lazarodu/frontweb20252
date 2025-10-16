import { BorrowVinylRecord } from '../../../domain/use-cases/BorrowVinylRecord';
import { RegisterUser } from '../../../domain/use-cases/RegisterUser';
import { RegisterVinylRecord } from '../../../domain/use-cases/RegisterVinylRecord';
import { MockLoanRepository } from '../../../infra/mocks/MockLoanRepository';
import { MockUserRepository } from '../../../infra/mocks/MockUserRepository';
import { MockVinylRecordRepository } from '../../../infra/mocks/MockVinylRecordRepository';

describe('BorrowVinylRecord', () => {
  it('should borrow a vinyl record', async () => {
    const userRepository = MockUserRepository.getInstance();
    const vinylRecordRepository = MockVinylRecordRepository.getInstance();
    const loanRepository = MockLoanRepository.getInstance();

    const registerUser = new RegisterUser(userRepository);
    const registerVinylRecord = new RegisterVinylRecord(vinylRecordRepository);
    const borrowVinylRecord = new BorrowVinylRecord(
      loanRepository,
      userRepository,
      vinylRecordRepository
    );

    const user = await registerUser.execute({
      name: 'John Doe',
      email: 'john.doe5@example.com',
      password: 'P@ssword1',
    });

    const vinylRecord = await registerVinylRecord.execute({
      band: 'The Beatles',
      album: 'Abbey Road',
      year: 1969,
      numberOfTracks: 17,
      photoUrl: 'https://example.com/abbey-road.jpg',
      userId: 'user-1'
    });

    const loan = await borrowVinylRecord.execute({
      userId: user.id,
      vinylRecordId: vinylRecord.id,
    });

    expect(loan).toBeDefined();
    expect(loan.userId).toBe(user.id);
    expect(loan.vinylRecordId).toBe(vinylRecord.id);
  });

  it('should throw an error if the vinyl record is already on loan', async () => {
    const userRepository = MockUserRepository.getInstance();
    const vinylRecordRepository = MockVinylRecordRepository.getInstance();
    const loanRepository = MockLoanRepository.getInstance();

    const registerUser = new RegisterUser(userRepository);
    const registerVinylRecord = new RegisterVinylRecord(vinylRecordRepository);
    const borrowVinylRecord = new BorrowVinylRecord(
      loanRepository,
      userRepository,
      vinylRecordRepository
    );

    const user = await registerUser.execute({
      name: 'John Doe',
      email: 'john.doe6@example.com',
      password: 'P@ssword1',
    });

    const vinylRecord = await registerVinylRecord.execute({
      band: 'The Beatles',
      album: 'Abbey Road',
      year: 1969,
      numberOfTracks: 17,
      photoUrl: 'https://example.com/abbey-road.jpg',
      userId: 'user-1'
    });

    await borrowVinylRecord.execute({
      userId: user.id,
      vinylRecordId: vinylRecord.id,
    });

    await expect(
      borrowVinylRecord.execute({
        userId: user.id,
        vinylRecordId: vinylRecord.id,
      })
    ).rejects.toThrow('Vinyl record is already on loan');
  });

  it('should throw an error if the user is not found', async () => {
    const userRepository = MockUserRepository.getInstance();
    const vinylRecordRepository = MockVinylRecordRepository.getInstance();
    const loanRepository = MockLoanRepository.getInstance();

    const registerVinylRecord = new RegisterVinylRecord(vinylRecordRepository);
    const borrowVinylRecord = new BorrowVinylRecord(
      loanRepository,
      userRepository,
      vinylRecordRepository
    );

    const vinylRecord = await registerVinylRecord.execute({
      band: 'The Beatles',
      album: 'Abbey Road',
      year: 1969,
      numberOfTracks: 17,
      photoUrl: 'https://example.com/abbey-road.jpg',
      userId: 'user-1'
    });

    await expect(
      borrowVinylRecord.execute({
        userId: 'non-existent-user-id',
        vinylRecordId: vinylRecord.id,
      })
    ).rejects.toThrow('User not found');
  });

  it('should throw an error if the vinyl record is not found', async () => {
    const userRepository = MockUserRepository.getInstance();
    const vinylRecordRepository = MockVinylRecordRepository.getInstance();
    const loanRepository = MockLoanRepository.getInstance();

    const registerUser = new RegisterUser(userRepository);
    const borrowVinylRecord = new BorrowVinylRecord(
      loanRepository,
      userRepository,
      vinylRecordRepository
    );

    const user = await registerUser.execute({
      name: 'John Doe',
      email: 'john.doe7@example.com',
      password: 'P@ssword1',
    });

    await expect(
      borrowVinylRecord.execute({
        userId: user.id,
        vinylRecordId: 'non-existent-vinyl-record-id',
      })
    ).rejects.toThrow('Vinyl record not found');
  });
});
