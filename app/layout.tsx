import type { Metadata } from 'next';
import { DashboardLayout } from './components/dashboard-layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Orbund SIS - Dashboard',
  description: 'Student Information System Clone',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased min-h-screen transition-colors duration-300">
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}