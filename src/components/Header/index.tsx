import Image from "next/image";
import logo from "../../assets/logo.svg"
import { SHeader } from "./styles";
import Link from "next/link";

export function Header() {
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
                        <Link href="/login">Login</Link>
                    </div>
                </nav>
            </SHeader>
        </>
    )
}