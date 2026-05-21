import type { Metadata } from 'next';
import './globals.css';
import DashboardLayout from './components/dashboard-layout';

export const metadata: Metadata = {
  title: 'JARAKI-PONTO | JFAM',
  description: 'Controle de Frequência Eletrônica - Justiça Federal do Amazonas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="antialiased">
      <body>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}