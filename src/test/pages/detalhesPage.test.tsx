import { render, screen } from '@testing-library/react';
import Detalhes from '@/app/detalhes/[id]/page';
import { makeVinylRecordUseCases } from '@/core/factories/makeVinylRecordUseCases';

jest.mock('@/core/factories/makeVinylRecordUseCases');

describe('Detalhes', () => {
  it('should render the vinyl record details', async () => {
    const mockFindVinylRecord = {
      execute: jest.fn().mockResolvedValue({
        id: '1',
        band: { value: 'AC/DC' },
        album: { value: 'Back in Black' },
        year: 1980,
        numberOfTracks: 10,
        user: { name: { value: 'Lázaro' } },
      }),
    };
    (makeVinylRecordUseCases as jest.Mock).mockReturnValue({
      findVinylRecord: mockFindVinylRecord,
    });

    render(await Detalhes({ params: { id: '1' } }));

    expect(screen.getByText('Banda AC/DC')).toBeInTheDocument();
    expect(screen.getByText('Álbum: Back in Black')).toBeInTheDocument();
    expect(screen.getByText('Ano: 1980')).toBeInTheDocument();
    expect(screen.getByText('Músicas: 10')).toBeInTheDocument();
    expect(screen.getByText('Proprietário: Lázaro')).toBeInTheDocument();
  });
});
