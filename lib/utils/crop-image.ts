export type AreaPixels = { x: number; y: number; width: number; height: number };

function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível carregar a imagem"));
    img.src = src;
  });
}

export async function recortarImagem(
  imageSrc: string,
  area: AreaPixels,
  tamanhoSaida = 400,
  qualidade = 0.85
): Promise<Blob> {
  const img = await carregarImagem(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = tamanhoSaida;
  canvas.height = tamanhoSaida;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas não suportado nesse navegador");

  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    tamanhoSaida,
    tamanhoSaida
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Falha ao processar imagem"))),
      "image/jpeg",
      qualidade
    );
  });
}
