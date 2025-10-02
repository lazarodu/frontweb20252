'use client'
import { colors } from "@/styles/colors";
import styled from "styled-components";

export const SMainIndex = styled.main`
    min-height: calc(100vh - 8rem);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 1rem;
    padding: 1rem;

    section {
        border: 0.3rem solid ${colors.primary};
        border-radius: 0.5rem;
        display: flex;
        flex-direction: column;
    }
`