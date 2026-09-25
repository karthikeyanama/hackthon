'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock3, LoaderCircle, WandSparkles } from 'lucide-react';
import { agentPipeline } from '@/lib/data';

const statusStyles = {
  complete: 'text-emerald-300',
  active: 'text-brand-300',
  pending: 'text-slate-400',
};

export function AgentPipeline() {
  return (
    <div className="space-y-4">
      {agentPipeline.map((agent, index) => (
        <motion.div
          key={agent.name}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 }}
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/50 p-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-200">
            {agent.status === 'complete' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : agent.status === 'active' ? <LoaderCircle className="h-5 w-5 animate-spin text-brand-400" /> : <Clock3 className="h-5 w-5 text-slate-400" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{agent.name}</p>
                <p className="text-xs text-slate-400">{agent.preview}</p>
              </div>
              <span className={`text-xs uppercase tracking-[0.2em] ${statusStyles[agent.status as keyof typeof statusStyles]}`}>
                {agent.status}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Duration: {agent.duration}</span>
              <span>Confidence: {(agent.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
