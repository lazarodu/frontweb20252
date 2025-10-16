'use client'
import { useState } from "react";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// data structure
export interface VinylInterface {
  id: string;
  band: string;
  album: string;
  year: number;
  numberOfTracks: number;
  photo: string;
}

// Form Component
interface VinylFormProps {
  vinyl: VinylInterface | null;
  onSave: (data: Omit<VinylInterface, 'id'> & { id: string }) => void;
  onCancel: () => void;
}

export function VinylForm({ vinyl, onSave, onCancel }: VinylFormProps) {
  const [formData, setFormData] = useState({
    id: vinyl?.id || '',
    band: vinyl?.band || '',
    album: vinyl?.album || '',
    year: vinyl?.year || new Date().getFullYear(),
    numberOfTracks: vinyl?.numberOfTracks || 0,
    photo: vinyl?.photo || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{vinyl ? 'Editar Vinil' : 'Adicionar Vinil'}</DialogTitle>
        <DialogDescription>
          {vinyl ? 'Altere os detalhes do seu vinil.' : 'Adicione um novo vinil à sua coleção.'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="band" className="text-right">Banda</Label>
          <Input id="band" value={formData.band} onChange={(e) => setFormData({ ...formData, band: e.target.value })} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="album" className="text-right">Album</Label>
          <Input id="album" value={formData.album} onChange={(e) => setFormData({ ...formData, album: e.target.value })} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="year" className="text-right">Ano</Label>
          <Input id="year" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="numberOfTracks" className="text-right">Número de Músicas</Label>
          <Input id="numberOfTracks" type="number" value={formData.numberOfTracks} onChange={(e) => setFormData({ ...formData, numberOfTracks: Number(e.target.value) })} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="photo" className="text-right">Imagem</Label>
          <Input id="photo" type="url" value={formData.photo} onChange={(e) => setFormData({ ...formData, photo: e.target.value })} className="col-span-3" required />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  );
}
