
'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { makeLoanUseCases } from "@/core/factories/makeLoanUseCases";
import { toast } from "sonner";
import { Loan } from "@/core/domain/entities/Loan";
import { useAuth } from "@/context/AuthContext";

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const loanUseCases = makeLoanUseCases();
    const { user } = useAuth()

    async function fetchLoans() {
        try {
            if(user?.id) {
                const allLoans = await loanUseCases.findLoansByUser.execute({ userId: user.id })
                setLoans(allLoans);
            }
        } catch (err) {
            alert(err)
        }
    }
    useEffect(() => {
        fetchLoans()
    }, [user])

    const handleReturn = async (loanId: string) => {
        if (confirm('Tem certeza que deseja devolver este vinil?')) {
            try {
                await loanUseCases.returnVinylRecord.execute({ loanId })
                await fetchLoans()
                toast.success("Vinil devolvido!")
            } catch (error) {
                toast.error(String(error))
            }
        }
    };

    return (
        <main className="container mx-auto py-10 min-h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Meus Empréstimos</h1>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vinil</TableHead>
                            <TableHead>Data do Empréstimo</TableHead>
                            <TableHead>Data da Devolução</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loans.map((loan) => (
                            <TableRow key={loan.id}>
                                <TableCell className="font-medium">{loan.vinylRecord?.band.value} - {loan.vinylRecord?.album.value}</TableCell>
                                <TableCell>{loan.loanDate.toLocaleDateString()}</TableCell>
                                <TableCell>{loan.returnDate ? loan.returnDate.toLocaleDateString() : 'Não devolvido'}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    {!loan.returnDate && (
                                        <Button variant="outline" size="sm" onClick={() => handleReturn(loan.id)}>Devolver</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}
