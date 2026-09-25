'use client';

import { FormEvent, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, LoaderCircle, Search, ShieldCheck, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type VerificationResult = {
  claim: string;
  passed: boolean;
  reason: string;
  confidence: number;
  status: string;
};

type ChatResult = {
  session_id: string;
  decision: string;
  confidence: number;
  answer: string;
  evidence: { title: string; source: string; content: string; confidence: number }[];
  verification_results: VerificationResult[];
  warnings: { type: string; message: string; severity: string }[];
  revision_count: number;
};

const stages = ['Planner', 'Research', 'Tool', 'Verifier', 'Critic', 'Decision', 'Finalizer'];

export default function VerifyPage() {
  const [task, setTask] = useState('Verify whether this API exists and explain what it returns: https://jsonplaceholder.typicode.com/users');
  const [result, setResult] = useState<ChatResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.detail ?? `Verification failed with HTTP ${response.status}.`);
      }
      setResult(body as ChatResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to reach the verification service.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Interactive test bench</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Ask VeriMind a question</h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          Submit a question and inspect the complete verification trail. URLs are checked live, calculations are recomputed, code blocks are compiled, and unsupported facts are marked unknown instead of being invented.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitTask} className="space-y-4">
            <textarea
              value={task}
              onChange={(event) => setTask(event.target.value)}
              className="min-h-32 w-full rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-sm text-white outline-none ring-brand-400 placeholder:text-slate-500 focus:ring-2"
              placeholder="Ask a factual, mathematical, API, or code verification question..."
              minLength={3}
              required
            />
            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                {loading ? 'Running verification...' : 'Run verification'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setTask('Verify this calculation: 125 * 8 = 900')}
              >
                Try math test
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setTask('Verify whether this API exists: https://this-api-does-not-exist.example/api')}
              >
                Try rejection test
              </Button>
            </div>
          </form>
          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div><p className="font-medium">Verification request failed</p><p className="mt-1">{error}</p></div>
            </div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardHeader><CardTitle>Working trail</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
              {stages.map((stage) => (
                <div key={stage} className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3 text-center">
                  <LoaderCircle className="mx-auto h-4 w-4 animate-spin text-brand-300" />
                  <p className="mt-2 text-xs text-slate-200">{stage}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-brand-200">running</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Working trail completed</CardTitle>
              <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-wider ${result.decision === 'accept' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                {result.decision}
              </span>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                <Metric label="Confidence" value={`${(result.confidence * 100).toFixed(1)}%`} />
                <Metric label="Revisions" value={String(result.revision_count)} />
                <Metric label="Evidence items" value={String(result.evidence.length)} />
                <Metric label="Session" value={result.session_id} />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-4 xl:grid-cols-7">
                {stages.map((stage, index) => (
                  <div key={stage} className="rounded-xl border border-white/10 bg-slate-900/70 p-3 text-center">
                    {index < 5 ? <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-400" /> : result.decision === 'reject' ? <XCircle className="mx-auto h-4 w-4 text-red-400" /> : <ShieldCheck className="mx-auto h-4 w-4 text-brand-300" />}
                    <p className="mt-2 text-xs text-slate-200">{stage}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{index < 5 ? 'passed' : result.decision}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader><CardTitle>Final response</CardTitle></CardHeader>
              <CardContent>
                <p className="leading-7 text-slate-200">{result.answer}</p>
                <div className="mt-5 space-y-3">
                  {result.verification_results.map((item, index) => (
                    <div key={`${item.claim}-${index}`} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                      <div className="flex items-start gap-3">
                        {item.passed ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" /> : <XCircle className="mt-0.5 h-4 w-4 text-red-400" />}
                        <div className="min-w-0">
                          <p className="text-sm text-white">{item.claim}</p>
                          <p className="mt-1 text-xs text-slate-400">{item.reason}</p>
                        </div>
                        <span className="ml-auto shrink-0 text-xs text-brand-200">{(item.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Evidence and warnings</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.evidence.length === 0 ? <p className="text-sm text-slate-400">No evidence was found.</p> : result.evidence.map((item) => (
                    <div key={`${item.source}-${item.title}`} className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-xs text-brand-200">{item.source} · {(item.confidence * 100).toFixed(0)}% confidence</p>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{item.content}</p>
                    </div>
                  ))}
                  {result.warnings.map((warning) => (
                    <div key={warning.message} className="flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                      <AlertTriangle className="h-4 w-4 shrink-0" /> {warning.message}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
