// As fotos de carros são processadas no upload em duas variantes WebP:
// a principal (1200x675) e uma thumbnail (400x200) salva em uma subpasta
// "thumb" ao lado do arquivo original. Essa função deriva o caminho da
// thumbnail a partir do caminho da imagem principal salvo no banco.
export function thumbPath(mainPath) {
    if (!mainPath) return mainPath;
    const idx = mainPath.lastIndexOf("/");
    if (idx === -1) return mainPath;
    return `${mainPath.slice(0, idx)}/thumb/${mainPath.slice(idx + 1)}`;
}
