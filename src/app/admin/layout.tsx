'use client'

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        console.log(user)
        if (user === null) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        // You can render a loading spinner or null here
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
                <p>Redirecionando para o login...</p>
            </div>
        );
    }

    return <>{children}</>;
}
