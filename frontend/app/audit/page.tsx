import { CheckCircle2, ShieldAlert, TimerReset } from 'lucide-react';
import { auditTimeline } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuditPage() {
  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Audit report</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Session 08-214</h1>
        </div>
        <div className="rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-sm text-brand-200">Accepted</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Evidence timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {auditTimeline.map((event) => (
                <div key={event.step} className="relative pl-6">
                  <div className="absolute left-0 top-0 h-full w-px bg-white/10" />
                  <div className="absolute left-[-5px] top-2 h-3 w-3 rounded-full bg-brand-400" />
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                      <span>{event.time}</span>
                      <span>{event.step}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-200">{event.detail}</p>
                    <p className="mt-3 text-xs text-brand-200">Confidence {(event.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Decision summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Accept</div>
                <div className="flex items-center gap-3"><ShieldAlert className="h-4 w-4 text-amber-300" /> 0 contradictions</div>
                <div className="flex items-center gap-3"><TimerReset className="h-4 w-4 text-cyan-300" /> 1 revision</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evidence package</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>• Source: MDN Web Docs</li>
                <li>• Claim: HTTP 404 indicates resource not found.</li>
                <li>• Confidence: 0.98</li>
                <li>• Verification: matched live status code and schema</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
