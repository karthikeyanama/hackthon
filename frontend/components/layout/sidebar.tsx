import Link from 'next/link';
import { BrainCircuit, FileText, Gauge, History, LayoutDashboard, MessageSquareText, ShieldCheck, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Landing', icon: Sparkles },
  { href: '/verify', label: 'Test a question', icon: MessageSquareText },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/audit', label: 'Audit', icon: FileText },
  { href: '/evaluation', label: 'Evaluation', icon: Gauge },
  { href: '/dashboard', label: 'History', icon: History },
  { href: '/audit', label: 'Settings', icon: ShieldCheck },
];

export function Sidebar() {
  return (
    <aside className="w-72 border-r border-white/10 bg-slate-950/60 p-5 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400 shadow-glow">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.26em] text-slate-400">VeriMind</p>
          <p className="text-lg font-semibold text-white">AI Engine</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-slate-300 transition hover:border-white/10 hover:bg-slate-900/80 hover:text-white"
          >
            <Icon className="h-4 w-4 text-brand-300" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-200">Session status</p>
        <p className="mt-2 text-xl font-semibold text-white">Verified</p>
        <p className="mt-1 text-sm text-slate-300">Confidence 96.4% · 1 revision</p>
      </div>
    </aside>
  );
}
