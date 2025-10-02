'use client'
import { colors } from "@/styles/colors";
import styled from "styled-components";

export const SMainDetalhes = styled.main`
    min-height: calc(100vh - 8rem);
        display: flex;
        justify-content: center;

        section {
            border: 0.3rem solid ${colors.primary};
            border-radius: 0.5rem;
            display: flex;

            img {
                width: 50%;
                height: auto;
                object-fit: fill;
            }

            aside {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 50%;
            }
        }
`