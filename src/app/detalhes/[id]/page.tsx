import { SMainDetalhes } from "@/components/MainDetalhes/styles";
import acdcg from "../../../assets/acdcg.png"
import Image from "next/image";
import Link from "next/link";

export default function Detalhes({ params }: { params: { id: string } }) {
    return (
        <SMainDetalhes>
            <section>
                <Image src={acdcg} alt="Vinil ACDC" />
                <aside>
                    <h4>Banda {params.id}: ACDC</h4>
                    <h5>Álbum: Back in Black</h5>
                    <h5>Ano: 1980</h5>
                    <h5>Músicas: 10</h5>

                    <p>Proprietário: Lázaro</p>
                    <p>Disponível: Sim</p>
                    <Link href="/">voltar</Link>
                </aside>
            </section>
        </SMainDetalhes>
    )
}