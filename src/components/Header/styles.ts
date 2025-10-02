'use client'
import { colors } from "@/styles/colors";
import styled from "styled-components";

export const SDark = styled.input`
    display: none;
`

export const SHeader = styled.header`
    display: flex;
    justify-content: space-between;
    border-bottom: 0.5rem solid ${colors.secondary};
    height: 5rem;

    img {
        padding: 0.5rem;
    }

    input {
        display: none;
    }

    nav {
        padding: 0.5rem;
        display: flex;
        align-items: center;

        a {
            padding: 0.7rem;
            background-color: ${colors.secondary};
            text-decoration: none;
            border-radius: 0.7rem;
        }
    }
`
