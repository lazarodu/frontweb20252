import { FindVinylRecord } from '../../../domain/use-cases/FindVinylRecord';
import { RegisterVinylRecord } from '../../../domain/use-cases/RegisterVinylRecord';
import { MockVinylRecordRepository } from '../../../infra/mocks/MockVinylRecordRepository';
import { MockUserRepository } from '../../../infra/mocks/MockUserRepository';

describe('FindVinylRecord', () => {
  it('should find a vinyl record by id', async () => {
    const vinylRecordRepository = MockVinylRecordRepository.getInstance();
    const registerVinylRecord = new RegisterVinylRecord(vinylRecordRepository);
    const findVinylRecord = new FindVinylRecord(vinylRecordRepository);

    const record = await registerVinylRecord.execute({
      band: 'The Beatles',
      album: 'Abbey Road',
      year: 1969,
      numberOfTracks: 17,
      photoUrl: 'https://example.com/abbey-road.jpg',
      userId: 'user-1'
    });

    const foundRecord = await findVinylRecord.execute({ id: record.id });
    const user = await MockUserRepository.getInstance().findById('user-1');

    expect(foundRecord).toEqual({ ...record, user });
  });

  it('should return null if the record is not found', async () => {
    const vinylRecordRepository = MockVinylRecordRepository.getInstance();
    const findVinylRecord = new FindVinylRecord(vinylRecordRepository);

    const foundRecord = await findVinylRecord.execute({ id: '11' });

    expect(foundRecord).toBeNull();
  });
});
