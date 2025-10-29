'use client'

import { SMainDetalhes } from "@/components/MainDetalhes/styles";
import acdcg from "@/assets/acdcg.png"
import Image from "next/image";
import Link from "next/link";
import { makeVinylRecordUseCases } from "@/core/factories/makeVinylRecordUseCases";
import { makeLoanUseCases } from "@/core/factories/makeLoanUseCases";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { VinylRecord } from "@/core/domain/entities/VinylRecord";
import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';

export default function Detalhes() {
    const params = useParams();
    const id = String(params.id); // Garante que é uma string
    const router = useRouter()
    const [record, setRecord] = useState<VinylRecord | null>(null);
    const vinylRecordUseCases = makeVinylRecordUseCases();
    const loanUseCases = makeLoanUseCases();
    const { user } = useAuth();

    useEffect(() => {
        async function fetchRecord() {
            const fetchedRecord = await vinylRecordUseCases.findVinylRecord.execute(id);
            setRecord(fetchedRecord);
        }
        fetchRecord();
    }, [id]);

    const handleBorrow = async () => {
        if (!user) {
            toast.error("Você precisa estar logado para pedir um vinil emprestado.");
            return;
        }
        if (record) {
            try {
                await loanUseCases.borrowVinylRecord.execute({ userId: user.id, vinylRecordId: record.id });
                toast.success("Vinil emprestado com sucesso!");
                router.push('/admin/loans')
            } catch (error) {
                toast.error(String(error));
            }
        }
    };

    if (!record) {
        return <SMainDetalhes><p>Carregando...</p></SMainDetalhes>;
    }

    return (
        <SMainDetalhes>
            <section>
                <Image src={acdcg} alt="Vinil ACDC" />
                <aside>
                    <h4>Banda {record.band.value}</h4>
                    <h5>Álbum: {record.album.value}</h5>
                    <h5>Ano: {record.year}</h5>
                    <h5>Músicas: {record.numberOfTracks}</h5>

                    <p>Proprietário: {record.user?.name.value}</p>
                    <Button onClick={handleBorrow}>Emprestar</Button>
                    <Link href="/">voltar</Link>
                </aside>
            </section>
        </SMainDetalhes>
    )
}