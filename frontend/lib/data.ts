export const agentPipeline = [
  { name: 'Planner', status: 'complete', duration: '1.2s', confidence: 0.92, preview: 'Identified ambiguity and breakpoints.' },
  { name: 'Research', status: 'complete', duration: '2.9s', confidence: 0.95, preview: 'Retrieved 4 supporting sources.' },
  { name: 'Tool', status: 'active', duration: '1.8s', confidence: 0.88, preview: 'Executing validation against API schema.' },
  { name: 'Verifier', status: 'pending', duration: '0.7s', confidence: 0.81, preview: 'Comparison pass in progress.' },
  { name: 'Critic', status: 'pending', duration: '0.6s', confidence: 0.78, preview: 'Logical gap scan queued.' },
  { name: 'Decision', status: 'pending', duration: '0.4s', confidence: 0.9, preview: 'Final acceptance criteria pending.' },
  { name: 'Final', status: 'pending', duration: '0.3s', confidence: 0.94, preview: 'Preparing verified response.' },
];

export const dashboardStats = [
  { label: 'Verification Pass', value: '94%', change: '+12%' },
  { label: 'Hallucination Risk', value: '3.1%', change: '-2.1%' },
  { label: 'Avg. Revision', value: '1.2', change: '-0.4' },
  { label: 'Evidence Coverage', value: '98%', change: '+4%' },
];

export const verificationEvents = [
  { label: 'Planner', value: 92 },
  { label: 'Research', value: 96 },
  { label: 'Tool', value: 88 },
  { label: 'Verifier', value: 97 },
  { label: 'Critic', value: 91 },
  { label: 'Final', value: 94 },
];

export const auditTimeline = [
  { time: '09:11:14', step: 'Planner', detail: 'Task decomposed into evidence and tool requirements', confidence: 0.91 },
  { time: '09:11:18', step: 'Research', detail: 'Embedded source recall and citation ranking', confidence: 0.95 },
  { time: '09:11:27', step: 'Verifier', detail: 'Cross-checked claims against live API response', confidence: 0.97 },
  { time: '09:11:31', step: 'Critic', detail: 'Contradiction scan found no material gap', confidence: 0.90 },
  { time: '09:11:34', step: 'Decision', detail: 'Accepted with evidence summary and confidence score', confidence: 0.98 },
];

export const benchmarkRows = [
  { scenario: 'Ambiguous question', passRate: 92, hallucination: 4, revision: 1 },
  { scenario: 'Conflicting docs', passRate: 89, hallucination: 6, revision: 2 },
  { scenario: 'Fake API', passRate: 95, hallucination: 2, revision: 0 },
  { scenario: 'Incorrect math', passRate: 90, hallucination: 5, revision: 1 },
  { scenario: 'Unsupported claim', passRate: 96, hallucination: 1, revision: 0 },
];
