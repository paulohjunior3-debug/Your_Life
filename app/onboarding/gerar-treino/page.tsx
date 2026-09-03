import { DiaPicker } from "./dia-picker";

export default function GerarTreinoPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 px-4 py-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Quais dias você vai treinar?
        </h1>
        <p className="mt-1 text-sm text-foreground-secondary">
          Escolhe quantos dias quiser, na combinação que fizer sentido pra
          sua rotina.
        </p>
      </div>

      <DiaPicker />
    </div>
  );
}
