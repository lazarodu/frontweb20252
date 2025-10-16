import { SMainDetalhes } from "@/components/MainDetalhes/styles";
import acdcg from "@/assets/acdcg.png"
import Image from "next/image";
import Link from "next/link";
import { makeVinylRecordUseCases } from "@/core/factories/makeVinylRecordUseCases";

export default async function Detalhes({ params: id }: { params: { id: string } }) {
    const vinylRecordUseCases = makeVinylRecordUseCases();
    const records = await vinylRecordUseCases.findVinylRecord.execute(id)
    return (
        <SMainDetalhes>
            <section>
                <Image src={acdcg} alt="Vinil ACDC" />
                <aside>
                    {records &&
                        <>
                            <h4>Banda {records.band.value}</h4>
                            <h5>Álbum: {records.album.value}</h5>
                            <h5>Ano: {records.year}</h5>
                            <h5>Músicas: {records.numberOfTracks}</h5>

                            <p>Proprietário: {records.user?.name.value}</p>
                            <Link href="/">voltar</Link>
                        </>
                    }
                </aside>
            </section>
        </SMainDetalhes>
    )
}