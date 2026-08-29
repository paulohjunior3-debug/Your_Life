"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, User } from "lucide-react";
import { atualizarAvatar } from "./avatar-actions";

function redimensionarImagem(file: File, maxLado = 400, qualidade = 0.85) {
  return new Promise<Blob>((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error("Não foi possível ler o arquivo"));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo não é uma imagem válida"));
      img.onload = () => {
        const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = img.width * escala;
        canvas.height = img.height * escala;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas não suportado nesse navegador"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) =>
            blob ? resolve(blob) : reject(new Error("Falha ao processar imagem")),
          "image/jpeg",
          qualidade
        );
      };
      img.src = leitor.result as string;
    };
    leitor.readAsDataURL(file);
  });
}

export function AvatarUpload({
  avatarUrl,
  nome,
}: {
  avatarUrl: string | null;
  nome: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setErro(null);

    try {
      const blob = await redimensionarImagem(file);
      setPreview(URL.createObjectURL(blob));

      const formData = new FormData();
      formData.set("avatar", blob, "avatar.jpg");

      startTransition(async () => {
        const resultado = await atualizarAvatar(formData);
        if (resultado?.error) {
          setErro(resultado.error);
          setPreview(null);
        }
      });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao processar imagem");
    }
  }

  const src = preview ?? avatarUrl;

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-foreground-secondary"
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={nome} className="h-full w-full object-cover" />
        ) : (
          <User size={28} />
        )}
        {pending && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-[10px] text-foreground">
            Enviando...
          </span>
        )}
        <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border border-background bg-accent text-background">
          <Camera size={11} />
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />

      {erro && <p className="text-xs text-status-missed">{erro}</p>}
    </div>
  );
}
