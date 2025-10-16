import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { makeVinylRecordUseCases } from '@/core/factories/makeVinylRecordUseCases';

jest.mock('@/core/factories/makeVinylRecordUseCases');

describe('Home', () => {
  it('should render the vinyl records', async () => {
    const mockFindAllVinylRecord = {
      execute: jest.fn().mockResolvedValue([
        {
          id: '1',
          band: { value: 'AC/DC' },
          user: { name: { value: 'Lázaro' } },
        },
      ]),
    };
    (makeVinylRecordUseCases as jest.Mock).mockReturnValue({
      findAllVinylRecord: mockFindAllVinylRecord,
    });

    render(await Home());

    expect(screen.getByText('Título: AC/DC')).toBeInTheDocument();
    expect(screen.getByText('Proprietário: Lázaro')).toBeInTheDocument();
  });
});
