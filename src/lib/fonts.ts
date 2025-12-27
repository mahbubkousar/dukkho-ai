import { Hind_Siliguri, Galada, Noto_Serif_Bengali } from "next/font/google";

export const hindSiliguri = Hind_Siliguri({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["bengali", "latin"],
    variable: "--font-hind-siliguri",
    display: "swap",
});

export const galada = Galada({
    weight: "400",
    subsets: ["bengali", "latin"],
    variable: "--font-galada",
    display: "swap",
});

export const notoSerifBengali = Noto_Serif_Bengali({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["bengali", "latin"],
    variable: "--font-noto-serif-bengali",
    display: "swap",
});
