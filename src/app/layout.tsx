import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HELIOSPHERE — Solar System Simulator',
  description: 'Simulasi tata surya berbasis data sains NASA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
