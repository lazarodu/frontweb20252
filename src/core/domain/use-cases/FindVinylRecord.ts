import { VinylRecord } from '../entities/VinylRecord';
import { IVinylRecordRepository } from '../repositories/IVinylRecordRepository';

export class FindVinylRecord {
  constructor(private readonly vinylRecordRepository: IVinylRecordRepository) {}

  async execute(id: string): Promise<VinylRecord | null> {
    return this.vinylRecordRepository.findById(id);
  }
}
