import { ArrowUpRight } from 'lucide-react';

export function MetricCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
        <span>{label}</span>
        <ArrowUpRight className="h-4 w-4 text-emerald-400" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-3xl font-semibold text-white">{value}</p>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
          {change}
        </span>
      </div>
    </div>
  );
}
