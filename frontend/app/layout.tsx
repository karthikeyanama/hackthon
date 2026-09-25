import './globals.css';
import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/sidebar';

export const metadata: Metadata = {
  title: 'VeriMind AI',
  description: 'Multi-Agent Reasoning and Verification Engine',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950">
        <div className="mx-auto flex min-h-screen max-w-[1600px]"> 
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
