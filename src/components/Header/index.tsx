'use client'

import Image from "next/image";
import logo from "../../assets/logo.svg"
import { SHeader } from "./styles";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <>
            <SHeader>
                <Link href={`/`}>
                    <Image src={logo} alt="Logo" priority={false} />
                </Link>
                <input type="checkbox" id="menu" />
                <nav>
                    <label htmlFor="menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                    <div>
                        {user ? (
                            <>
                                <span>Olá, {user.name.value}</span>
                                <Link href="/admin/loans">Meus Empréstimos</Link>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <Link href="/login">Login</Link>
                        )}
                    </div>
                </nav>
            </SHeader>
        </>
    )
}