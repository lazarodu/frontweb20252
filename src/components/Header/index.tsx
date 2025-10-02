import Image from "next/image";
import logo from "../../assets/logo.svg"
import { SDark, SHeader } from "./styles";

export function Header() {
    return (
        <>
            <SDark type="checkbox" id="theme" />
            <SHeader className="container">
                <Image src={logo} alt="Logo" priority={false} />
                <input type="checkbox" id="menu" />
                <nav>
                    <label htmlFor="menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                    <div>
                        <label htmlFor="theme" className="switch">Trocar</label>
                        <a href="">Login</a>
                    </div>
                </nav>
            </SHeader>
        </>
    )
}