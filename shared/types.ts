export type AgentStatus = 'complete' | 'active' | 'pending';

export interface AgentMetric {
  name: string;
  status: AgentStatus;
  duration: string;
  confidence: number;
  preview: string;
}

export interface EvidenceItem {
  title: string;
  source: string;
  confidence: number;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}
