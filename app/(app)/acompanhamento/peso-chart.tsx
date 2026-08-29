"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function PesoChart({
  dados,
}: {
  dados: { label: string; peso: number }[];
}) {
  if (dados.length < 2) {
    return (
      <p className="py-8 text-center text-sm text-foreground-secondary">
        Registre seu peso por pelo menos 2 semanas pra ver o gráfico de
        evolução.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={dados} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--foreground-secondary)", fontSize: 10 }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
        />
        <YAxis
          domain={["dataMin - 1", "dataMax + 1"]}
          tick={{ fill: "var(--foreground-secondary)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--foreground-secondary)" }}
          itemStyle={{ color: "var(--accent)" }}
          formatter={(value) => [`${value} kg`, "Peso"]}
        />
        <Line
          type="monotone"
          dataKey="peso"
          stroke="var(--accent)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--accent)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
