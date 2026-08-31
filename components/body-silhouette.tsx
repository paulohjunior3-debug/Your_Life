import type { Sexo } from "@/lib/supabase/types";

export function BodySilhouette({
  sexo,
  className,
}: {
  sexo: Sexo | null | undefined;
  className?: string;
}) {
  const feminino = sexo === "feminino";

  return (
    <svg
      viewBox="0 0 100 200"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="50" cy="20" r={feminino ? 13 : 14} />
      <rect x="44" y={feminino ? 31 : 32} width="12" height="10" rx="3" />

      {feminino ? (
        <path d="M28 42 L40 70 L26 100 L74 100 L60 70 L72 42 Z" />
      ) : (
        <path d="M20 44 L80 44 L66 96 L34 96 Z" />
      )}
      {feminino ? (
        <>
          <circle cx="28" cy="42" r="6" />
          <circle cx="72" cy="42" r="6" />
        </>
      ) : (
        <>
          <circle cx="20" cy="44" r="6" />
          <circle cx="80" cy="44" r="6" />
        </>
      )}

      {feminino ? (
        <>
          <rect x="14" y="44" width="12" height="66" rx="6" />
          <rect x="74" y="44" width="12" height="66" rx="6" />
        </>
      ) : (
        <>
          <rect x="10" y="46" width="14" height="70" rx="7" />
          <rect x="76" y="46" width="14" height="70" rx="7" />
        </>
      )}

      {feminino ? (
        <>
          <rect x="30" y="100" width="16" height="90" rx="8" />
          <rect x="54" y="100" width="16" height="90" rx="8" />
        </>
      ) : (
        <>
          <rect x="34" y="96" width="14" height="94" rx="7" />
          <rect x="52" y="96" width="14" height="94" rx="7" />
        </>
      )}
    </svg>
  );
}
