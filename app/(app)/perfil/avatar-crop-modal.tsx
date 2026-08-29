"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { recortarImagem } from "@/lib/utils/crop-image";

export function AvatarCropModal({
  imagemSrc,
  onCancelar,
  onConfirmar,
}: {
  imagemSrc: string;
  onCancelar: () => void;
  onConfirmar: (blob: Blob) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const [processando, setProcessando] = useState(false);

  const onCropComplete = useCallback((_area: Area, areaEmPixels: Area) => {
    setAreaPixels(areaEmPixels);
  }, []);

  async function confirmar() {
    if (!areaPixels) return;
    setProcessando(true);
    try {
      const blob = await recortarImagem(imagemSrc, areaPixels);
      onConfirmar(blob);
    } finally {
      setProcessando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="relative flex-1">
        <Cropper
          image={imagemSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-card p-4">
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-accent"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancelar}
            disabled={processando}
            className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 font-medium text-foreground transition-colors hover:bg-background disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={processando || !areaPixels}
            className="flex-1 rounded-lg bg-accent px-3 py-2 font-medium text-background transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            {processando ? "Processando..." : "Usar foto"}
          </button>
        </div>
      </div>
    </div>
  );
}
