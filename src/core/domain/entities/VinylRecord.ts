import { Name } from '../value-objects/Name';
import { Photo } from '../value-objects/Photo';
import { User } from './User';

export class VinylRecord {
  private constructor(
    readonly id: string,
    readonly band: Name,
    readonly album: Name,
    readonly year: number,
    readonly numberOfTracks: number,
    readonly photo: Photo,
    readonly userId?: string,
    readonly user?: User
  ) {}

  static create(
    id: string,
    band: Name,
    album: Name,
    year: number,
    numberOfTracks: number,
    photo: Photo,
    userId?: string,
    user?: User
  ): VinylRecord {
    return new VinylRecord(id, band, album, year, numberOfTracks, photo, userId, user);
  }
}
