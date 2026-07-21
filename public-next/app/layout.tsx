import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduPlatform | Catálogo público de cursos',
  description: 'Explora nuestro catálogo de cursos. Plataforma de Gestión de Cursos e Inscripciones - ISIL PW II.',
};

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:5173';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="topbar">
          <div className="container topbar-inner">
            <Link href="/" className="brand">🎓 EduPlatform</Link>
            <a className="cta" href={PORTAL_URL}>Ingresar al portal</a>
          </div>
        </header>
        {children}
        <footer className="footer">
          <div className="container">
            Vista pública generada con Next.js (SSG + ISR) · Plataforma de Gestión de Cursos e Inscripciones
          </div>
        </footer>
      </body>
    </html>
  );
}
