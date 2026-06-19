import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EJEP | Diagnóstico Gratuito para sua Empresa",
  description: "Descubra o que está travando o crescimento da sua empresa. Faça um diagnóstico gratuito com a EJEP e comece a escalar com controle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
