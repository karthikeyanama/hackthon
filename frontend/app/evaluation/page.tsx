import { BarChart3, BadgeCheck, ShieldAlert, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { benchmarkRows } from '@/lib/data';

export default function EvaluationPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Benchmarks</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Evaluation dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Pass rate', value: '92.4%', icon: BadgeCheck },
          { label: 'Hallucination detection', value: '97.8%', icon: ShieldAlert },
          { label: 'Verification accuracy', value: '95.1%', icon: TrendingUp },
          { label: 'Contradiction recall', value: '90.7%', icon: BarChart3 },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between gap-4 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300">
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Benchmark scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="pb-3">Scenario</th>
                  <th className="pb-3">Pass rate</th>
                  <th className="pb-3">Hallucination</th>
                  <th className="pb-3">Revision</th>
                </tr>
              </thead>
              <tbody>
                {benchmarkRows.map((row) => (
                  <tr key={row.scenario} className="border-t border-white/10">
                    <td className="py-3">{row.scenario}</td>
                    <td className="py-3">{row.passRate}%</td>
                    <td className="py-3">{row.hallucination}%</td>
                    <td className="py-3">{row.revision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
