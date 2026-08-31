"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function ComposicaoChart({
  percentualGordura,
}: {
  percentualGordura: number;
}) {
  const massaMagra = Math.max(0, 100 - percentualGordura);
  const dados = [
    { name: "Gordura", value: percentualGordura },
    { name: "Massa magra", value: massaMagra },
  ];
  const cores = ["var(--status-partial)", "var(--accent)"];

  return (
    <ResponsiveContainer width="100%" height={140}>
      <PieChart>
        <Pie
          data={dados}
          dataKey="value"
          nameKey="name"
          innerRadius={38}
          outerRadius={60}
          paddingAngle={2}
          stroke="none"
        >
          {dados.map((entrada, i) => (
            <Cell key={entrada.name} fill={cores[i]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--foreground-secondary)" }}
          formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
