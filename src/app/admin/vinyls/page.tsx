'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { VinylForm, VinylInterface } from "@/components/VinylForm";
import { makeVinylRecordUseCases } from "../../../core/factories/makeVinylRecordUseCases";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function VinylsPage() {
    const [vinyls, setVinyls] = useState<VinylInterface[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVinyl, setEditingVinyl] = useState<VinylInterface | null>(null);
    const vinylRecordUseCases = makeVinylRecordUseCases();
    const { user } = useAuth()

    async function fetchRecords() {
        try {
            const allRecords = await vinylRecordUseCases.findAllVinylRecord.execute()
            setVinyls(allRecords.map((a) => ({
                id: a.id, band: a.band.value, album: a.album.value,
                numberOfTracks: a.numberOfTracks, year: a.year, photo: a.photo.url
            })));
        } catch (err) {
            alert(err)
        }
    }
    useEffect(() => {
        fetchRecords()
    }, [])

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este vinil?')) {
            // setVinyls(vinyls.filter(v => v.id !== id));
            try {
                await vinylRecordUseCases.deleteVinylRecord.execute({ id })
                await fetchRecords()
                toast.success("Vinil apagado!")
            } catch (error) {
                toast.error(String(error))
            }
        }
    };

    const handleAdd = () => {
        setEditingVinyl(null); // Clear any previous editing state
        setIsDialogOpen(true);
    };

    const handleEdit = (vinyl: VinylInterface) => {
        setEditingVinyl(vinyl);
        setIsDialogOpen(true);
    };

    const handleSave = async (formData: Omit<VinylInterface, 'id'> & { id: string }) => {
        console.log(formData)
        if (editingVinyl) { // Editing existing vinyl
            try {
                await vinylRecordUseCases.updateVinylRecord.execute({
                    band: formData.band, album: formData.album, year: formData.year,
                    numberOfTracks: formData.numberOfTracks, photoUrl: formData.photo,
                    id: formData.id
                })
                await fetchRecords()
                toast.success("Vinil Atualizado!")
            } catch (error) {
                toast.error(String(error))
            }
        } else { // Adding new vinyl
            try {
                if (!user?.id) {
                    toast.error("Usuário não autenticado!")
                } else {
                    await vinylRecordUseCases.registerVinylRecord.execute({
                        band: formData.band, album: formData.album, year: formData.year,
                        numberOfTracks: formData.numberOfTracks, photoUrl: formData.photo,
                        userId: user?.id
                    })
                    await fetchRecords()
                    toast.success("Vinil Cadastrado!")
                }
            } catch (error) {
                toast.error(String(error))
            }
        }
        setIsDialogOpen(false);
        setEditingVinyl(null);
    };

    return (
        <main className="container mx-auto py-10 min-h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciar Vinis</h1>
                <Button onClick={handleAdd}>Adicionar Vinil</Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Banda</TableHead>
                            <TableHead>Álbum</TableHead>
                            <TableHead>Ano</TableHead>
                            <TableHead>Músicas</TableHead>
                            <TableHead>Photo</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vinyls.map((vinyl) => (
                            <TableRow key={vinyl.id}>
                                <TableCell className="font-medium">{vinyl.band}</TableCell>
                                <TableCell>{vinyl.album}</TableCell>
                                <TableCell>{vinyl.year}</TableCell>
                                <TableCell>{vinyl.numberOfTracks}</TableCell>
                                <TableCell>{vinyl.photo}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEdit(vinyl)}>Editar</Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(vinyl.id)}>Excluir</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <VinylForm
                        vinyl={editingVinyl}
                        onSave={handleSave}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </main>
    );
}
