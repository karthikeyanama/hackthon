import { Activity, CheckCircle2, Cpu, Database, ShieldAlert } from 'lucide-react';
import { AgentPipeline } from '@/components/agent-pipeline';
import { VerificationChart } from '@/components/charts/verification-chart';
import { MetricCard } from '@/components/metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardStats, verificationEvents } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Workspace</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Verification Dashboard</h1>
        </div>
        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Healthy system</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <MetricCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Live workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentPipeline />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.26em] text-brand-200">current confidence</p>
              <p className="mt-3 text-5xl font-semibold text-white">96.4%</p>
              <p className="mt-2 text-sm text-slate-300">Evidence-backed and accepted</p>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Fact verification passed</div>
              <div className="flex items-center gap-3"><Cpu className="h-4 w-4 text-brand-300" /> Tool output matched expected schema</div>
              <div className="flex items-center gap-3"><Database className="h-4 w-4 text-cyan-300" /> RAG evidence coverage above threshold</div>
              <div className="flex items-center gap-3"><ShieldAlert className="h-4 w-4 text-amber-300" /> No contradiction or unsupported claim</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Verification funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <VerificationChart data={verificationEvents} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent timing</CardTitle>
          </CardHeader>
          <CardContent>
            {[
              { label: 'Planner', value: '1.2s', icon: Activity },
              { label: 'Research', value: '2.9s', icon: Database },
              { label: 'Verifier', value: '0.9s', icon: Activity },
              { label: 'Decision', value: '0.4s', icon: CheckCircle2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Icon className="h-4 w-4 text-brand-300" />
                  {label}
                </div>
                <span className="text-sm font-medium text-white">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
