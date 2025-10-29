import { render, screen } from '@testing-library/react';
import Detalhes from '@/app/detalhes/[id]/page';
import { makeVinylRecordUseCases } from '@/core/factories/makeVinylRecordUseCases';
import { useAuth } from '@/context/AuthContext';

jest.mock('@/core/factories/makeVinylRecordUseCases');
jest.mock('@/context/AuthContext');

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
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'user-1' } });

    render(<Detalhes params={{ id: '1' }} />);

    await screen.findByText('Banda AC/DC');

    expect(screen.getByText('Banda AC/DC')).toBeInTheDocument();
    expect(screen.getByText('Álbum: Back in Black')).toBeInTheDocument();
    expect(screen.getByText('Ano: 1980')).toBeInTheDocument();
    expect(screen.getByText('Músicas: 10')).toBeInTheDocument();
    expect(screen.getByText('Proprietário: Lázaro')).toBeInTheDocument();
  });
});
