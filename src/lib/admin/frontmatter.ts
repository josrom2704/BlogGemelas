// Lee y escribe el formato de los posts (frontmatter YAML + Markdown).
// Solo soporta lo que usan los posts del blog: valores de una línea (texto,
// fechas, booleanos) y listas en formato ["a", "b"]. Mantiene el mismo orden
// de campos que templates/post.md.

import type { AutorId, Categoria } from "../../config";

export interface DatosPost {
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  cover: string;
  coverAlt?: string;
  category: Categoria;
  tags: string[];
  author: AutorId;
  draft: boolean;
}

const REGEX_ARCHIVO = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function leerValor(crudo: string): unknown {
  const valor = crudo.trim();
  if (valor === "true" || valor === "false") return valor === "true";
  if (valor.startsWith('"') || valor.startsWith("[")) {
    try {
      return JSON.parse(valor);
    } catch {
      // Cae al tratamiento de texto plano.
    }
  }
  if (valor.startsWith("'") && valor.endsWith("'")) {
    return valor.slice(1, -1).replace(/''/g, "'");
  }
  if (valor.startsWith("[") && valor.endsWith("]")) {
    return valor
      .slice(1, -1)
      .split(",")
      .map((t) => t.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
  }
  return valor;
}

export function parsearPost(texto: string): { datos: DatosPost; contenido: string } {
  const coincidencia = REGEX_ARCHIVO.exec(texto);
  if (!coincidencia) throw new Error("El archivo no tiene frontmatter válido.");

  const campos: Record<string, unknown> = {};
  for (const linea of coincidencia[1].split(/\r?\n/)) {
    const separador = linea.indexOf(":");
    if (separador <= 0 || linea.startsWith(" ") || linea.startsWith("#")) continue;
    campos[linea.slice(0, separador).trim()] = leerValor(linea.slice(separador + 1));
  }

  const datos: DatosPost = {
    title: String(campos.title ?? ""),
    date: String(campos.date ?? "").slice(0, 10),
    description: String(campos.description ?? ""),
    cover: String(campos.cover ?? ""),
    coverAlt: campos.coverAlt ? String(campos.coverAlt) : undefined,
    category: String(campos.category ?? "") as Categoria,
    tags: Array.isArray(campos.tags) ? campos.tags.map(String) : [],
    author: String(campos.author ?? "ambas") as AutorId,
    draft: campos.draft === true,
  };

  return { datos, contenido: coincidencia[2].replace(/^\r?\n/, "") };
}

export function serializarPost(datos: DatosPost, contenido: string): string {
  const texto = (v: string) => JSON.stringify(v);
  const lineas = [
    "---",
    `title: ${texto(datos.title)}`,
    `date: ${datos.date}`,
    `description: ${texto(datos.description)}`,
    `cover: ${texto(datos.cover)}`,
    ...(datos.coverAlt ? [`coverAlt: ${texto(datos.coverAlt)}`] : []),
    `category: ${texto(datos.category)}`,
    `tags: [${datos.tags.map(texto).join(", ")}]`,
    `author: ${texto(datos.author)}`,
    `draft: ${datos.draft}`,
    "---",
    "",
    contenido.replace(/\r\n/g, "\n").trim(),
    "",
  ];
  return lineas.join("\n");
}
