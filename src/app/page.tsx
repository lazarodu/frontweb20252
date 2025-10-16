// 'use client'
import { SMainIndex } from "@/components/MainIndex/styles";
import Image from "next/image";
import acdc from "../assets/acdc.png"
import Link from "next/link";
import { makeVinylRecordUseCases } from "../core/factories/makeVinylRecordUseCases";
// import { useEffect, useState } from "react";
// import { VinylRecord } from "@/core/domain/entities/VinylRecord";

export default async function Home() {
  const vinylRecordUseCases = makeVinylRecordUseCases();
  const records = await vinylRecordUseCases.findAllVinylRecord.execute();
  // const [records, setRecords] = useState<VinylRecord[]>([]);
  // useEffect(() => {
  //   async function fetchRecords() {
  //     try {
  //       const allRecords = await vinylRecordUseCases.findAllVinylRecord.execute()
  //       setRecords(allRecords);
  //     } catch (err) {
  //       alert(err)
  //     }
  //   }
  //   fetchRecords()
  // }, [])
  
  return (
    <SMainIndex>
      {records && records.map((i) => (
      <section key={i.id}>
        <Image src={acdc} alt="Vinil ACDC" />
        <h5>Título: {i.band.value}</h5>
        <p>Proprietário: {i.user?.name.value}</p>
        <Link href={`detalhes/${i.id}`}>ver</Link>
      </section>
      ))}
    </SMainIndex>
  );
}
