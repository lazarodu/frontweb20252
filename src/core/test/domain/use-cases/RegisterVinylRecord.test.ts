import { RegisterVinylRecord } from '../../../domain/use-cases/RegisterVinylRecord';
import { MockVinylRecordRepository } from '../../../infra/mocks/MockVinylRecordRepository';

describe('RegisterVinylRecord', () => {
  it('should register a new vinyl record', async () => {
    const vinylRecordRepository = MockVinylRecordRepository.getInstance();
    const registerVinylRecord = new RegisterVinylRecord(vinylRecordRepository);

    const record = await registerVinylRecord.execute({
      band: 'The Beatles',
      album: 'Abbey Road',
      year: 1969,
      numberOfTracks: 17,
      photoUrl: 'https://example.com/abbey-road.jpg',
      userId: 'user-1'
    });

    expect(record).toBeDefined();
    expect(record.band.value).toBe('The Beatles');
    expect(record.album.value).toBe('Abbey Road');

    const foundRecord = await vinylRecordRepository.findById(record.id);
    expect(foundRecord).toBe(record);
  });
});
