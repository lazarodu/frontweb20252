import { IVinylRecordRepository } from '../../domain/repositories/IVinylRecordRepository';
import { VinylRecord } from '../../domain/entities/VinylRecord';
import { Name } from '../../domain/value-objects/Name';
import { Photo } from '../../domain/value-objects/Photo';
import { MockUserRepository } from './MockUserRepository';

export class MockVinylRecordRepository implements IVinylRecordRepository {
  private static instance: MockVinylRecordRepository;
  private records: VinylRecord[] = [{
    id: 'vinyl-1',
    band: Name.create('ACDC'),
    album: Name.create('Back in Black'),
    year: 1980,
    numberOfTracks: 10,
    photo: Photo.create('https://www'),
    userId: 'user-1'
  },{
    id: 'vinyl-2',
    band: Name.create('Beatles'),
    album: Name.create('Abbey Road'),
    year: 1969,
    numberOfTracks: 10,
    photo: Photo.create('https://www'),
    userId: 'user-1'
  },{
    id: 'vinyl-3',
    band: Name.create('Pink Floyd'),
    album: Name.create('The Dark Side of the Moon'),
    year: 1973,
    numberOfTracks: 10,
    photo: Photo.create('https://www'),
    userId: 'user-1'
  }];

  private constructor() {}

  public static getInstance(): MockVinylRecordRepository {
    if (!MockVinylRecordRepository.instance) {
      MockVinylRecordRepository.instance = new MockVinylRecordRepository();
    }
    return MockVinylRecordRepository.instance;
  }

  async save(record: VinylRecord): Promise<void> {
    this.records.push(record);
  }

  async findById(id: string): Promise<VinylRecord | null> {
    const record = this.records.find(record => record.id === id) || null;
    if(!record) return null
    if(record.userId)
      return {...record, user: await MockUserRepository.getInstance().findById(record.userId) || undefined}
    else
      return record
  }

  async findAll(): Promise<VinylRecord[]> {
    return Promise.all(this.records.map(async (r) => {
      if (r.userId) {
        const user = await MockUserRepository.getInstance().findById(r.userId) || undefined;
        return { ...r, user };
      }
      return { ...r };
    }));
  }

  async update(record: VinylRecord): Promise<void> {
    const recordIndex = this.records.findIndex(r => r.id === record.id);
    if (recordIndex !== -1) {
      this.records[recordIndex] = record;
    }
  }

  async delete(id: string): Promise<void> {
    this.records = this.records.filter(record => record.id !== id);
  }
  public reset(): void {
    this.records = [];
  }
}
