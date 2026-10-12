// Convierte el FormData enviado por el editor del panel en datos validados.

import { categorias, type AutorId, type Categoria } from "../../config";

export const AUTORES_VALIDOS: readonly AutorId[] = ["fernanda", "jimena", "ambas"];

// Vercel limita el cuerpo de cada petición a ~4.5MB, por eso el editor
// comprime las imágenes en el navegador antes de enviarlas.
export const MAX_BYTES_IMAGEN = 4 * 1024 * 1024;

export const EXTENSIONES_IMAGEN: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Nombre que el editor asigna a las imágenes insertadas en el contenido. */
export const REGEX_NOMBRE_IMAGEN = /^[a-z0-9][a-z0-9-]{0,80}\.(jpg|png|webp)$/;

export class ErrorValidacion extends Error {}

export interface ImagenSubida {
  extension: string;
  base64: string;
}

export interface EntradaPost {
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  autor: AutorId;
  contenido: string;
  tags: string[];
  fecha?: string;
  borrador: boolean;
  portadaAlt?: string;
  portada?: ImagenSubida;
  quitarPortada: boolean;
  /** Imágenes insertadas en el contenido, por nombre de archivo. */
  imagenes: Map<string, ImagenSubida>;
}

function texto(datos: FormData, campo: string): string {
  return String(datos.get(campo) ?? "").trim();
}

export async function leerImagen(archivo: FormDataEntryValue | null): Promise<ImagenSubida | undefined> {
  if (!(archivo instanceof File) || archivo.size === 0) return undefined;
  if (archivo.size > MAX_BYTES_IMAGEN) {
    throw new ErrorValidacion(`La imagen "${archivo.name}" pesa más de 4MB.`);
  }
  const extension = EXTENSIONES_IMAGEN[archivo.type];
  if (!extension) {
    throw new ErrorValidacion(`La imagen "${archivo.name}" debe ser JPG, PNG o WEBP.`);
  }
  const base64 = Buffer.from(await archivo.arrayBuffer()).toString("base64");
  return { extension, base64 };
}

export async function leerFormularioPost(datos: FormData): Promise<EntradaPost> {
  const titulo = texto(datos, "titulo");
  const descripcion = texto(datos, "descripcion");
  const contenido = texto(datos, "contenido");
  const categoria = texto(datos, "categoria") as Categoria;
  const autor = texto(datos, "autor") as AutorId;
  const fecha = texto(datos, "fecha");

  if (!titulo || !descripcion || !contenido) {
    throw new ErrorValidacion("Título, descripción y contenido son obligatorios.");
  }
  if (titulo.length > 120 || descripcion.length > 220) {
    throw new ErrorValidacion("El título o la descripción son demasiado largos.");
  }
  if (!categorias.includes(categoria)) throw new ErrorValidacion("La categoría no es válida.");
  if (!AUTORES_VALIDOS.includes(autor)) throw new ErrorValidacion("La autora no es válida.");
  if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new ErrorValidacion("La fecha no es válida.");

  const tags = texto(datos, "tags")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const imagenes = new Map<string, ImagenSubida>();
  for (const archivo of datos.getAll("imagenes")) {
    if (!(archivo instanceof File)) continue;
    if (!REGEX_NOMBRE_IMAGEN.test(archivo.name)) {
      throw new ErrorValidacion(`Nombre de imagen no válido: ${archivo.name}`);
    }
    // Solo se suben las imágenes que siguen referenciadas en el texto.
    if (!contenido.includes(archivo.name)) continue;
    const imagen = await leerImagen(archivo);
    if (imagen) imagenes.set(archivo.name, imagen);
  }

  return {
    titulo,
    descripcion,
    categoria,
    autor,
    contenido,
    tags,
    fecha: fecha || undefined,
    borrador: datos.get("borrador") === "on",
    portadaAlt: texto(datos, "portadaAlt") || undefined,
    portada: await leerImagen(datos.get("portada")),
    quitarPortada: datos.get("quitarPortada") === "on",
    imagenes,
  };
}
