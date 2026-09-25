import Link from 'next/link';
import { ArrowRight, CheckCircle2, Cpu, Database, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentPipeline } from '@/components/agent-pipeline';

const features = [
  { icon: Workflow, title: 'Multi-agent workflow', text: 'Planner, research, tool, verifier, critic, and decision nodes all run in clear sequence.' },
  { icon: ShieldCheck, title: 'Independent verification', text: 'No agent can validate its own reasoning. Contradictions trigger revision or rejection.' },
  { icon: Database, title: 'Evidence-grounded retrieval', text: 'PGVector-powered retrieval and structured source citation packaging underpin every claim.' },
  { icon: Cpu, title: 'Sandboxed execution', text: 'Calculations and code verification happen in a restricted environment with timeouts and safeguards.' },
];

export default function LandingPage() {
  return (
    <div className="p-8">
      <div className="rounded-[30px] border border-white/10 bg-slate-950/60 p-8 shadow-glow">
        <div className="flex items-center justify-between">
          <div className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-brand-200">
            Enterprise verification layer
          </div>
          <Link href="/dashboard">
            <Button variant="secondary">Go to workspace</Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" /> Verified reasoning pipeline
            </div>
            <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-tight text-white">
              Reliable AI reasoning through independent verification.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              VeriMind AI turns probabilistic generation into an auditable evidence pipeline that can revise, reject, or accept outputs with explicit reasoning logs.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/dashboard">
                <Button size="lg">Launch dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </Link>
              <Link href="/audit">
                <Button variant="secondary" size="lg">View audit trail</Button>
              </Link>
            </div>
            <div className="mt-8 flex gap-8 text-sm text-slate-300">
              <div><span className="text-brand-300">94%</span> verification pass</div>
              <div><span className="text-brand-300">1.2x</span> avg. revisions</div>
              <div><span className="text-brand-300">98%</span> evidence coverage</div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-4">
            <AgentPipeline />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <Card key={title} className="h-full">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300">
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle>{title}</CardTitle>
              <p className="text-sm leading-6 text-slate-300">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Architecture preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm text-slate-300">
              {['Prompt → Planner → Research', 'Tool → Verifier → Critic', 'Decision → Finalizer → Audit'].map((line) => (
                <div key={line} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {line}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Safety guarantees</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>• Rejection when evidence is insufficient.</li>
              <li>• Contradiction detection across source documents.</li>
              <li>• Restricted execution sandbox and timeout protection.</li>
              <li>• Full decision and evidence audit trail for review.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
