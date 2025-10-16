import { render, screen } from '@testing-library/react';
import { VinylForm } from '@/components/VinylForm';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

describe('VinylForm', () => {
  it('should render the form', () => {
    render(
      <Dialog open onOpenChange={() => { }}>
        <DialogContent>
          <DialogTitle className="sr-only">Form</DialogTitle>
          <VinylForm vinyl={null} onSave={() => { }} onCancel={() => { }} />
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByLabelText('Banda')).toBeInTheDocument();
    expect(screen.getByLabelText('Album')).toBeInTheDocument();
    expect(screen.getByLabelText('Ano')).toBeInTheDocument();
    expect(screen.getByLabelText('Número de Músicas')).toBeInTheDocument();
    expect(screen.getByLabelText('Imagem')).toBeInTheDocument();
  });
});
