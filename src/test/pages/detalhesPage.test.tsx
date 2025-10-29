import React from 'react';
import { render, screen } from '@testing-library/react';
import Detalhes from '@/app/detalhes/[id]/page';
import { makeVinylRecordUseCases } from '@/core/factories/makeVinylRecordUseCases';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';

jest.mock('@/core/factories/makeVinylRecordUseCases');
jest.mock('@/context/AuthContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));
const mockUseParams = useParams as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('Detalhes', () => {
  // 4. Defina o retorno dos mocks antes de cada teste
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: '1' });
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
    });
  });
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

    render(React.createElement(Detalhes, { params: { id: '1' } }));

    await screen.findByText('Banda AC/DC');

    expect(screen.getByText('Banda AC/DC')).toBeInTheDocument();
    expect(screen.getByText('Álbum: Back in Black')).toBeInTheDocument();
    expect(screen.getByText('Ano: 1980')).toBeInTheDocument();
    expect(screen.getByText('Músicas: 10')).toBeInTheDocument();
    expect(screen.getByText('Proprietário: Lázaro')).toBeInTheDocument();
  });
});
