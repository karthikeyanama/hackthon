'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function VerificationChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="verificationFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
          <XAxis dataKey="label" stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis domain={[0, 100]} stroke="#94a3b8" tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#020817',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              color: '#e2e8f0',
            }}
          />
          <Area type="monotone" dataKey="value" stroke="#60a5fa" fillOpacity={1} fill="url(#verificationFill)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
