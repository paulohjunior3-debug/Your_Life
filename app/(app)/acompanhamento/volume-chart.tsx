"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function VolumeChart({
  dados,
}: {
  dados: { label: string; volume: number }[];
}) {
  if (dados.length < 2) {
    return (
      <p className="py-8 text-center text-sm text-foreground-secondary">
        Registre treinos por pelo menos 2 semanas pra ver o gráfico de
        volume.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={dados} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--foreground-secondary)", fontSize: 10 }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
        />
        <YAxis
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
          itemStyle={{ color: "var(--status-info)" }}
          formatter={(value) => [`${Number(value).toLocaleString("pt-BR")} kg`, "Volume"]}
        />
        <Bar dataKey="volume" fill="var(--status-info)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
