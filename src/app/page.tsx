import { SMainIndex } from "@/components/MainIndex/styles";
import Image from "next/image";
import acdc from "../assets/acdc.png"
import Link from "next/link";

export default function Home() {
  return (
    <SMainIndex>
      <section>
        <Image src={acdc} alt="Vinil ACDC" />
        <h5>Título: ACDC</h5>
        <p>Proprietário: Lázaro</p>
        <Link href="detalhes/1">ver</Link>
      </section>
      <section>
        <Image src={acdc} alt="Vinil ACDC" />
        <h5>Título: ACDC</h5>
        <p>Proprietário: Lázaro</p>
        <Link href="detalhes/2">ver</Link>
      </section>
      <section>
        <Image src={acdc} alt="Vinil ACDC" />
        <h5>Título: ACDC</h5>
        <p>Proprietário: Lázaro</p>
        <Link href="detalhes/3">ver</Link>
      </section>
      <section>
        <Image src={acdc} alt="Vinil ACDC" />
        <h5>Título: ACDC</h5>
        <p>Proprietário: Lázaro</p>
        <Link href="detalhes/4">ver</Link>
      </section>
      <section>
        <Image src={acdc} alt="Vinil ACDC" />
        <h5>Título: ACDC</h5>
        <p>Proprietário: Lázaro</p>
        <Link href="detalhes/5">ver</Link>
      </section>
    </SMainIndex>
  );
}
