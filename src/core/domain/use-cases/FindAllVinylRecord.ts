import { VinylRecord } from '../entities/VinylRecord';
import { IVinylRecordRepository } from '../repositories/IVinylRecordRepository';

export class FindAllVinylRecord {
  constructor(private readonly vinylRecordRepository: IVinylRecordRepository) {}

  async execute(): Promise<VinylRecord[]> {
    return this.vinylRecordRepository.findAll();
  }
}
